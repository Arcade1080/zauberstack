import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class SupabaseJwtStrategy extends PassportStrategy(
  Strategy,
  'supabase-jwt',
) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: (request, rawJwtToken, done) => {
        // Get the JWT secret from your Supabase dashboard > Settings > API > JWT Settings > JWT Secret
        const secret = this.configService.get<string>('SUPABASE_JWT_SECRET');
        done(null, secret);
      },
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    // The payload contains the user's Supabase ID in payload.sub
    const user = await this.prisma.user.findFirst({
      where: { supabaseId: payload.sub },
      include: {
        role: { include: { permissions: true } },
        account: true,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  }
}
