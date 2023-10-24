import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { SignupDto } from '../dto/signup.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: SignupDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findFirstRefreshToken(refreshToken: string): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { refreshToken } });
  }

  async get(id: string): Promise<User> {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    return await this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
