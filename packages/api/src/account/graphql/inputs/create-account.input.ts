import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateUserInput } from '../../../auth/graphql/inputs/createUser.input';
import { CreateOrganizationInput } from '../../../organization/graphql/inputs/create-organization.input';

@InputType()
export class SignUpDto {
  @Field()
  @ValidateNested()
  @Type(() => CreateOrganizationInput)
  organization: CreateOrganizationInput;

  @Field()
  @ValidateNested()
  @Type(() => CreateUserInput)
  owner: CreateUserInput;
}
