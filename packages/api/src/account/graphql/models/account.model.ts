import { ObjectType } from '@nestjs/graphql';
import { AccountSubscription } from './subscription.model';
import { BaseModel } from '../../../common/base.model';

@ObjectType()
export class Account extends BaseModel {
  id: string;
  subscriptions: AccountSubscription[];
}
