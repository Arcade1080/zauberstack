import { UnauthorizedException } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { ExtractJwt } from 'passport-jwt';
import { AccountService } from '../account/account.service';
import { SignUpDto } from '../account/graphql/inputs/create-account.input';
import { InvalidCredentialsError } from '../errors/InvalidCredentialsError';
import { UserNotFoundError } from '../errors/UserNotFoundError';
import { InvalidCredentialsGraphQLApiError } from '../errors/graphql/InvalidCredentialsGraphQLApiError';
import { RefreshTokenExpiredGraphQLApiError } from '../errors/graphql/RefreshTokenExpiredGraphQLApiError';
import { RefreshTokenInvalidGraphQLApiError } from '../errors/graphql/RefreshTokenInvalidGraphQLApiError';
import { UnauthorizedGraphQLApiError } from '../errors/graphql/UnauthorizedGraphQLApiError';
import { GraphQLApiErrorUserNotFound } from '../errors/graphql/UserNotFoundGraphQLApiError';
import { UserEmailAlreadyUsedError } from './../errors/UserEmailAlreadyUsedError';
import { TokenExpiredGraphQLApiError } from './../errors/graphql/TokenExpiredGraphQLApiError';
import { TokenNotValidGraphQLApiError } from './../errors/graphql/TokenNotValidGraphQLApiError';
import { UserEmailAlreadyUsedGraphQLApiError } from './../errors/graphql/UserEmailAlreadyUsedGraphQLApiError';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { SignInInput } from './graphql/inputs/login.input';
import { SignInWithMagicLinkInput } from './graphql/inputs/signin-with-magic-link.input';
import { Auth } from './graphql/models/auth.model';
import { Token } from './graphql/models/token.model';
import { RequestMagicLinkInput } from './graphql/inputs/request-magic-link.input';
import { UserService } from '../user/user.service';
import { OAuthUserInput } from './dto/auth.input';
import { User } from '../user/graphql/models/user.model';
import { OrganizationService } from '../organization/organization.service';
import { PrismaService } from 'nestjs-prisma';
import { Role } from './enums/role';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly accountService: AccountService,
    private readonly userService: UserService,
    private readonly organizationService: OrganizationService,
    private readonly prisma: PrismaService,
  ) {}

  @Public()
  @Mutation(() => Auth)
  async signUp(@Args('data') data: SignUpDto, @Context() context: any) {
    data.owner.email = data.owner.email.toLowerCase();

    try {
      const newAccount = await this.accountService.createAccount(data);
      const { accessToken, refreshToken } =
        await this.authService.generateTokens({
          userId: newAccount.owner.id,
        });
      this.authService.setRefreshTokenCookie(context.req.res, refreshToken);
      return { accessToken };
    } catch (e) {
      if (e instanceof UserEmailAlreadyUsedError) {
        throw new UserEmailAlreadyUsedGraphQLApiError();
      }
      throw e;
    }
  }

  @Public()
  @Mutation(() => String)
  async requestMagicLink(@Args('data') { email }: RequestMagicLinkInput) {
    try {
      await this.userService.getUserByEmail(email);
      await this.authService.sendMagicLink(email);

      return 'Magic link sent! Check your email.';
    } catch (e) {
      if (e instanceof UserNotFoundError) {
        throw new GraphQLApiErrorUserNotFound();
      }

      throw e;
    }
  }

  @Public()
  @Mutation(() => Auth)
  async signInWithMagicLink(
    @Args('data') { token }: SignInWithMagicLinkInput,
    @Context() context: any,
  ) {
    try {
      const { tokens, user } =
        await this.authService.signInWithMagicLink(token);
      const { accessToken, refreshToken } = tokens;

      this.authService.setRefreshTokenCookie(context.req.res, refreshToken);
      return {
        accessToken,
        user,
      };
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new TokenExpiredGraphQLApiError();
      }

      if (e instanceof JsonWebTokenError) {
        throw new TokenNotValidGraphQLApiError();
      }

      if (e instanceof InvalidCredentialsError) {
        throw new InvalidCredentialsGraphQLApiError();
      }

      throw e;
    }
  }

  @Public()
  @Mutation(() => Auth)
  async signIn(
    @Args('data') { email, password }: SignInInput,
    @Context() context: any,
  ) {
    try {
      const { tokens, user } = await this.authService.signIn(
        email.toLowerCase(),
        password,
      );
      const { accessToken, refreshToken } = tokens;
      this.authService.setRefreshTokenCookie(context.req.res, refreshToken);
      return {
        accessToken,
        user,
      };
    } catch (e) {
      if (e instanceof InvalidCredentialsError) {
        throw new InvalidCredentialsGraphQLApiError();
      }

      throw e;
    }
  }

  @Public()
  @Mutation(() => Token)
  async refreshToken(@Context() context: any) {
    const refreshToken = ExtractJwt.fromExtractors([refreshTokenExtractor])(
      context.req,
    );

    try {
      const tokens = await this.authService.refreshToken(refreshToken);
      this.authService.setRefreshTokenCookie(
        context.req.res,
        tokens.refreshToken,
      );
      return { accessToken: tokens.accessToken };
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        context.res.clearCookie('refresh_token');
        throw new RefreshTokenExpiredGraphQLApiError(e.expiredAt);
      } else if (e instanceof JsonWebTokenError) {
        context.res.clearCookie('refresh_token');
        throw new RefreshTokenInvalidGraphQLApiError();
      } else if (e instanceof UserNotFoundError) {
        throw new GraphQLApiErrorUserNotFound();
      } else if (e instanceof UnauthorizedException) {
        throw new UnauthorizedGraphQLApiError();
      }

      // Internal server error
      throw e;
    }
  }

  @Public()
  @Mutation(() => User)
  async createUserFromOAuth(@Args('data') data: OAuthUserInput) {
    try {
      // First check if user with this email already exists
      let existingUser;
      try {
        existingUser = await this.userService.getUserByEmail(data.email);
        if (existingUser) {
          // If user exists but doesn't have supabaseId, update it
          if (!existingUser.supabaseId) {
            await this.prisma.user.update({
              where: { id: existingUser.id },
              data: { supabaseId: data.supabaseId },
            });
          }
          return existingUser;
        }
      } catch (e) {
        // User doesn't exist, continue with creation
      }

      // Create new account with organization for this user
      const organizationName = data.firstname
        ? `${data.firstname}'s Organization`
        : 'New Organization';

      // Create account without owner (we'll add the user as owner later)
      const account = await this.prisma.account.create({
        data: {
          organization: {
            create: {
              name: organizationName,
            },
          },
        },
      });

      // Create the user with OAuth info - provide required fields based on CreateUserInput
      const user = await this.userService.createUser(
        {
          email: data.email,
          password: Math.random().toString(36).slice(-8), // Generate random password for OAuth users
          role: Role.Admin,
        },
        account.id,
      );

      // Update user with additional OAuth data
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          firstname: data.firstname || '',
          lastname: data.lastname || '',
          supabaseId: data.supabaseId,
          avatar: {
            create: {
              url: data.avatar,
            },
          },
        },
      });

      // Update account with owner
      await this.prisma.account.update({
        where: { id: account.id },
        data: {
          owner: {
            connect: { id: user.id },
          },
        },
      });

      return user;
    } catch (e) {
      if (e instanceof UserEmailAlreadyUsedError) {
        throw new UserEmailAlreadyUsedGraphQLApiError();
      }
      throw e;
    }
  }

  @ResolveField('user')
  async user(@Parent() auth: Auth) {
    return await this.authService.getUserFromToken(auth.accessToken);
  }
}

function refreshTokenExtractor(req: any) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['refresh_token'];
  }
  return token;
}
