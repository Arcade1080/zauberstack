import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateTaskInput {
  @Field()
  @IsNotEmpty()
  taskId: string;

  @Field()
  @IsNotEmpty()
  title: string;

  @Field() description: string;

  @Field(() => [String], { nullable: true }) // Declare an array of strings
  tags: string[];
}
