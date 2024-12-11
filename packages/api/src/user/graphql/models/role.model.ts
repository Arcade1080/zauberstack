import { ObjectType, HideField, Field } from '@nestjs/graphql';
import { Permission } from './permission.model';
import { User } from './user.model';
import { BaseModel } from '../../../common/base.model';

@ObjectType()
export class Role extends BaseModel {
  @Field(() => String)
  name: string;
  @Field(() => [Permission])
  permissions: Permission[];
  @HideField() users: User[];
}
