import { HttpStatus, NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RequiredPermissions } from '../auth/decorators/required-permissions.decorator';
import { Permission } from '../auth/enums/permission';
import { PaginationArgs } from '../common/pagination/pagination.args';
import { NotFoundGraphQLApiError } from '../errors/graphql/NotFoundGraphQLApiError';
import { CurrentUser } from '../user/decorators/user.decorator';
import { User } from '../user/graphql/models/user.model';
import { TagOrder } from './graphql/inputs/tag-order.input';
import { TagConnection } from './graphql/models/pagination/tag-connection.model';
import { Tag } from './graphql/models/tag.model';
import { TagService } from './tag.service';

@Resolver('Tag')
export class TagResolver {
  constructor(private tagService: TagService) {}

  @Query(() => Tag, { name: 'tag' })
  @RequiredPermissions(Permission.Read_Tags)
  async getTagById(
    @Args('id', { type: () => String })
    id: string,
  ): Promise<Tag> {
    try {
      return await this.tagService.getTagById(id);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new NotFoundGraphQLApiError();
      }
      throw e;
    }
  }

  @Mutation(() => Tag, { name: 'createTag' })
  @RequiredPermissions(Permission.Create_Tags)
  createTag(
    @Args('name', { type: () => String })
    name: string,
    @CurrentUser() user: User,
  ) {
    return this.tagService.createTag(name, user.id);
  }

  @Mutation(() => Tag, { name: 'updateTag' })
  @RequiredPermissions(Permission.Update_Tags)
  async updateTag(
    @Args('id', { type: () => String })
    id: string,
    @Args('name', { type: () => String })
    name: string,
  ) {
    try {
      return await this.tagService.updateTag(id, name);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new NotFoundGraphQLApiError();
      }
      throw e;
    }
  }

  @Mutation(() => Tag)
  @RequiredPermissions(Permission.Delete_Tags)
  async deleteTagById(
    @Args('id', { type: () => String })
    id: string,
  ) {
    try {
      return await this.tagService.deleteTagById(id);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new NotFoundGraphQLApiError();
      }
      throw e;
    }
  }

  @Mutation(() => String)
  @RequiredPermissions(Permission.Delete_Tags)
  async deleteTags(
    @Args('tagIds', { type: () => [String] })
    tagIds: string[],
  ) {
    await this.tagService.deleteTags(tagIds);
    return HttpStatus.OK;
  }

  @Query(() => TagConnection)
  @RequiredPermissions(Permission.Read_Tags)
  async getTags(
    @Args() paginationArgs: PaginationArgs,
    @Args({ name: 'query', type: () => String, nullable: true })
    query: string,
    @Args({ name: 'onlyInUse', type: () => Boolean, nullable: true })
    onlyInUse: boolean,
    @Args({
      name: 'orderBy',
      type: () => TagOrder,
      nullable: true,
    })
    orderBy: TagOrder,
    @CurrentUser() user: User,
  ) {
    return this.tagService.getTags(
      paginationArgs,
      query,
      onlyInUse,
      orderBy,
      user,
    );
  }
}
