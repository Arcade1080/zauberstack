import { InputType, registerEnumType } from '@nestjs/graphql';
import { Order } from '../../../common/order/order.input';

export enum TaskOrderField {
  id = 'id',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
  published = 'published',
  title = 'title',
  content = 'content',
}

registerEnumType(TaskOrderField, {
  name: 'TaskOrderField',
  description: 'Properties by which task connections can be ordered.',
});

@InputType()
export class TaskOrder extends Order {
  field: TaskOrderField;
}
