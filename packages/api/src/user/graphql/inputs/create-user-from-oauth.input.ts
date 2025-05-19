import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, IsOptional } from 'class-validator';

@InputType()
export class RegisterUserFromOAuthInput {
  @Field()
  @IsEmail()
  email: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  firstname?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  lastname?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @Field()
  @IsString()
  provider: string; // 'google', 'github', etc.
}
