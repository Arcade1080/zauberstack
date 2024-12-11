import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { InviteUserInput } from './invite-user.input';

@InputType()
export class InviteesInput {
  @Field(() => [InviteUserInput])
  @IsNotEmpty()
  invitees: InviteUserInput[];
}
