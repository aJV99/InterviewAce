import { Module, forwardRef } from '@nestjs/common';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from 'src/prisma.service';
import { AceAIService } from 'src/aceAI/aceAI.service';
import { JobsService } from 'src/jobs/jobs.service';
import { InterviewsModule } from 'src/interviews/interviews.module';
import { AceAIModule } from 'src/aceAI/aceAI.module';

@Module({
  imports: [
    HttpModule,
    forwardRef(() => InterviewsModule),
    AceAIModule, // Use forwardRef here
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService, PrismaService, JobsService, AceAIService],
  exports: [QuestionsService],
})
export class QuestionsModule {}
