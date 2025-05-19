import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Account, Subscription } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { Role } from '../auth/enums/role';
import { StripeService } from '../stripe/stripe.service';
import { UserService } from '../user/user.service';
import { SignUpDto } from './graphql/inputs/create-account.input';
import { SupabaseAuthService } from '../supabase/supabase-auth.service';

@Injectable()
export class AccountService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
    private stripeService: StripeService,
    private configService: ConfigService,
    private supabaseAuthService: SupabaseAuthService,
  ) {}

  async deleteAccount(accountId: string): Promise<Account> {
    // Get the account to be deleted

    if (this.configService.get('IS_DEMO') === '1') {
      throw new Error('This demo account cannot be deleted');
    }

    const account = await this.prismaService.account.findUnique({
      where: { id: accountId },
      include: {
        member: true,
        subscriptions: true,
      },
    });

    // If the account is not found, throw an error
    if (!account) {
      throw new Error('Account not found');
    }

    // Delete the associated stripe customer and subscriptions
    if (account.stripeCustomerId) {
      try {
        await this.stripeService.deleteStripeCustomer(account.stripeCustomerId);
      } catch (error) {
        console.error('Failed to delete Stripe customer:', error);
        // Log the error or handle it as needed.
        // Here, we are simply logging the error and proceeding with the deletion.
      }
    }

    // Delete the associated members of the account and their Supabase accounts
    if (account.member && account.member.length > 0) {
      for (const member of account.member) {
        // Delete the Supabase user if they have a supabaseId
        if (member.supabaseId) {
          try {
            await this.supabaseAuthService.deleteSupabaseUser(
              member.supabaseId,
            );
          } catch (error) {
            console.error(
              `Failed to delete Supabase user ${member.supabaseId}:`,
              error,
            );
            // Continue with deletion of other users
          }
        }
      }

      // Delete all users from the database
      const memberIds = account.member.map((member) => member.id);
      await this.prismaService.user.deleteMany({
        where: { id: { in: memberIds } },
      });
    }

    // Perform the account deletion along with related data
    const deletedAccount = await this.prismaService.account.delete({
      where: { id: accountId },
      include: {
        member: true,
        subscriptions: true,
      },
    });

    return deletedAccount;
  }

  async getMembersForAccountId(
    accountId: string,
    first: number,
  ): Promise<any[]> {
    const members = await this.prismaService.account
      .findUnique({
        where: {
          id: accountId,
        },
      })
      .member({
        orderBy: {
          createdAt: 'desc',
        },
        take: first ? first : undefined,
      });

    const formatedMembers = this.formatMembers(members, accountId);
    return formatedMembers;
  }
  getInvitations(accountId: string): Promise<any[]> {
    return this.prismaService.invitation.findMany({
      where: {
        accountId,
      },
      select: {
        email: true,
        createdAt: true,
        role: true,
        id: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  deleteTeamMember(memberId: string): Promise<any> {
    return this.prismaService.user.delete({
      where: {
        id: memberId,
      },
    });
  }

  deleteInvitation(invitationId: string): Promise<any> {
    return this.prismaService.invitation.delete({
      where: {
        id: invitationId,
      },
      select: {
        createdAt: true,
        id: true,
        email: true,
      },
    });
  }

  formatMembers(members: any, accountId: string): any[] {
    return members.map((member) => ({
      ...member,
      isAccountOwner: member.ownerOfId === accountId,
    }));
  }

  async getActiveSubscription(accountId: string): Promise<Subscription> {
    const subscription = await this.prismaService.subscription.findMany({
      where: {
        stripeCurrentPeriodEnd: {
          gte: new Date(),
        },
        accountId,
      },
      orderBy: {
        stripeCurrentPeriodEnd: 'desc',
      },
      take: 1,
    });
    return subscription[0];
  }

  createAccount(input: SignUpDto): Promise<any> {
    const organizationInput = input?.organization;
    const ownerInput = input?.owner;

    let stripeCustomer: any;

    return this.prismaService.$transaction(
      async (prisma) => {
        // Create account
        const newAccount = await prisma.account.create({
          data: {
            organization: {
              create: {
                ...organizationInput,
              },
            },
          },
        });

        // Create owner of account
        const userInput = { ...ownerInput, role: Role.Admin };
        const owner = await this.userService.createUser(
          userInput,
          newAccount.id,
          prisma,
        );

        // Update account with previously created owner
        const updatedAccount = await prisma.account.update({
          data: {
            owner: {
              connect: {
                id: owner.id,
              },
            },
          },
          where: {
            id: newAccount.id,
          },
          include: {
            owner: true,
            organization: true,
            member: true,
          },
        });

        // Create stripe customer
        try {
          stripeCustomer =
            await this.stripeService.createCustomer(updatedAccount);
        } catch (e) {
          throw Error(e);
        }

        try {
          const finishedAccount = await prisma.account.update({
            data: {
              stripeCustomerId: stripeCustomer.id,
            },
            where: {
              id: updatedAccount.id,
            },
            include: {
              owner: true,
              organization: true,
              member: true,
            },
          });
          return finishedAccount;
        } catch (e) {
          throw Error(e);
        }
      },
      {
        maxWait: 10000, // default: 2000
        timeout: 10000, // default: 5000
      },
    );
  }
}
