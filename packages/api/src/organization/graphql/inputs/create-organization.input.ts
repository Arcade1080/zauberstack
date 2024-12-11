import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateOrganizationInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  // @Field({ nullable: true })
  // @IsString()
  // line1?: string;

  // @Field({ nullable: true })
  // @IsString()
  // line2?: string;

  // @Field({ nullable: true })
  // @IsString()
  // zip?: string;

  // @Field({ nullable: true })
  // @IsString()
  // city?: string;

  // @Field({ nullable: true })
  // @IsString()
  // country?: string;
}
