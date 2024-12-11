import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SignInWithMagicLinkInput {
  @Field()
  token: string;
}
