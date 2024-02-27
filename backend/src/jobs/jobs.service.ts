import { Injectable } from '@nestjs/common';
import { JobDto, UpdateJobDto } from './dto/job.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createJobDto: JobDto, userId: string) {
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
      include: {
        interviews: {
          include: {
            questions: true,
          },
        },
      },
    });
  }

  async findOne(id: string, userId: string) {
    return this.prisma.job.findFirst({
      where: {
        id: id.toString(),
        userId,
      },
      include: {
        interviews: {
          include: {
            questions: true,
          },
        },
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
