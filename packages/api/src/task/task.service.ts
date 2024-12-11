import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { Injectable } from '@nestjs/common';
import { Prisma, ProgressStatus } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { PaginationArgs } from '../common/pagination/pagination.args';
import { User } from '../user/graphql/models/user.model';
import { CreateTaskInput } from './graphql/inputs/create-task.input';
import { TaskOrder } from './graphql/inputs/task-order.input';
import { UpdateTaskInput } from './graphql/inputs/update-task.input';

@Injectable()
export class TaskService {
  constructor(private prismaService: PrismaService) {}

  getTasksForUserId(userId: string): Promise<any[]> {
    return this.prismaService.task.findMany({
      where: {
        createdById: userId,
      },
    });
  }

  async getTasks(
    paginationArgs: PaginationArgs,
    tags: string[],
    query: string,
    status: string,
    orderBy: TaskOrder,
    user: User,
  ) {
    const { skip, first, last, before, after } = paginationArgs;

    const idsOfUsersOfTheSameAccount = await this.prismaService.user.findMany({
      where: {
        accountId: user.account.id,
      },
      select: {
        id: true,
      },
    });

    const relevantUserIds = idsOfUsersOfTheSameAccount.map((user) => user.id);

    let tagQuery = undefined;
    if (tags && tags.length > 0) {
      tagQuery = { some: { id: { in: tags } } };
    }
    return findManyCursorConnection(
      (args) => {
        return this.prismaService.task.findMany({
          where: {
            // createdBy: {
            //   account: {
            //     id: user.account.id,
            //   },
            // },
            createdBy: {
              id: {
                in: relevantUserIds,
              },
            },
            title: { contains: query || '' },
            tags: tagQuery,
            status: status ? { equals: status as ProgressStatus } : undefined,
          },
          include: { tags: true, createdBy: true },
          orderBy: orderBy ? { [orderBy.field]: orderBy.direction } : undefined,
          ...args,
          skip: skip ? args.skip + skip : args.skip,
        });
      },
      () => {
        return this.prismaService.task.count({
          where: {
            createdBy: {
              account: {
                id: user.account.id,
              },
            },
            title: { contains: query || '' },
            tags: tagQuery,
            status: status ? { equals: status as ProgressStatus } : undefined,
          },
        });
      },
      { first, last, before, after },
    );
  }

  deleteTasks(taskIds: string[]): Promise<Prisma.BatchPayload> {
    return this.prismaService.task.deleteMany({
      where: {
        id: {
          in: taskIds,
        },
      },
    });
  }

  async addTagsToTasks(data: {
    taskIds: string[];
    tagIds: string[];
  }): Promise<any[]> {
    const updatedTasks: any[] = [];
    for (const taskId of data.taskIds) {
      const updatedTask = await this.prismaService.task.update({
        where: {
          id: taskId,
        },
        data: {
          tags: {
            connect: data.tagIds.map((tagId) => ({
              id: tagId,
            })),
          },
        },
      });
      updatedTasks.push(updatedTask);
    }

    return updatedTasks;
  }

  async updateTask(data: UpdateTaskInput): Promise<any> {
    const tagIds = data.tags;

    const updatedTask = await this.prismaService.task.update({
      where: {
        id: data.taskId,
      },
      data: {
        description: data.description,
        title: data.title,
        tags: {
          set: [],
          connect:
            tagIds.length > 0 ? tagIds.map((tagId) => ({ id: tagId })) : [],
        },
      },
      include: {
        tags: true,
      },
    });

    return updatedTask;
  }

  async createTask(data: CreateTaskInput, userId: string): Promise<any> {
    const newTask = await this.prismaService.task.create({
      data: {
        description: data.description,
        title: data.title,
        createdById: userId,
      },
    });
    if (data.tags && data.tags.length > 0) {
      await this.prismaService.task.update({
        where: { id: newTask.id },
        data: { tags: { connect: data.tags.map((tag) => ({ id: tag })) } },
      });
    }

    return newTask;
  }

  deleteTaskById(taskId: string): Promise<any | null> {
    return this.prismaService.task.delete({
      where: {
        id: taskId,
      },
    });
  }

  getTaskById(taskId: string) {
    return this.prismaService.task.findFirst({
      where: {
        id: taskId,
      },
      include: {
        tags: true,
        createdBy: true,
      },
    });
  }
}
