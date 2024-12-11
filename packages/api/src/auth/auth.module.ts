import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AccountService } from '../account/account.service';
import { SecurityConfig } from '../config/config.interface';
import { MailService } from '../mail/mail.service';
import { MediaService } from '../media/media.service';
import { OrganizationService } from '../organization/organization.service';
import { UserService } from '../user/user.service';
import { GoogleAuthController } from './auth.controller';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './google.strategy';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { PermissionGuard } from './guards/permission.guard';
import { JwtStrategy } from './jwt.strategy';
import { PasswordService } from './password.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const securityConfig = configService.get<SecurityConfig>('security');
        return {
          secret: configService.get<string>('JWT_ACCESS_SECRET'),
          signOptions: {
            expiresIn: securityConfig.expiresIn,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    UserService,
    AuthResolver,
    JwtStrategy,
    GqlAuthGuard,
    MailService,
    AccountService,
    MediaService,
    OrganizationService,
    GoogleStrategy,
    PasswordService,
    {
      provide: APP_GUARD,
      useClass: GqlAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
  exports: [
    GqlAuthGuard,
    AuthService,
    JwtModule,
    PasswordService,
    // RestAuthGuard,
    // RestPermissionGuard,
  ],
  controllers: [GoogleAuthController],
})
export class AuthModule {}
