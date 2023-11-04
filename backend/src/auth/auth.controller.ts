import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from './jwt.guard';
// import { RefreshGuard } from './refresh.guard';

interface CookieOptions {
  httpOnly: boolean;
  path: string;
  secure?: boolean;
  sameSite?: 'Lax' | 'Strict' | 'None';
}

let cookieOptions: CookieOptions = {
  httpOnly: true,
  path: '/',
  secure: true,
};

if (process.env.NODE_ENV === 'development') {
  cookieOptions = {
    ...cookieOptions,
    sameSite: 'None',
  };
} else {
  cookieOptions = {
    ...cookieOptions,
    sameSite: 'Strict',
  };
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('signup')
  async signUp(@Req() req: any, @Res() res: any) {
    const user = await this.userService.create(req.body);
    res.status(201).send(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: any, @Res() res: any) {
    res.cookie('Refresh', '', { ...cookieOptions, expires: new Date(0) });
    res.status(200).send({ message: 'Logged out successfully' });
  }

  @Post('login')
  async login(@Req() req: any, @Res() res: any) {
    const user = await this.authService.validateUser(req.body);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = await this.authService.login(user);
    const refreshToken = await this.authService.getRefreshToken(user);
    res.cookie('Refresh', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.send(token);
  }

  @Get('test')
  async test(@Req() req: any, @Res() res: any) {
    res.send('Test');
  }

  // @UseGuards(RefreshGuard)
  // @Post('refresh')
  // async refreshToken(@Req() req: any, @Res() res: any) {
  //   const oldRefreshToken = req.cookies.Refresh;
  //   // Extract user from oldRefreshToken and generate new tokens.
  // }
}
