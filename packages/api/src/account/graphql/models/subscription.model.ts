import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '../../../common/base.model';

@ObjectType()
export class AccountSubscription extends BaseModel {
  @Field({ nullable: true })
  stripeCurrentPeriodStart: Date;
  @Field({ nullable: true })
  stripeCurrentPeriodEnd: Date;
  @Field({ nullable: true })
  stripeCancelAt: Date;
  @Field({ nullable: true })
  stripeCanceledAt: Date;
  @Field({ nullable: true })
  stripeProductId: string;
  @Field({ nullable: true })
  stripeCancelAtPeriodEnd: boolean;
  @Field({ nullable: true })
  stripeSubscriptionId: string;
  @Field({ nullable: true })
  plan: string;
  @Field({ nullable: true })
  stripeProductName: string;
}
