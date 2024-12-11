import { Field, ObjectType } from '@nestjs/graphql';
import { Token } from './token.model';
import { User } from '../../../user/graphql/models/user.model';

@ObjectType()
export class Auth extends Token {
  @Field(() => User)
  user: User;
}
