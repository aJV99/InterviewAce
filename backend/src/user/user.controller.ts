import { Body, Controller, Delete, Get, InternalServerErrorException, Put, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './dto/user.entity';
import { RequestWithAuth } from 'src/dto/request.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async get(@Req() req: RequestWithAuth) {
    const user = await this.userService.get(req.user.id);
    if (!user) {
      throw new InternalServerErrorException('Retrieving the User Failed');
    }
    return user;
  }

  @Put()
  async update(@Req() req: RequestWithAuth, @Body() updateUserDto: Partial<User>) {
    const user = await this.userService.update(req.user.id, updateUserDto);
    if (!user) {
      throw new InternalServerErrorException('Updating the User Failed');
    }
    return user;
  }

  @Delete()
  async delete(@Req() req: RequestWithAuth) {
    await this.userService.delete(req.user.id);
    return { message: 'User deleted successfully.' };
  }
}
