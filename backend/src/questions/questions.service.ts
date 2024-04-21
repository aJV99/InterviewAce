import { Inject, Injectable, NotFoundException, UnauthorizedException, forwardRef } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AceAIService } from 'src/aceAI/aceAI.service';
import { InterviewsService } from 'src/interviews/interviews.service';
import { JobsService } from 'src/jobs/jobs.service';

@Injectable()
export class QuestionsService {
  constructor(
    @Inject(forwardRef(() => InterviewsService))
    private readonly interviewsService: InterviewsService,
    private readonly prisma: PrismaService,
    private readonly jobsService: JobsService,
    private readonly aceAIService: AceAIService,
  ) {}

  async checkQuestionOwnership(questionId: string, userId: string): Promise<void> {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
      include: {
        interview: {
          include: {
            job: true, // Included the job through the interview to check the owner
          },
        },
      },
    });

    if (!question) {
      throw new NotFoundException(`Question not found with given ID`);
    }
    if (question.interview.job.userId !== userId) {
      throw new UnauthorizedException('You do not own this question');
    }
  }

  async createMany(interviewId: string, createQuestionDtos: string[]) {
    await this.prisma.question.createMany({
      data: createQuestionDtos.map((questionDto, index) => ({
        content: questionDto,
        interviewId,
        index,
      })),
    });
    return await this.findAll(interviewId);
  }

  async create(interviewId: string, content: string) {
    const lastQuestion = await this.prisma.question.findFirst({
      where: { interviewId },
      orderBy: { index: 'desc' },
    });

    const index = lastQuestion ? lastQuestion.index + 1 : 0;

    const createdQuestion = await this.prisma.question.create({
      data: {
        interviewId,
        content,
        index,
      },
      include: {
        interview: {
          select: {
            jobId: true,
          },
        },
      },
    });

    return {
      ...createdQuestion,
      jobId: createdQuestion.interview.jobId,
      interview: undefined, // Removed the interview object
    };
  }

  async findAll(interviewId: string) {
    const questions = await this.prisma.question.findMany({
      where: { interviewId },
      orderBy: {
        index: 'asc',
      },
      include: {
        interview: {
          select: {
            jobId: true,
          },
        },
      },
    });

    // Transform each question object to move jobId to the top level
    return questions.map((question) => ({
      ...question,
      jobId: question.interview.jobId,
      interview: undefined, // Removed the interview object
    }));
  }

  async findOne(id: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: {
        interview: {
          select: {
            jobId: true,
          },
        },
      },
    });

    return {
      ...question,
      jobId: question.interview.jobId,
      interview: undefined, // Removed the interview object
    };
  }

  async update(id: string, content: string) {
    const updatedQuestion = await this.prisma.question.update({
      where: { id },
      data: { content },
      include: {
        interview: {
          select: {
            jobId: true,
          },
        },
      },
    });

    return {
      ...updatedQuestion,
      jobId: updatedQuestion.interview.jobId,
      interview: undefined, // Removed the interview object
    };
  }

  async answer(id: string, userResponse: string) {
    // Initial update with user response
    const updatedQuestion = await this.prisma.question.update({
      where: { id },
      data: { userResponse },
      include: {
        interview: {
          select: {
            jobId: true,
          },
        },
      },
    });

    return {
      ...updatedQuestion,
      jobId: updatedQuestion.interview.jobId,
      interview: undefined, // Removed the interview object
    };
  }

  async remove(id: string) {
    const deletedQuestion = await this.prisma.question.delete({
      where: { id },
      include: {
        interview: {
          select: {
            jobId: true,
          },
        },
      },
    });

    return {
      ...deletedQuestion,
      jobId: deletedQuestion.interview.jobId,
      interview: undefined, // Removed the interview object
    };
  }
}
