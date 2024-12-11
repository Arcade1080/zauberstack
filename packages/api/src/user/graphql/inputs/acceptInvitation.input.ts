import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { CreateUserInput } from '../../../auth/graphql/inputs/createUser.input';

@InputType()
export class AcceptInvitationInput {
  @Field() user: CreateUserInput;

  @Field()
  @IsNotEmpty()
  token: string;
}
