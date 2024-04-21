import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JobDto, UpdateJobDto } from './dto/job.dto';
import { PrismaService } from 'src/prisma.service';
import { AceAIService } from 'src/aceAI/aceAI.service';

@Injectable()
export class JobsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aceAIService: AceAIService,
  ) {}

  async checkJobOwnership(jobId: string, userId: string): Promise<void> {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      throw new NotFoundException(`Job not found with given ID`);
    }
    if (job.userId !== userId) {
      throw new UnauthorizedException('You do not own this job');
    }
  }

  async create(createJobDto: JobDto, userId: string) {
    const validity = await this.aceAIService.checkJobValidity(createJobDto);
    if (validity.validity) {
      return await this.prisma.job.create({
        data: {
          ...createJobDto,
          userId,
        },
        include: {
          interviews: {
            orderBy: {
              createdAt: 'asc',
            },
            include: {
              questions: {
                orderBy: {
                  index: 'asc',
                },
              },
            },
          },
        },
      });
    } else {
      throw new UnprocessableEntityException(validity.error);
    }
  }

  async findAll(userId: string) {
    return await this.prisma.job.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        interviews: {
          orderBy: {
            createdAt: 'asc',
          },
          include: {
            questions: {
              orderBy: {
                index: 'asc',
              },
            },
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.job.findFirst({
      where: {
        id: id,
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        interviews: {
          orderBy: {
            createdAt: 'asc',
          },
          include: {
            questions: {
              orderBy: {
                index: 'asc',
              },
            },
          },
        },
      },
    });
  }

  async update(id: string, updateJobDto: UpdateJobDto) {
    return await this.prisma.job.update({
      where: {
        id: id,
      },
      data: {
        ...updateJobDto,
      },
      include: {
        interviews: {
          orderBy: {
            createdAt: 'asc',
          },
          include: {
            questions: {
              orderBy: {
                index: 'asc',
              },
            },
          },
        },
      },
    });
  }

  async remove(id: string) {
    return this.prisma.job.delete({
      where: {
        id: id,
      },
    });
  }
}
