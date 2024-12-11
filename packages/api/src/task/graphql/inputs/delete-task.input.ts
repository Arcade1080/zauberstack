import { IsNotEmpty } from 'class-validator';
import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class DeleteCampaignArgs {
  @Field()
  @IsNotEmpty()
  campaignId: string;
}
