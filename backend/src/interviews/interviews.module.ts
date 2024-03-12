import { Module, forwardRef } from '@nestjs/common';
import { InterviewsController } from './interviews.controller';
import { InterviewsService } from './interviews.service';
import { PrismaService } from 'src/prisma.service';
import { AceAIService } from 'src/aceAI/aceAI.service';
import { HttpModule } from '@nestjs/axios';
import { JobsService } from 'src/jobs/jobs.service';
import { GPTService } from 'src/aceAI/gpt.service';
import { QuestionsModule } from 'src/questions/questions.module';

@Module({
  imports: [
    HttpModule,
    forwardRef(() => QuestionsModule), // Ensure QuestionsModule is imported with forwardRef if needed
  ],
  controllers: [InterviewsController],
  providers: [InterviewsService, PrismaService, AceAIService, JobsService, GPTService],
  exports: [InterviewsService], // Ensure InterviewsService is exported
})
export class InterviewsModule {}
