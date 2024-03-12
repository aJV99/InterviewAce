import { Inject, Injectable, NotFoundException, UnauthorizedException, forwardRef } from '@nestjs/common';
import { InterviewDto, UpdateInterviewDto } from './dto/interview.dto';
import { PrismaService } from 'src/prisma.service';
import { QuestionsService } from 'src/questions/questions.service';
import { AceAIService } from 'src/aceAI/aceAI.service';
import { JobsService } from 'src/jobs/jobs.service';
import { Interview } from '@prisma/client';

@Injectable()
export class InterviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aceAIService: AceAIService,
    @Inject(forwardRef(() => QuestionsService))
    private readonly questionsService: QuestionsService,
    private readonly jobsService: JobsService,
  ) {}

  async checkInterviewOwnership(interviewId: string, userId: string): Promise<void> {
    const interview = await this.prisma.interview.findUnique({
      where: { id: interviewId },
      include: { job: true }, // Include the job to check the owner
    });

    if (!interview) {
      throw new NotFoundException(`Interview not found with given ID`);
    }
    if (interview.job.userId !== userId) {
      throw new UnauthorizedException('You do not own this interview');
    }
  }

  async create(jobId: string, createInterviewDto: InterviewDto) {
    const interview = await this.prisma.interview.create({
      data: {
        jobId,
        ...createInterviewDto,
      },
    });

    const { title, company, description, location } = await this.jobsService.findOne(jobId);

    let interviewType;
    if (interview.customType) {
      interviewType = interview.customType;
    }
    else {
      interviewType = interview.type
    }

    // Generate questions using AI service
    const generatedContent = await this.aceAIService.generateQuestions(title, company, description, location, interview.title, interviewType, interview.context);
    // const generatedContent = `[
    //   "How you doin",
    //   "Haaaave you met Ted?"
    // ]`;

    // const formattedContent = generatedContent.map(content => ({ content }));
    const formattedContent = JSON.parse(generatedContent);


    // Use QuestionService to create questions for this interview
    const questions = await this.questionsService.createMany(interview.id, formattedContent);

    return {
      ...interview,
      questions: questions,
    };
  }

  async findAll(jobId: string) {
    return await this.prisma.interview.findMany({
      where: {
        jobId,
      },
      include: {
        questions: true
      }
    });
  }

  async findOne(id: string) {
    return await this.prisma.interview.findUnique({
      where: {
        id,
      },
      include: {
        questions: true
      }
    });
  }

  async update(id: string, updateInterviewDto: UpdateInterviewDto) {
    return await this.prisma.interview.update({
      where: {
        id,
      },
      data: {
        ...updateInterviewDto,
      },
      include: {
        questions: true
      }
    });
  }

  async remove(id: string) {
    return await this.prisma.interview.delete({
      where: {
        id,
      },
    });
  }

  async updateScore(score: number, interviewId: string) {
    const interview = await this.findOne(interviewId);
    const currentQuestion = interview.currentQuestion + 1;
    let newScore = interview.overallScore + score;
    if (currentQuestion === interview.questions.length) {
      newScore = newScore / interview.questions.length
    }
    return await this.prisma.interview.update({
      where: {
        id: interviewId,
      },
      data: {
        overallScore: newScore,
        currentQuestion: currentQuestion,
      },
    });
  }
}
