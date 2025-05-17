import { Account } from '../../../account/graphql/models/account.model';
import { ObjectType, HideField, Field } from '@nestjs/graphql';
import { Role } from './role.model';
import { BaseModel } from '../../../common/base.model';

@ObjectType()
export class User extends BaseModel {
  @Field(() => String)
  email: string;
  @Field(() => String)
  id: string;
  @Field(() => String, { nullable: true })
  firstname?: string;
  @Field(() => String, { nullable: true })
  lastname?: string;
  @Field(() => Role)
  role: Role;
  @Field({ nullable: true })
  avatar?: string;
  @Field(() => String)
  plan?: string;
  @Field(() => Account)
  account: Account;
  @Field(() => Boolean)
  isAccountOwner?: boolean;
  @Field(() => String, { nullable: true })
  supabaseId?: string;
  @HideField() password: string;
}
