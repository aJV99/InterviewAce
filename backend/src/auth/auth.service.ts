import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { SignupDto } from 'src/dto/signup.dto';
import { User } from 'src/user/user.entity';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private blacklistedTokens: { token: string; expireAt: Date }[] = [];

  async signup(data: SignupDto): Promise<User> {
    const userExists = await this.usersService.findOneByEmail(data.email);
    if (userExists) {
      throw new BadRequestException('Email already registered.');
    }

    return this.usersService.create(data);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    if (!email) {
      throw new UnauthorizedException('Email is required');
    }
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: User, res: Response) {
    const accessPayload = { email: user.email, sub: user.id, type: 'access' };
    const refreshPayload = { email: user.email, sub: user.id, type: 'refresh' };
    
    const refreshToken = this.jwtService.sign(refreshPayload, { expiresIn: '7d' });

    // Set the refresh token as an HTTP-only cookie
    this.setRefreshTokenAsCookie(res, refreshToken);

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      access_token: this.jwtService.sign(accessPayload),
    };
  }

  setRefreshTokenAsCookie(res: Response, token: string) {
    const oneWeek = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    res.cookie('RefreshToken', token, {
      httpOnly: true,
      expires: new Date(Date.now() + oneWeek),
      secure: process.env.NODE_ENV === 'production', // set to true in production
      sameSite: 'strict',
    });
  }  

  async refreshToken(token: string, res: Response) {
    try {
      const payload = this.jwtService.verify(token);
  
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }
  
      const user = await this.usersService.findOneByEmail(payload.email);
      return this.login(user, res);  // Added the `res` parameter here.
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
  

  async logout(refreshToken: string): Promise<void> {
    const payload = this.jwtService.verify(refreshToken); // extract payload from token
    const expireAt = new Date(payload.exp * 1000); // Convert the JWT's UNIX timestamp to a Date object

    this.blacklistedTokens.push({ token: refreshToken, expireAt });
  }

  isTokenBlacklisted(token: string): boolean {
    const currentTime = new Date();
    // Clean up expired tokens
    this.blacklistedTokens = this.blacklistedTokens.filter(
      (blacklisted) => blacklisted.expireAt > currentTime,
    );

    return !!this.blacklistedTokens.find(
      (blacklisted) => blacklisted.token === token,
    );
  }
}
