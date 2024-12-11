import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { IJwt } from './interfaces/jwt.interface';
import { UnauthorizedGraphQLApiError } from '../errors/graphql/UnauthorizedGraphQLApiError';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // jwtFromRequest: ExtractJwt.fromExtractors([accessTokenExtractor]),
      secretOrKey: configService.get('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: IJwt): Promise<User> {
    const user = await this.authService.validateUser(payload.userId);
    if (!user) {
      throw new UnauthorizedGraphQLApiError();
    }
    return user;
  }
}

// function accessTokenExtractor(req) {
//   let token = null;
//   if (req && req.cookies) {
//     token = req.cookies['access_token'];
//   }
//   return token;
// }
