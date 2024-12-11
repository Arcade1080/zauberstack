import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Tag } from '../../../tag/graphql/models/tag.model';
import { ProgressStatus } from '@prisma/client';
import { BaseModel } from '../../../common/base.model';
import { User } from '../../../user/graphql/models/user.model';

@ObjectType()
export class Task extends BaseModel {
  @Field(() => Boolean, { nullable: true })
  published: boolean;
  @Field(() => String, { nullable: true })
  title: string;
  @Field(() => String, { nullable: true })
  description: string;
  @Field(() => User, { nullable: true })
  createdBy: User;
  @Field(() => [Tag], { nullable: true })
  tags: Tag[];
  @Field(() => ProgressStatus, { nullable: true })
  status: ProgressStatus;
}

registerEnumType(ProgressStatus, {
  name: 'ProgressStatus',
});
