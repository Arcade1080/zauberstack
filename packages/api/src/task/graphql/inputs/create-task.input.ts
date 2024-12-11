import { IsNotEmpty } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateTaskInput {
  @Field()
  @IsNotEmpty()
  title: string;

  @Field() description: string;

  @Field(() => [String], { nullable: true }) // Declare an array of strings
  tags: string[];
}
