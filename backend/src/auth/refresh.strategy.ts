// auth/refresh.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request.cookies?.Refresh;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(request: any, payload: JwtPayload) {
    const refreshToken = request.cookies?.Refresh;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    // Optional: You can add more logic here to check if the refreshToken is still valid
    // For instance, you could check if the user is still active, if the refreshToken was revoked, etc.

    const user = await this.userService.findOneByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return { id: user.id, email: user.email };
  }
}
