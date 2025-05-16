import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  firstname?: string;
  @Field({ nullable: true })
  lastname?: string;
  @Field({ nullable: true })
  avatarId?: string;
  @Field({ nullable: true })
  avatarUrl?: string;
}
