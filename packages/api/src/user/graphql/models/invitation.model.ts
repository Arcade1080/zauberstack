import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Invitation {
  @Field(() => String, { nullable: true })
  email?: string;
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: true })
  role?: string;
  @Field(() => Date, { nullable: true })
  createdAt?: Date;
}
