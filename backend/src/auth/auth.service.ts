import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDtoEmail, LoginDtoId } from './dto/login.dto';
import { JwtPayload } from './dto/jwt-payload.interface';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private generateToken() {
    const digits = '0123456789abcdefghijklmnopqrstuvwxyz';
    let token = '';
    const len = digits.length;
    for (let i = 0; i < 8; i++) {
      token += digits[Math.floor(Math.random() * len)];
    }
    return token;
  }

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

  async createPasswordResetToken(email: string): Promise<void> {
    const user = await this.userService.findOneByEmail(email);

    const resetToken = this.generateToken();
    const resetExpires = new Date(Date.now() + 15 * 60 * 1000); // 1 hour from now

    await this.userService.update(user.id, {
      resetToken,
      resetExpires,
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    transporter.sendMail(
      {
        from: process.env.MAIL_USER,
        to: email,
        subject: 'Password Reset Request - InterviewAce',
        text: `Hi ${user.firstName}\n
        You are receiving this because you (or someone else) have requested the reset of the password for your account.\n
        If this was you, please copy the below token and paste the code into the portal to complete the process within one hour of receiving it:\n
        ${resetToken}\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n
        Enjoy your interview prep,
        Ace\n
        InterviewAce`,
        html: `<p>Hi ${user.firstName},</p>
      <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
      <p>If this was you, please copy the below token and paste the code into the portal to complete the process within one hour of receiving it:</p>
      <p><strong>${resetToken}</strong></p>
      <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      <p>Enjoy your interview prep,</p>
      <p>Ace</p>
      <p><img style="height: 80px;" src="https://www.interviewace.co.uk/Logo.png" alt="InterviewAce Logo" /></p>`,
      },
      (err) => {
        if (err) {
          throw new InternalServerErrorException('Code was unable to send');
        }
      },
    );
  }

  async resetPassword(email: string, token: string, newPassword: string): Promise<void> {
    const user = await this.userService.findOneByResetToken(email, token);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    if (new Date() > user.resetExpires) {
      throw new UnauthorizedException('Token has expired');
    }

    await this.userService.update(user.id, {
      password: newPassword,
      resetToken: null, // Clear the reset token
      resetExpires: null, // Clear the expiry
    });
  }

  async createAccessTokenFromRefreshToken(refreshToken: string): Promise<string> {
    try {
      // Verify the refresh token.
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
      throw new UnauthorizedException('Could not create new access token.');
    }
  }
}
