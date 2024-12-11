import { Field, InputType } from '@nestjs/graphql';
import { OrderDirection } from './order-direction.enum';

@InputType({ isAbstract: true })
export abstract class Order {
  @Field(() => OrderDirection)
  direction: OrderDirection;
}
