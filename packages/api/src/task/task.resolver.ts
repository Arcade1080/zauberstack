import { HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { PrismaService } from 'nestjs-prisma';
import { RequiredPermissions } from '../auth/decorators/required-permissions.decorator';
import { Permission } from '../auth/enums/permission';
import { PaginationArgs } from '../common/pagination/pagination.args';
import { SubscriptionLimitConfig } from '../config/config.interface';
import { CurrentUser } from '../user/decorators/user.decorator';
import { User } from '../user/graphql/models/user.model';
import { AddTagsToTasksInput } from './graphql/inputs/add-tags-to-task.input';
import { CreateTaskInput } from './graphql/inputs/create-task.input';
import { TaskOrder } from './graphql/inputs/task-order.input';
import { UpdateTaskInput } from './graphql/inputs/update-task.input';
import { TaskConnection } from './graphql/models/pagination/task-connection.model';
import { Task } from './graphql/models/task.model';
import { TaskService } from './task.service';

@Resolver(() => Task)
export class TaskResolver {
  constructor(
    private taskService: TaskService,
    private configService: ConfigService,
    private prismaService: PrismaService,
  ) {}

  @Query(() => Task)
  @RequiredPermissions(Permission.Read_Tasks)
  async getTaskById(@Args('taskId', { type: () => String }) taskId: string) {
    return this.taskService.getTaskById(taskId);
  }

  @Mutation(() => Task)
  @RequiredPermissions(Permission.Delete_Tasks)
  deleteTaskById(@Args('taskId', { type: () => String }) taskId: string) {
    return this.taskService.deleteTaskById(taskId);
  }

  @Mutation(() => [Task])
  @RequiredPermissions(Permission.Update_Tasks)
  addTagstoTasks(@Args('data') data: AddTagsToTasksInput) {
    return this.taskService.addTagsToTasks(data);
  }

  @Query(() => TaskConnection)
  @RequiredPermissions(Permission.Read_Tasks)
  getTasks(
    @Args() paginationArgs: PaginationArgs,
    @Args({ name: 'tags', type: () => [String], nullable: true })
    tags: string[],
    @Args({ name: 'query', type: () => String, nullable: true })
    query: string,
    @Args({ name: 'status', type: () => String, nullable: true })
    status: string,
    @Args({
      name: 'orderBy',
      type: () => TaskOrder,
      nullable: true,
    })
    orderBy: TaskOrder,
    @CurrentUser() user: User,
  ) {
    return this.taskService.getTasks(
      paginationArgs,
      tags,
      query,
      status,
      orderBy,
      user,
    );
  }

  @Mutation(() => Task)
  @RequiredPermissions(Permission.Create_Tasks)
  async createTask(
    @Args('data') data: CreateTaskInput,
    @CurrentUser() user: User,
  ) {
    const subscriptionLimits =
      this.configService.get<SubscriptionLimitConfig>('subscriptionLimits');

    const subscriptionProductName =
      user.account?.subscriptions?.length > 0
        ? user.account.subscriptions[0].stripeProductName.toLowerCase()
        : 'free';

    const limit = subscriptionLimits[subscriptionProductName]['tasks'];

    if (limit) {
      const count = await this.prismaService.task.count({
        where: {
          createdBy: {
            account: {
              id: user.account.id,
            },
          },
        },
      });

      if (count >= limit) {
        throw new Error(
          `You have reached your limit of ${limit} tasks. Please upgrade your plan to create more tasks.`,
        );
      }
    }

    return this.taskService.createTask(data, user.id);
  }

  @Mutation(() => String)
  @RequiredPermissions(Permission.Delete_Tasks)
  async deleteTasks(
    @Args('taskIds', { type: () => [String] }) taskIds: string[],
  ) {
    await this.taskService.deleteTasks(taskIds);
    return HttpStatus.OK;
  }

  @Mutation(() => Task)
  @RequiredPermissions(Permission.Update_Tasks)
  async toggleTaskStatus(
    @Args('taskId', { type: () => String }) taskId: string,
  ) {
    const task = await this.prismaService.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new Error(`Task with ID ${taskId} not found.`);
    }

    const newStatus = task.status === 'open' ? 'done' : 'open';

    const updatedTask = await this.prismaService.task.update({
      where: { id: taskId },
      data: {
        status: newStatus,
      },
    });

    return updatedTask;
  }

  @Mutation(() => Task)
  @RequiredPermissions(Permission.Update_Tasks)
  updateTask(@Args('data') data: UpdateTaskInput) {
    return this.taskService.updateTask(data);
  }

  @ResolveField('createdBy')
  createdBy(@Parent() task: Task) {
    return this.prismaService.task
      .findUnique({
        where: {
          id: task.id,
        },
      })
      .createdBy({
        select: {
          id: true,
          firstname: true,
          lastname: true,
          email: true,
        },
      });
  }
}
