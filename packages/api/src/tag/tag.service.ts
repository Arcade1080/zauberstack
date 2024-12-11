import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, Prisma, Tag } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import slugify from 'slugify';
import { PaginationArgs } from '../common/pagination/pagination.args';
import { TagOrder } from './graphql/inputs/tag-order.input';
import { User } from '../user/graphql/models/user.model';
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';

@Injectable()
export class TagService {
  constructor(private prismaService: PrismaService) {}

  async getTags(
    paginationArgs: PaginationArgs,
    query: string,
    onlyInUse: boolean,
    orderBy: TagOrder,
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

    let whereSubquery = undefined;

    if (onlyInUse) {
      whereSubquery = {
        name: { contains: query || '' },
        tasks: {
          some: {
            id: {
              not: {
                equals: undefined,
              },
            },
            createdBy: {
              account: {
                id: user.account.id,
              },
            },
          },
        },
      };
    } else {
      whereSubquery = {
        name: { contains: query || '' },
        createdBy: {
          id: {
            in: relevantUserIds,
          },
        },
      };
    }

    return findManyCursorConnection(
      (args) => {
        return this.prismaService.tag.findMany({
          where: {
            ...whereSubquery,
          },
          include: {
            tasks: true,
          },
          orderBy: orderBy ? { [orderBy.field]: orderBy.direction } : undefined,
          ...args,
          skip: skip ? args.skip + skip : args.skip,
        });
      },
      () => {
        return this.prismaService.tag.count({
          where: {
            name: { contains: query || '' },
            createdBy: {
              account: {
                id: user.account.id,
              },
            },
          },
        });
      },
      { first, last, before, after },
    );
  }

  async getTagById(id: string): Promise<Tag | null> {
    const tag = await this.prismaService.tag.findUnique({
      where: { id },
    });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    return tag;
  }

  async createTag(name: string, userId: string): Promise<Tag> {
    // check if tag with the same name already exists
    const existingTag = await this.prismaService.tag.findUnique({
      where: { name },
    });

    if (existingTag) {
      throw new NotFoundException('Tag with this name already exists');
    }

    const slug = await this.createUniqueSlug(name);

    return this.prismaService.tag.create({
      data: {
        name,
        slug,
        createdById: userId,
      },
    });
  }

  async updateTag(id: string, name: string): Promise<Tag> {
    const updatedTag = await this.prismaService.tag.update({
      where: { id },
      data: { name },
    });

    if (!updatedTag) {
      throw new NotFoundException();
    }

    return updatedTag;
  }

  async deleteTagById(id: string): Promise<Tag> {
    const deletedTag = await this.prismaService.tag.delete({
      where: { id },
    });

    if (!deletedTag) {
      throw new NotFoundException();
    }

    return deletedTag;
  }

  deleteTags(tagIds: string[]): Promise<Prisma.BatchPayload> {
    return this.prismaService.tag.deleteMany({
      where: {
        id: {
          in: tagIds,
        },
      },
    });
  }

  async removeTagsFromTask(tagIds: string[], taskId: string): Promise<Task> {
    const existingTags = await this.prismaService.tag.findMany({
      where: { id: { in: tagIds } },
    });

    // Filter out the tags that don't exist in the database
    const validTagIds = existingTags.map((tag) => tag.id);

    // Disconnect the valid tags from the task
    return this.prismaService.task.update({
      where: { id: taskId },
      data: {
        tags: {
          disconnect: validTagIds.map((tagId) => ({ id: tagId })),
        },
      },
    });
  }

  async addTagsToTask(tagIds: string[], taskId: string): Promise<Task> {
    const existingTags = await this.prismaService.tag.findMany({
      where: { id: { in: tagIds } },
    });
    // Filter out the tags that don't exist in the database
    const validTagIds = existingTags.map((tag) => tag.id);

    if (validTagIds.length === 0) {
      throw new NotFoundException('No valid tags found');
    }

    // Connect the tags with the campaign
    return this.prismaService.task.update({
      where: { id: taskId },
      data: {
        tags: {
          connect: validTagIds.map((tagId) => ({ id: tagId })),
        },
      },
    });
  }

  private async createUniqueSlug(
    tagName: string,
    suffix = '',
  ): Promise<string> {
    const baseSlug = slugify(tagName, { lower: true });
    const uniqueSlug = suffix ? `${baseSlug}-${suffix}` : baseSlug;

    // Check if the generated slug exists in the database
    const existingTag = await this.prismaService.tag.findUnique({
      where: { slug: uniqueSlug },
    });

    // If the slug is not unique, recursively call the function with an incremented suffix
    if (existingTag) {
      const newSuffix = (parseInt(suffix) || 0) + 1;
      return this.createUniqueSlug(tagName, newSuffix.toString());
    }

    return uniqueSlug;
  }
}
