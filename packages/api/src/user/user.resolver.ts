import { ConfigService } from '@nestjs/config';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { PrismaService } from 'nestjs-prisma';
import { AuthService } from '../auth/auth.service';
import { Public } from '../auth/decorators/public.decorator';
import { RequiredPermissions } from '../auth/decorators/required-permissions.decorator';
import { Permission } from '../auth/enums/permission';
import { Token } from '../auth/graphql/models/token.model';
import { SubscriptionLimitConfig } from '../config/config.interface';
import { MethodNotAllowedError } from '../errors/MethodNotAllowedError';
import { UserEmailAlreadyUsedError } from '../errors/UserEmailAlreadyUsedError';
import { GraphQLApiMethodNotAllowed } from '../errors/graphql/MethodNotAllowedGraphQLApiError';
import { UserEmailAlreadyUsedGraphQLApiError } from '../errors/graphql/UserEmailAlreadyUsedGraphQLApiError';
import { StripeService } from '../stripe/stripe.service';
import { TokenNotFoundError } from './../errors/TokenNotFoundError';
import { ResetTokenExpiredGraphQLApiError } from './../errors/graphql/ResetTokenExpiredGraphQLApiError';
import { ResetTokenInvalidGraphQLApiError } from './../errors/graphql/ResetTokenInvalidGraphQLApiError';
import { GraphQLApiErrorTokenNotFound } from './../errors/graphql/TokenNotFoundGraphQLApiError';
import { CurrentUser } from './decorators/user.decorator';
import { GraphQLApiErrorUserNotFound } from '../errors/graphql/UserNotFoundGraphQLApiError';
import { UserNotFoundError } from '../errors/UserNotFoundError';
import { AcceptInvitationInput } from './graphql/inputs/acceptInvitation.input';
import { ChangePasswordInput } from './graphql/inputs/change-password.input';
import { ForgotPasswordInput } from './graphql/inputs/forgot-password-request.input';
import { InviteesInput } from './graphql/inputs/invitees.input';
import { ResetPasswordInput } from './graphql/inputs/reset-password.input';
import { UpdateUserInput } from './graphql/inputs/update-user.input';
import { User } from './graphql/models/user.model';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private userService: UserService,
    private stripeService: StripeService,
    private prismaService: PrismaService,
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Query(() => User)
  me(@CurrentUser() user: User) {
    return user;
  }

  @Mutation(() => User)
  updateUser(
    @CurrentUser() user: User,
    @Args('data') newUserData: UpdateUserInput,
  ) {
    return this.userService.updateUser(user.id, newUserData);
  }

  @Mutation(() => User)
  changePassword(
    @CurrentUser() user: User,
    @Args('data') changePassword: ChangePasswordInput,
  ) {
    if (this.configService.get('IS_DEMO') === '1') {
      throw new Error('Sorry, but this feature is disabled in demo mode.');
    }
    return this.userService.changePassword(
      user.id,
      user.password,
      changePassword,
    );
  }
  @Public()
  @Mutation(() => User)
  async resetPassword(@Args('data') resetPasswordInput: ResetPasswordInput) {
    return this.userService
      .resetPassword(resetPasswordInput)
      .then((updatedUser) => updatedUser)
      .catch((error) => {
        if (error instanceof UserNotFoundError) {
          throw new GraphQLApiErrorUserNotFound();
          // TODO ugly
        } else if (
          error instanceof PrismaClientKnownRequestError &&
          error.code === 'P2025'
        ) {
          throw new GraphQLApiErrorTokenNotFound();
        } else if (error instanceof TokenNotFoundError) {
          throw new GraphQLApiErrorTokenNotFound();
        } else if (error instanceof TokenExpiredError) {
          throw new ResetTokenExpiredGraphQLApiError(error.expiredAt);
        } else if (error instanceof JsonWebTokenError) {
          throw new ResetTokenInvalidGraphQLApiError();
        }
        throw error;
      });
  }

  @Public()
  @Mutation(() => Token)
  async acceptInvitation(
    @Args('data') acceptInvitationInput: AcceptInvitationInput,
  ) {
    return this.userService
      .acceptInvitation(acceptInvitationInput)
      .then(async (createdUser) => {
        const { accessToken, refreshToken } =
          await this.authService.generateTokens({
            userId: createdUser.id,
          });
        // setRefreshTokenCookie(context.req.res, refreshToken);
        return {
          accessToken,
          refreshToken: refreshToken.token,
        };
      })
      .catch((error) => {
        if (
          error instanceof PrismaClientKnownRequestError &&
          error.code === 'P2025'
        ) {
          throw new GraphQLApiErrorTokenNotFound();
        } else if (error instanceof TokenExpiredError) {
          throw new ResetTokenExpiredGraphQLApiError(error.expiredAt);
        } else if (error instanceof JsonWebTokenError) {
          throw new ResetTokenInvalidGraphQLApiError();
        }
        throw error;
      });
  }

  @Mutation(() => String)
  @RequiredPermissions(Permission.Invite_Users)
  async inviteUsers(
    @CurrentUser() currentUser: User,
    @Args('data') { invitees }: InviteesInput,
  ) {
    const subscriptionLimits =
      this.configService.get<SubscriptionLimitConfig>('subscriptionLimits');

    let limit: any;
    if (currentUser.account?.subscriptions.length === 0) {
      limit = subscriptionLimits['free']['teamMembers'];
    } else {
      limit =
        subscriptionLimits[
          currentUser.account?.subscriptions[0]?.stripeProductName.toLowerCase()
        ]['teamMembers'];
    }

    if (limit) {
      const existingInvitationCount = await this.prismaService.invitation.count(
        {
          where: {
            account: { id: currentUser.account.id },
          },
        },
      );

      const existingUserCount = await this.prismaService.user.count({
        where: {
          account: { id: currentUser.account.id },
          deletedAt: null, // assuming you want to exclude deleted users
        },
      });

      if (
        existingUserCount + existingInvitationCount + invitees.length >
        limit
      ) {
        throw new Error(
          `You have reached your limit of ${limit} users. Please upgrade your plan to invite more users.`,
        );
      }
    }

    if (this.configService.get('IS_DEMO') === '1') {
      throw new Error('Sorry, but this feature is disabled in demo mode.');
    }

    return this.userService
      .sendInvitationEmail(currentUser, invitees)
      .then(() => 'ok')
      .catch((error: Error) => {
        if (error instanceof UserEmailAlreadyUsedError) {
          throw new UserEmailAlreadyUsedGraphQLApiError();
        }
        throw error;
      });
  }

  @Public()
  @Mutation(() => String)
  async sendResetPasswordLink(
    @Args('data') forgotPassword: ForgotPasswordInput,
  ) {
    return this.userService
      .sendPasswordResetLink(forgotPassword)
      .then((confirmation) => confirmation)
      .catch((error) => {
        if (error instanceof UserNotFoundError) {
          throw new GraphQLApiErrorUserNotFound();
        } else if (error instanceof MethodNotAllowedError) {
          throw new GraphQLApiMethodNotAllowed();
        }
        // Internal server error
        throw error;
      });
  }

  @ResolveField('role')
  role(@Parent() user: User) {
    return this.prismaService.user
      .findUnique({ where: { id: user.id } })
      .role({ include: { permissions: true } });
  }

  @ResolveField('account')
  account(@Parent() user: User) {
    return this.prismaService.user
      .findUnique({ where: { id: user.id } })
      .account({ include: { subscriptions: true } });
  }

  @Mutation(() => String)
  @RequiredPermissions(Permission.Invite_Users)
  async requestCheckoutUrl(
    @CurrentUser() currentUser: User,
    @Args('productId') productId: string,
  ) {
    return this.stripeService
      .createCheckoutSessionUrl(productId, currentUser)
      .then((a) => a)
      .catch((error) => {
        // Internal server error
        throw error;
      });
  }

  @Mutation(() => String)
  @RequiredPermissions(Permission.Invite_Users)
  async requestCustomerPortalUrl(@CurrentUser() currentUser: User) {
    return this.stripeService
      .createPortalSessionUrl(currentUser)
      .then((a) => a)
      .catch((error) => {
        // Internal server error
        throw error;
      });
  }

  // @ResolveField('avatar')
  // async avatar(@Parent() user: User) {
  //   const avatar = await this.prismaService.user
  //     .findUnique({ where: { id: user.id } })
  //     .avatar({ select: { filePath: true } });
  //   return avatar?.filePath;
  // }

  @ResolveField('isAccountOwner')
  async isAccountOwner(@Parent() user: User) {
    const accountOwner = await this.prismaService.user
      .findUnique({ where: { id: user.id } })
      .account({ select: { owner: true } });
    return accountOwner?.owner.id === user.id;
  }
  @ResolveField('plan')
  async plan(@Parent() user: User) {
    const plan = await this.prismaService.user
      .findUnique({ where: { id: user.id } })
      .account({ select: { subscriptions: true } });
    return plan?.subscriptions[0]?.stripeProductName || null;
  }
}
