import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import { SignOptions } from 'jsonwebtoken';
import { DateTime } from 'luxon';
import { PrismaService } from 'nestjs-prisma';
import { UserEmailAlreadyUsedError } from '../errors/UserEmailAlreadyUsedError';
import { TokenNotFoundError } from './../errors/TokenNotFoundError';
import { MailService } from './../mail/mail.service';
import { AcceptInvitationInput } from './graphql/inputs/acceptInvitation.input';
import { StatusEnum } from './enums/status.enum';
import { UserNotFoundError } from '../errors/UserNotFoundError';
import { IInvitationTokenPayload } from './interfaces/invitation-token-payload.interface';
import { ITokenPayload } from './interfaces/token-payload.interface';
import { CreateUserInput } from '../auth/graphql/inputs/createUser.input';
import { PasswordService } from '../auth/password.service';
import { SecurityConfig } from '../config/config.interface';
import { MethodNotAllowedError } from '../errors/MethodNotAllowedError';
import { RoleNotFoundError } from '../errors/RoleNotFoundError';
import { ChangePasswordInput } from './graphql/inputs/change-password.input';
import { ForgotPasswordInput } from './graphql/inputs/forgot-password-request.input';
import { ResetPasswordInput } from './graphql/inputs/reset-password.input';
import { UpdateUserInput } from './graphql/inputs/update-user.input';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
    private configService: ConfigService,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  }

  async updateUser(
    userId: string,
    newUserData: UpdateUserInput,
  ): Promise<User> {
    let avatar: any;

    if (
      newUserData.avatarId === null ||
      typeof newUserData.avatarId === 'undefined'
    ) {
      avatar = {
        disconnect: true,
      };
    } else if (typeof newUserData.avatarId === 'string') {
      avatar = {
        connect: {
          id: newUserData.avatarId,
        },
      };
    }

    if (newUserData.avatarId === null) {
      // get avatar id from user
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          avatar: true,
        },
      });
      if (user.avatar) {
        await this.prisma.media.delete({
          where: {
            id: user.avatar.id,
          },
        });
      }
    }

    return this.prisma.user.update({
      data: {
        firstname: newUserData.firstname,
        lastname: newUserData.lastname,
        avatar,
      },
      where: {
        id: userId,
      },
    });
  }

  async createUser(
    payload: CreateUserInput,
    accountId: string,
    prisma = null,
  ): Promise<User> {
    const prismaClient = prisma || this.prisma;
    const hashedPassword = await this.passwordService.hashPassword(
      payload.password,
    );

    const role = await prismaClient.role.findFirst({
      where: {
        name: payload.role,
      },
    });

    if (!role) {
      throw new RoleNotFoundError();
    }

    try {
      const user = await prismaClient.user.create({
        data: {
          ...payload,
          password: hashedPassword,
          role: {
            connect: {
              id: role.id,
            },
          },
          account: {
            connect: {
              id: accountId,
            },
          },
        },
      });

      return user;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new UserEmailAlreadyUsedError();
      } else {
        throw new Error(e);
      }
    }
  }

  async acceptInvitation(inviteUserInput: AcceptInvitationInput) {
    // check if token is valid
    const verifyOptions = {
      secret: this.configService.get('JWT_INVITE_USER_SECRET'),
    };
    const tokenData = await this.jwtService.verify(
      inviteUserInput.token,
      verifyOptions,
    );

    const { invitationId, inviteeRole: role, inviteeEmail: email } = tokenData;

    // check if invitation exists in db
    const existingInvitation = await this.prisma.invitation.findFirst({
      where: {
        id: invitationId,
      },
    });

    if (!existingInvitation) {
      // TODO: inviation not found
      throw new TokenNotFoundError();
    }

    const {
      user: { password },
    } = inviteUserInput;

    const createUserInput = {
      email,
      password,
      role: role.toLowerCase(),
      status: StatusEnum.active,
    };
    const newUser = await this.createUser(
      createUserInput,
      existingInvitation.accountId,
    );

    // delete invitation (deletes invitation token)
    await this.prisma.invitation.delete({
      where: {
        id: invitationId,
      },
    });

    return newUser;
  }

  async resetPassword(resetPasswordDto: ResetPasswordInput) {
    // check if token is valid
    const verifyOptions = {
      secret: this.configService.get('JWT_RESET_PASSWORD_SECRET'),
    };

    await this.jwtService.verify(resetPasswordDto.token, verifyOptions);

    // check if token exists in db
    const existingToken = await this.prisma.token.findFirst({
      where: {
        token: resetPasswordDto.token,
      },
    });

    if (!existingToken) {
      throw new TokenNotFoundError();
    }

    // check if user exists
    const user = await this.prisma.user.findFirst({
      where: {
        id: existingToken.userId,
      },
    });

    if (!user) {
      throw new UserNotFoundError();
    }

    // delete token
    await this.prisma.token.deleteMany({
      where: {
        token: resetPasswordDto.token,
      },
    });

    const hashedPassword = await this.passwordService.hashPassword(
      resetPasswordDto.password,
    );

    const updatedUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    return updatedUser;
  }

  async changePassword(
    userId: string,
    userPassword: string,
    changePassword: ChangePasswordInput,
  ) {
    const passwordValid = await this.passwordService.validatePassword(
      changePassword.oldPassword,
      userPassword,
    );

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    const hashedPassword = await this.passwordService.hashPassword(
      changePassword.newPassword,
    );

    return this.prisma.user.update({
      data: {
        password: hashedPassword,
      },
      where: { id: userId },
    });
  }

  async sendInvitationEmail(user, invitees: any) {
    const accountOwner = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        ownerOfId: true,
      },
    });

    if (!accountOwner.ownerOfId) {
      throw new Error('User is not an account owner');
    }

    const invitations = [];

    for (const invitee of invitees) {
      const userExists = await this.prisma.user.findFirst({
        where: {
          email: invitee.email,
        },
      });

      if (userExists) {
        throw new UserEmailAlreadyUsedError();
      }

      // check if invitation already exists
      const invitationExists = await this.prisma.invitation.findFirst({
        where: {
          email: invitee.email,
          accountId: accountOwner.ownerOfId,
        },
      });

      if (invitationExists) {
        // TODO throw new InvitationAlreadyExistsError();
        throw new UserEmailAlreadyUsedError();
      }

      // Create invitation
      const invitation = await this.createInvitation(
        accountOwner.ownerOfId,
        invitee.email,
        invitee.role,
      );

      const tokenPayload = {
        invitationId: invitation.id,
        inviteeEmail: invitee.email,
        inviteeRole: invitee.role,
      };

      const inviteToken = await this.generateInvitationToken(tokenPayload);

      const expiresAt = DateTime.now()
        .plus({ day: 1 })
        .toJSDate()
        .toISOString();

      await this.saveInvitationToken({
        token: inviteToken,
        expiresAt,
        invitationId: invitation.id,
      });

      const inviteLink = `${this.configService.get<string>(
        'WEB_CLIENT_URL',
      )}/sign-up?token=${inviteToken}&email=${invitee.email}`;

      invitations.push({ email: invitee.email, link: inviteLink });
    }

    for (const invitation of invitations) {
      await this.mailService.sendInvitationMail(
        invitation.email,
        invitation.link,
      );
    }

    return invitations.map((invitation) => invitation.email);
  }

  async generateInvitationToken(
    invitationTokenPayload: IInvitationTokenPayload,
  ) {
    const tokenSignOptions = {
      secret: this.configService.get('JWT_INVITE_USER_SECRET'),
      expiresIn:
        this.configService.get<SecurityConfig>('security').inviteTokenExpiresIn,
    };

    return this.jwtService.sign(invitationTokenPayload, tokenSignOptions);
  }

  async createInvitation(accountId, email, role) {
    const formatedRole = role.toLowerCase();

    const invitation = await this.prisma.invitation.create({
      data: {
        accountId,
        email,
        role: formatedRole,
      },
      select: {
        id: true,
      },
    });

    return invitation;
  }

  async sendPasswordResetLink(forgotPassword: ForgotPasswordInput) {
    // check if user w/ email exists, if not throw error
    const user = await this.prisma.user.findFirst({
      where: {
        email: forgotPassword.email,
      },
    });
    if (!user) {
      throw new UserNotFoundError();
    }
    const token = await this.signUser(user, false);
    const resetLink = `${this.configService.get<string>(
      'WEB_CLIENT_URL',
    )}/reset-password?token=${token}`;

    await this.mailService.sendPasswordResetMail(user.email, resetLink);

    return 'OK!';
  }

  private async saveInvitationToken(tokenDto) {
    const existingToken = await this.prisma.invitationToken.findFirst({
      where: {
        invitationId: tokenDto.invitationId,
      },
    });

    if (existingToken) {
      await this.prisma.invitationToken.delete({
        where: {
          invitationId: tokenDto.invitationId,
        },
      });
    }

    return await this.prisma.invitationToken.create({
      data: {
        invitation: {
          connect: { id: tokenDto.invitationId },
        },
        token: tokenDto.token,
        expiresAt: tokenDto.expiresAt,
      },
    });
  }

  // TODO add interface
  private async saveToken(tokenDto) {
    // TODO Remove existing token
    const existingToken = await this.prisma.token.findFirst({
      where: {
        userId: tokenDto.userId,
      },
    });

    if (existingToken) {
      await this.prisma.token.delete({
        where: {
          userId: tokenDto.userId,
        },
      });
    }

    return await this.prisma.token.create({
      data: {
        user: {
          connect: { id: tokenDto.userId },
        },
        token: tokenDto.token,
        expiresAt: tokenDto.expiresAt,
      },
    });
  }

  private async generateForgotPasswordToken(
    data: ITokenPayload,
    options?: SignOptions,
  ): Promise<string> {
    return this.jwtService.sign(data, options);
  }

  async signUser(user: User, withStatusCheck: boolean = true): Promise<string> {
    if (withStatusCheck && user.status !== StatusEnum.active) {
      throw new MethodNotAllowedError();
    }
    const tokenPayload: ITokenPayload = {
      id: user.id,
      status: user.status,
      // roles: user.roles,
    };

    const tokenSignOptions = {
      secret: this.configService.get('JWT_RESET_PASSWORD_SECRET'),
      expiresIn:
        this.configService.get<SecurityConfig>('security').resetTokenExpiresIn,
    };
    const token = await this.generateForgotPasswordToken(
      tokenPayload,
      tokenSignOptions,
    );

    // TODO decide whether this is really needed since token already contains expiration date
    const expiresAt = DateTime.now().plus({ day: 1 }).toJSDate().toISOString();

    await this.saveToken({
      token,
      expiresAt,
      userId: user.id,
    });

    return token;
  }
}
