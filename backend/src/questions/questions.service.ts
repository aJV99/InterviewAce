import { Inject, Injectable, NotFoundException, UnauthorizedException, forwardRef } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AceAIService } from 'src/aceAI/aceAI.service';
import { InterviewType, Question } from '@prisma/client';
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
            job: true, // Include the job through the interview to check the owner
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
      data: createQuestionDtos.map((questionDto) => ({
        content: questionDto,
        interviewId,
      })),
    }); 
    return await this.findAll(interviewId); ;
  }

  async create(interviewId: string, content: string) {
    return await this.prisma.question.create({
      data: {
        interviewId,
        content,
      },
    });
  }

  async findAll(interviewId: string) {
    return await this.prisma.question.findMany({
      where: { interviewId },
    });
  }

  async findOne(id: string) {
    return await this.prisma.question.findUnique({
      where: { id },
    });
  }

  async update(id: string, content: string) {
    return await this.prisma.question.update({
      where: { id },
      data: { content },
    });
  }

  async answer(id: string, userResponse: string): Promise<Question> {
    // Specify the actual return type
    const question = await this.findOne(id);
    const interview = await this.interviewsService.findOne(question.interviewId);
    const job = await this.jobsService.findOne(interview.jobId);

    // Initial update with user response
    let updatedQuestion = await this.prisma.question.update({
      where: { id },
      data: { userResponse },
    });

    try {
      const criteria = this.criteria(interview.type);
      const feedback = await this.aceAIService.giveFeedback(
        job.title,
        job.company,
        interview.type,
        question.content,
        userResponse,
        criteria,
      );

      // const feedback = {
      //   strengths: {"Uniqueness":"The context of creating a personal project for a significant other is unique and could stand out in an interview setting."},
      //   improvements: {"Relevance":"The response does not directly address the question about implementing an innovative feature in a mobile app, which is critical for the position of a Technology Consultant at IBM iX.","Depth and Detail":"There is a lack of depth and detail about the actual implementation process and the innovative features introduced, which is necessary to showcase technical competence.","Clarity and Structure":"The response lacks clarity and structure. There is no clear narrative or sequence of events. The use of filler words ('OK', 'yeah', 'like') diminishes the professional tone of the response.","Alignment with Job Requirements":"The answer fails to demonstrate any relevant skills or experiences that align with the role of a Technology Consultant, such as strategic thinking, technical skills, or a customer-centric approach."},
      //   score: 20,
      //   exemplar: "In my previous role as a mobile developer, we were tasked to enhance user engagement for our e-commerce platform's mobile app. We reviewed user feedback and noticed that users wanted a more personalized shopping experience. My approach involved proposing a feature that used machine learning to provide personalized recommendations to users. I led a cross-functional team to design the feature's algorithm by analyzing user behavior data. We then developed a minimum viable product that we continuously refined based on user testing. Through this iterative process, we successfully increased app usage by 30% within the first quarter of implementation. This project was in line with my role as a Technology Consultant, where I was able to showcase my skills in app development, data analysis, and delivering user-centric solutions."
      // }

      const { exemplar: exemplarAnswer, ...restOfFeedback } = feedback;

      // Update with feedback, spreading the rest of the feedback and adding the renamed property
      updatedQuestion = await this.prisma.question.update({
        where: { id },
        data: {
          ...restOfFeedback,
          exemplarAnswer, // Use the renamed property
        },
      });
    } catch (error) {
      console.error('Error generating feedback:', error);
      // Optionally handle the error, e.g., logging or throwing a custom error
    }

    return updatedQuestion;
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

  async remove(id: string) {
    return await this.prisma.question.delete({
      where: { id },
    });
  }
}
