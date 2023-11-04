import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createJobDto: CreateJobDto, userId: string) {
    return this.prisma.job.create({
      data: {
        ...createJobDto,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.job.findMany({
      where: {
        userId,
      },
    });
  }

  async findOne(id: string, userId: string) {
    return this.prisma.job.findFirst({
      where: {
        id: id.toString(),
        userId,
      },
    });
  }

  async update(id: string, updateJobDto: UpdateJobDto) {
    return this.prisma.job.update({
      where: {
        id: id.toString(),
      },
      data: {
        ...updateJobDto,
      },
    });
  }

  async remove(id: string, userId: string) {
    return this.prisma.job.delete({
      where: {
        id: id.toString(),
        userId,
      },
    });
  }
}
