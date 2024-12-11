import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class RequestMagicLinkInput {
  @Field()
  @IsEmail()
  email: string;
}
