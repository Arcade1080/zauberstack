import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Plan {
  @Field({ nullable: true })
  productName: string;
  @Field({ nullable: true })
  planId: string;
  @Field({ nullable: true })
  productId: string;
  @Field({ nullable: true })
  price: number;
  @Field({ nullable: true })
  interval: string;
  @Field({ nullable: true })
  currency: string;
}
