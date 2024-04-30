import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
  forwardRef,
} from '@nestjs/common';
import { InterviewDto, UpdateInterviewDto } from './dto/interview.dto';
import { PrismaService } from 'src/prisma.service';
import { QuestionsService } from 'src/questions/questions.service';
import { AceAIService } from 'src/aceAI/aceAI.service';
import { JobsService } from 'src/jobs/jobs.service';
import { InterviewType } from '@prisma/client';

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
      include: { job: true }, // Included the job to check the owner
    });

    if (!interview) {
      throw new NotFoundException(`Interview not found with given ID`);
    }
    if (interview.job.userId !== userId) {
      throw new UnauthorizedException('You do not own this interview');
    }
  }

  async create(jobId: string, createInterviewDto: InterviewDto) {
    return await this.prisma.interview.create({
      data: {
        jobId,
        ...createInterviewDto,
      },
    });
  }

  async createNew(jobId: string, createInterviewDto: InterviewDto) {
    const { title, company, description, location } = await this.jobsService.findOne(jobId);

    const generatedContent = await this.aceAIService.generateQuestions(
      title,
      company,
      description,
      location,
      createInterviewDto.title,
      createInterviewDto.type,
      createInterviewDto.customType,
      createInterviewDto.context,
    );

    const formattedContent = JSON.parse(generatedContent);

    if (formattedContent.error) {
      throw new UnprocessableEntityException(formattedContent.error);
    }

    const interview = await this.create(jobId, createInterviewDto);

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
    });
  }

  async findOne(id: string) {
    return await this.prisma.interview.findUnique({
      where: {
        id,
      },
      include: {
        questions: {
          orderBy: {
            index: 'asc',
          },
        },
      },
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
        questions: {
          orderBy: {
            index: 'asc',
          },
        },
      },
    });
  }

  async remove(id: string) {
    return await this.prisma.interview.delete({
      where: {
        id,
      },
    });
  }

  async feedback(id: string) {
    const interview = await this.findOne(id);
    const job = await this.jobsService.findOne(interview.jobId);
    const criteria = this.criteria(interview.type);
    let score = 0;

    for (const question of interview.questions) {
      const feedback = await this.aceAIService.giveFeedback(
        job.title,
        job.company,
        interview.type,
        question.content,
        question.userResponse === '' ? 'No response given.' : question.userResponse,
        criteria,
      );

      const { score: questionScore, exemplar: exemplarAnswer, ...restOfFeedback } = feedback;

      // Update the question with feedback, including the new score and other feedback details
      await this.prisma.question.update({
        where: { id: question.id },
        data: {
          ...restOfFeedback,
          score: questionScore,
          exemplarAnswer,
        },
      });

      // Accumulate the scores
      score += questionScore;
    }

    // Calculate the final score based on all question scores
    const finalScore = score / interview.questions.length;

    // Update the interview with the final score and set the current question to the total count
    await this.prisma.interview.update({
      where: {
        id,
      },
      data: {
        overallScore: finalScore,
        currentQuestion: interview.questions.length,
      },
    });
  }

  async updateScore(score: number, interviewId: string) {
    const interview = await this.findOne(interviewId);
    const currentQuestion = interview.currentQuestion + 1;
    let newScore = interview.overallScore + score;
    if (currentQuestion === interview.questions.length) {
      newScore = newScore / interview.questions.length;
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

  criteria(type: InterviewType): string {
    const baseCriteria = 'Relevance, Clarity and Structure, Depth and Detail, Uniqueness, ';

    switch (type) {
      case 'TECHNICAL':
        return baseCriteria + 'Technical Accuracy';
      case 'BEHAVIORAL':
        return baseCriteria + 'Behavioural Competencies';
      default:
        return baseCriteria + 'Alignment with Job Requirements';
    }
  }

  async retakeInterview(originalInterviewId: string, sameQuestions: boolean) {
    // Fetch the original interview
    const originalInterview = await this.findOne(originalInterviewId);

    if (!originalInterview) {
      throw new NotFoundException('Original interview not found');
    }

    const interviewPayload: InterviewDto = {
      title: originalInterview.title + ' - Copy',
      type: originalInterview.type,
      customType: originalInterview.customType,
      context: originalInterview.context,
      currentQuestion: 0,
    };

    if (sameQuestions) {
      // Create a new interview with the same details but without responses or scores
      const newInterview = await this.create(originalInterview.jobId, interviewPayload);

      const questionPayload: string[] = [];

      originalInterview.questions.map((question) => {
        questionPayload.push(question.content);
      });

      const newQuestions = await this.questionsService.createMany(newInterview.id, questionPayload);

      return {
        ...newInterview,
        questions: newQuestions,
      };
    } else {
      return await this.createNew(originalInterview.jobId, interviewPayload);
    }
  }
}
