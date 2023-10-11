import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { SignupDto } from 'src/dto/signup.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  private blacklistedTokens: { token: string; expireAt: Date }[] = [];

  async signup(data: SignupDto): Promise<User> {
    const userExists = await this.usersService.findOneByEmail(data.email);
    if (userExists) {
      throw new BadRequestException('Email already registered.');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  async validateUser(email: string, password: string): Promise<any> {
    if (!email) {
      throw new UnauthorizedException('Email is required');
    }
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const accessPayload = { email: user.email, sub: user.id, type: 'access' };
    const refreshPayload = { email: user.email, sub: user.id, type: 'refresh' };

    return {
      firstName: user.firstName,
      lastName: user.lastName,
      access_token: this.jwtService.sign(accessPayload),
      refresh_token: this.jwtService.sign(refreshPayload, { expiresIn: '7d' }), // typically longer than access token
    };
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      const user = await this.usersService.findOneByEmail(payload.email);
      return this.login(user);
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
