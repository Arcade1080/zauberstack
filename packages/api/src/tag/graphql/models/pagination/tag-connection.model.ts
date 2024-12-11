import { ObjectType } from '@nestjs/graphql';
import PaginatedResponse from '../../../../common/pagination/pagination.model';
import { Tag } from '../tag.model';

@ObjectType()
export class TagConnection extends PaginatedResponse(Tag) {}
