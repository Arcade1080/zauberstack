import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class OAuthUserInput {
  @Field()
  email: string;

  @Field({ nullable: true })
  firstname?: string;

  @Field({ nullable: true })
  lastname?: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field()
  supabaseId: string;
}
