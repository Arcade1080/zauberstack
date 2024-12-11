import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { UserService } from '../user/user.service';

@Module({
  providers: [OrganizationService, UserService],
  exports: [OrganizationService],
})
export class OrganizationModule {}
