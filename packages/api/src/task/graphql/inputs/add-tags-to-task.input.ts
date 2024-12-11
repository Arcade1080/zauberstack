import { IsNotEmpty } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AddTagsToTasksInput {
  @Field(() => [String])
  @IsNotEmpty()
  taskIds: string[];

  @Field(() => [String])
  @IsNotEmpty()
  tagIds: string[];
}
