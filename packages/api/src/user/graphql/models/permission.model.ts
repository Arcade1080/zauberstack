import { ObjectType, HideField, Field } from '@nestjs/graphql';
import { Role } from './role.model';
import { BaseModel } from '../../../common/base.model';

@ObjectType()
export class Permission extends BaseModel {
  @Field(() => String)
  name: string;
  @HideField() roles: Role[];
}
