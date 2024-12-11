import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { ConfigService } from '@nestjs/config';

@Controller('auth/google')
export class GoogleAuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Public()
  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Public()
  @Get('callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req, @Res() res) {
    const { accessToken, refreshToken } = this.authService.generateTokens({
      userId: req.user.id,
    });

    // Set cookies or send tokens in response
    this.authService.setRefreshTokenCookie(req.res, refreshToken);

    // Get the WEB_CLIENT_URL from environment variables
    const webClientUrl = this.configService.get<string>('WEB_CLIENT_URL');

    // Redirect to frontend with tokens as query parameters
    res.redirect(`${webClientUrl}/auth-callback?accessToken=${accessToken}`);
  }
}
