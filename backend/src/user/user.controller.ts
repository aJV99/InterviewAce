import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from './user.service';
import { RequestWithAuth } from 'src/dto/request.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { User } from '@prisma/client';
import { Password } from './dto/password.dto';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  async get(@Req() req: RequestWithAuth) {
    const user = await this.userService.get(req.user.id);
    if (!user) {
      throw new InternalServerErrorException('Retrieving the User Failed');
    }
    const { id, password, ...result } = user;
    return result;
  }

  @Put()
  async update(@Req() req: RequestWithAuth, @Body() updateUserDto: Partial<User>) {
    const user = await this.userService.update(req.user.id, updateUserDto);
    if (!user) {
      throw new InternalServerErrorException('Updating the User Failed');
    }
    const { id, password, ...result } = user;
    return result;
  }

  @Put('password')
  async updatePassword(@Req() req: RequestWithAuth, @Body() passwordDto: Password) {
    const validation = await this.authService.validateUserById({
      id: req.user.id,
      password: passwordDto.currentPassword,
    });
    if (!validation) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const user = await this.userService.update(req.user.id, { password: passwordDto.newPassword });
    if (!user) {
      throw new InternalServerErrorException('Updating the User Failed');
    }
    const { id, password, ...result } = user;
    return result;
  }

  @Delete('data')
  async deleteData(@Req() req: RequestWithAuth) {
    const user = await this.userService.deleteData(req.user.id);
    if (!user) {
      throw new InternalServerErrorException('Updating the User Failed');
    }
    const { id, password, ...result } = user;
    return result;
  }

  @Delete()
  async delete(@Req() req: RequestWithAuth) {
    await this.userService.delete(req.user.id);
    return { message: 'User deleted successfully.' };
  }
}
