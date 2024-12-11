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

@Resolver(() => Auth)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly accountService: AccountService,
    private readonly userService: UserService,
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
