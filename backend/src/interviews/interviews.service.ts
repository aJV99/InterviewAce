import { Injectable } from '@nestjs/common';
import { InterviewDto, UpdateInterviewDto } from './dto/interview.dto';
import { PrismaService } from 'src/prisma.service';
import { QuestionsService } from 'src/questions/questions.service';
import { AceAIService } from 'src/aceAI/aceAI.service';
import { JobsService } from 'src/jobs/jobs.service';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class InterviewsService {
  private interviewUpdates = new Subject<any>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly aceAIService: AceAIService,
    private readonly questionsService: QuestionsService,
    private readonly jobsService: JobsService,
  ) {}

  getInterviewUpdates(): Observable<any> {
    return this.interviewUpdates.asObservable();
  }

  async create(createInterviewDto: InterviewDto, userId: string) {
    const interview = await this.prisma.interview.create({
      data: {
        ...createInterviewDto,
      },
      include: {
        job: true,
        questions: true,
      },
    });

    const { title, company, description, location } =
      await this.jobsService.findOne(createInterviewDto.jobId, userId);

    // Generate questions using AI service
    // const generatedContent = await this.aceAIService.generateQuestions(title, company, description, location);
    const generatedContent = [
      "How you doin'",
      'Haaaave you met Ted?',
      `${title}`,
      `${company}`,
      `${description}`,
      `${location}`,
    ];
    console.log('generatedContent' + generatedContent);
    console.log('interview.id' + interview.id);

    // const questions = generatedContent.map(content => ({ content }));

    // Use QuestionService to create questions for this interview
    const questions = await this.questionsService.createMany(
      interview.id,
      generatedContent,
    );

    return {
      ...interview,
      questions: questions,
    };
  }

  async findAll(jobId: string) {
    return this.prisma.interview.findMany({
      where: {
        jobId,
      },
      include: {
        questions: true, // assuming you want to include questions in the response
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.interview.findUnique({
      where: {
        id,
      },
      include: {
        questions: true,
      },
    });
  }

  async update(id: string, updateInterviewDto: UpdateInterviewDto) {
    return this.prisma.interview.update({
      where: {
        id,
      },
      data: {
        ...updateInterviewDto,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.interview.delete({
      where: {
        id,
      },
    });
  }
}
