import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { UnauthorizedException, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { AuthService } from './auth/auth.service';
import * as jwt from 'jsonwebtoken';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enhanced CORS configuration to ensure cookies can be received from a different origin (frontend).
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, User-Agent, Referrer, Origin, Authorization',
    exposedHeaders: 'Authorization',
  });

  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());
  app.use(cookieParser());

  app.use(async (req, res, next) => {
    const authService = app.get(AuthService); // Retrieve the AuthService instance from NestJS.

    if (req.headers.authorization && req.headers.authorization.split(' ')[1]) {
      try {
        // Verify access token
        jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET);
        console.log('JWT Verified');
        next();
      } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
          // If the JWT is expired, check the refresh token
          console.log('JWT Expired, Checking Refresh');
          const refreshToken = req.cookies && req.cookies.Refresh;
          if (!refreshToken) {
            return next(new UnauthorizedException('Token expired.'));
          }
          console.log('JWT Expired, Refresh Verified');
          try {
            const newAccessToken = await authService.createAccessTokenFromRefreshToken(refreshToken);
            if (newAccessToken) {
              // Here you set the Authorization header only if a new token was actually generated.
              res.setHeader('Authorization', `New Bearer ${newAccessToken}`);
              req.headers.authorization = `Bearer ${newAccessToken}`;
            }
            next();
          } catch (err) {
            return next(new UnauthorizedException('Token expired and refresh token is invalid.'));
          }
        } else {
          next(new UnauthorizedException('Invalid token.'));
        }
      }
    } else {
      next();
    }
  });

  await app.listen(8000);
}
bootstrap();
