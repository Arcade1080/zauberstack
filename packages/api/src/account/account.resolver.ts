import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RequiredPermissions } from '../auth/decorators/required-permissions.decorator';
import { Permission } from '../auth/enums/permission';
import { StripeService } from '../stripe/stripe.service';
import { CurrentUser } from '../user/decorators/user.decorator';
import { Invitation } from '../user/graphql/models/invitation.model';
import { User } from '../user/graphql/models/user.model';
import { AccountService } from './account.service';
import { Account } from './graphql/models/account.model';
import { Plan } from './graphql/models/plan.model';
import { AccountSubscription } from './graphql/models/subscription.model';

@Resolver(() => Account)
export class AccountResolver {
  constructor(
    private readonly accountService: AccountService,
    private readonly stripeService: StripeService,
  ) {}

  @Query(() => AccountSubscription, { nullable: true })
  @RequiredPermissions(Permission.Edit_Subscriptions)
  async getActiveSubscription(@CurrentUser() currentUser: User) {
    const sub = await this.accountService.getActiveSubscription(
      currentUser.account.id,
    );

    if (!sub) {
      return null;
    }

    return sub;
  }

  @Query(() => [Plan])
  @RequiredPermissions(Permission.Edit_Subscriptions)
  getAvailablePlans() {
    return this.stripeService.getPlans();
  }

  @Query(() => [User])
  @RequiredPermissions(Permission.Edit_Users)
  async getMembers(
    @CurrentUser() currentUser: User,
    @Args('first', { type: () => Number, nullable: true })
    first: number,
  ) {
    return this.accountService.getMembersForAccountId(
      currentUser.account.id,
      first,
    );
  }

  @Mutation(() => Account)
  @RequiredPermissions(Permission.Edit_Users)
  async deleteAccount(
    @Args('accountId', { type: () => String })
    accountId: string,
  ) {
    return await this.accountService.deleteAccount(accountId);
  }

  @Query(() => [User])
  @RequiredPermissions(Permission.Edit_Users)
  deleteMember(
    @Args('memberId', { type: () => String })
    memberId: string,
  ) {
    return this.accountService.deleteTeamMember(memberId);
  }

  @Query(() => [Invitation])
  @RequiredPermissions(Permission.Edit_Users)
  async getInvitations(@CurrentUser() currentUser: User) {
    return this.accountService.getInvitations(currentUser.account.id);
  }

  @Mutation(() => Invitation)
  deleteInvitation(
    @Args('invitationId', { type: () => String })
    invitationId: string,
  ) {
    return this.accountService.deleteInvitation(invitationId);
  }

  @Mutation(() => Account)
  deleteTeamMember(
    @Args('memberId', { type: () => String })
    memberId: string,
  ) {
    return this.accountService.deleteTeamMember(memberId);
  }
}
