import { Controller, Post, Body, BadRequestException, Res, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { SignupDto } from 'src/dto/signup.dto';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: { email: string; password: string }, @Res() res: Response) {
    const user = await this.authService.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );
    if (!user) {
      throw new BadRequestException('Invalid credentials.');
    }
    const result = await this.authService.login(user, res);
    res.send(result);
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies.RefreshToken; // Assuming you named your cookie 'RefreshToken' in the AuthService
    if (!refreshToken) {
      throw new BadRequestException('Refresh token not provided.');
    }
    return this.authService.refreshToken(refreshToken, res);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request) {
    const refreshToken = req.cookies.RefreshToken;
    if (!refreshToken) {
      throw new BadRequestException('Refresh token not provided.');
    }
    await this.authService.logout(refreshToken);
    return { message: 'Logged out successfully' };
  }
}
