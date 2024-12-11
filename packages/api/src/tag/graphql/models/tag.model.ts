import { ObjectType } from '@nestjs/graphql';
import { Task } from '../../../task/graphql/models/task.model';
import { BaseModel } from '../../../common/base.model';

@ObjectType()
export class Tag extends BaseModel {
  name?: string;
  slug?: string;
  tasks?: Task[];
}
