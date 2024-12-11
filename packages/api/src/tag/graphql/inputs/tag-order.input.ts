import { InputType, registerEnumType } from '@nestjs/graphql';
import { Order } from '../../../common/order/order.input';

export enum TagOrderField {
  createdAt = 'createdAt',
}

registerEnumType(TagOrderField, {
  name: 'TagOrderField',
  description: 'Properties by which tag connections can be ordered.',
});

@InputType()
export class TagOrder extends Order {
  field: TagOrderField;
}
