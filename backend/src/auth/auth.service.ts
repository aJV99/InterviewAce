import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDtoEmail, LoginDtoId } from './dto/login.dto';
import { JwtPayload } from './dto/jwt-payload.interface';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUserByEmail(loginDto: LoginDtoEmail): Promise<any> {
    const user = await this.userService.findOneByEmail(loginDto.email);
    if (user && (await bcrypt.compare(loginDto.password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async validateUserById(loginDto: LoginDtoId): Promise<any> {
    const user = await this.userService.get(loginDto.id);
    if (user && (await bcrypt.compare(loginDto.password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload: JwtPayload = { id: user.id, email: user.email };
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      accessToken: this.jwtService.sign(payload),
    };
  }

  async getRefreshToken(user: any) {
    const payload: JwtPayload = { id: user.id, email: user.email };
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }

  async createAccessTokenFromRefreshToken(refreshToken: string): Promise<string> {
    try {
      // Verify the refresh token.
      // Note: Ideally you should have a different secret for refresh tokens for added security.
      const decoded: any = jwt.verify(refreshToken, process.env.JWT_SECRET);

      if (!decoded.email) {
        throw new UnauthorizedException('Invalid token.');
      }

      const user = await this.userService.findOneByEmail(decoded.email);

      if (!user) {
        throw new UnauthorizedException('User not found.');
      }

      const payload = { email: user.email, id: user.id };
      return this.jwtService.sign(payload);
    } catch (error) {
      console.error('Error creating access token from refresh token:', error);
      throw new UnauthorizedException('Could not create new access token.');
    }
  }
}
