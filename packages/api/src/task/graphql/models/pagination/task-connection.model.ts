import { ObjectType } from '@nestjs/graphql';
import PaginatedResponse from '../../../../common/pagination/pagination.model';
import { Task } from '../task.model';

@ObjectType()
export class TaskConnection extends PaginatedResponse(Task) {}
