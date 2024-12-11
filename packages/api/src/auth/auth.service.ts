import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { DateTime } from 'luxon';
import { PrismaService } from 'nestjs-prisma';
import { SecurityConfig } from '../config/config.interface';
import { InvalidCredentialsError } from '../errors/InvalidCredentialsError';
import { UserNotFoundError } from '../errors/UserNotFoundError';
import { PasswordService } from './password.service';
import { MailService } from '../mail/mail.service';
import { Role } from './enums/role';
import { AccountService } from '../account/account.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService,
    private readonly accountService: AccountService,
    private readonly mailService: MailService,
  ) {}

  validateUserByEmail(email: string): Promise<User> {
    return this.prismaService.user.findFirst({
      where: { email },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
        account: {
          include: {
            subscriptions: true,
          },
        },
      },
    });
  }

  async createUserFromGoogle(googleUser: any): Promise<User> {
    const { email, firstName, lastName, picture } = googleUser;

    const account = await this.accountService.createAccount({
      organization: {
        name: `${firstName} ${lastName}'s Account`,
      },
      owner: {
        email,
        password: '',
        role: Role.Admin,
      },
    });

    return account.owner;
  }

  async signInWithMagicLink(token: string) {
    // check if token is valid
    const verifyOptions = {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
    };

    const tokenData = await this.jwtService.verify(token, verifyOptions);

    const { email } = tokenData;

    // check if user exists
    const user = await this.validateUserByEmail(email);
    if (!user) {
      throw new UserNotFoundError();
    }

    return {
      tokens: this.generateTokens({
        userId: user.id,
      }),
      user,
    };
  }

  async generateMagicLinkToken(email: string) {
    return this.jwtService.sign(
      { email },
      {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn: '5m',
      },
    );
  }

  async sendMagicLink(email: string) {
    const magicLinkToken = await this.generateMagicLinkToken(email);

    const magicLink = `${this.configService.get(
      'MAGIC_LINK_CALLBACK_URL',
    )}?token=${magicLinkToken}`;

    await this.mailService.sendMagicLink(email, magicLink);
  }

  setRefreshTokenCookie(response, refreshToken: any): void {
    response.cookie('refresh_token', refreshToken.token, {
      path: '/graphql',
      httpOnly: true,
      secure: true,
      maxAge: DateTime.fromJSDate(refreshToken.expiresAt).diff(DateTime.now())
        .milliseconds,
      sameSite: 'None',
    });
  }

  async signIn(email: string, password: string): Promise<any> {
    const user = await this.prismaService.user.findFirst({ where: { email } });

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const passwordValid = await this.passwordService.validatePassword(
      password,
      user.password,
    );

    if (!passwordValid) {
      throw new InvalidCredentialsError();
    }

    return {
      tokens: this.generateTokens({
        userId: user.id,
      }),
      user,
    };
  }

  validateUser(userId: string): Promise<User> {
    return this.prismaService.user.findUnique({
      where: { id: userId },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
        account: {
          include: {
            subscriptions: true,
          },
        },
      },
    });
  }

  getUserFromToken(token: string): Promise<User> {
    const id = this.jwtService.decode(token)['userId'];
    return this.prismaService.user.findUnique({ where: { id } });
  }

  generateTokens(payload: { userId: string }): any {
    const token = {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };

    return token;
  }

  private generateAccessToken(payload: { userId: string }): string {
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(payload: { userId: string }): {
    token: string;
    expiresAt: DateTime;
  } {
    const securityConfig = this.configService.get<SecurityConfig>('security');
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: securityConfig.refreshIn,
    });

    const expiresAt = DateTime.now()
      .plus({ seconds: securityConfig.refreshIn })
      .toJSDate();

    return {
      token,
      // @ts-ignore
      expiresAt,
    };
  }

  async refreshToken(token: string) {
    try {
      const { userId } = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      return this.generateTokens({
        userId,
      });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
