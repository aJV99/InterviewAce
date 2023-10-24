// auth/auth.module.ts

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { RefreshStrategy } from './refresh.strategy';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma.service';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '1m',
      },
    }),
  ],
  providers: [AuthService, JwtStrategy, RefreshStrategy, PrismaService, UserService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
