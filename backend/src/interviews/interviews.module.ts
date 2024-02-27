import { Module } from '@nestjs/common';
import { InterviewsController } from './interviews.controller';
import { InterviewsService } from './interviews.service';
import { PrismaService } from 'src/prisma.service';
import { AceAIService } from 'src/aceAI/aceAI.service';
import { QuestionsService } from 'src/questions/questions.service';
import { HttpModule } from '@nestjs/axios';
import { JobsService } from 'src/jobs/jobs.service';

@Module({
  imports: [HttpModule],
  controllers: [InterviewsController],
  providers: [
    InterviewsService,
    PrismaService,
    AceAIService,
    QuestionsService,
    JobsService,
  ],
})
export class InterviewsModule {}
