import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { SignupDto } from '../dto/signup.dto';
import { User } from '@prisma/client';

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

  async get(id: string): Promise<User> {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    if (data.password) {
      const { password, ...rest } = data;
      const hashedPassword = await bcrypt.hash(password, 10);
      return await this.prisma.user.update({
        where: { id },
        data: {
          password: hashedPassword,
          ...rest,
        },
      });
    } else {
      return await this.prisma.user.update({
        where: { id },
        data,
      });
    }
  }

  async deleteData(id: string): Promise<User | null> {
    // First, delete all jobs associated with the user
    await this.prisma.job.deleteMany({
      where: { userId: id },
    });

    // Then, return the user after jobs deletion
    // Optionally update the user if needed
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
