import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Req,
  Inject,
  forwardRef,
  UseGuards,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { InterviewsService } from 'src/interviews/interviews.service';
import { RequestWithAuth } from 'src/dto/request.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('questions')
export class QuestionsController {
  constructor(
    @Inject(forwardRef(() => InterviewsService))
    private readonly interviewsService: InterviewsService,
    private readonly questionsService: QuestionsService,
  ) {}

  @Post(':interviewId')
  async create(
    @Param('interviewId') interviewId: string,
    @Body('content') content: string,
    @Req() req: RequestWithAuth,
  ) {
    await this.interviewsService.checkInterviewOwnership(interviewId, req.user.id);
    return await this.questionsService.create(interviewId, content);
  }

  @Get(':interviewId')
  async findAll(@Param('interviewId') interviewId: string, @Req() req: RequestWithAuth) {
    await this.interviewsService.checkInterviewOwnership(interviewId, req.user.id);
    return await this.questionsService.findAll(interviewId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body('content') content: string, @Req() req: RequestWithAuth) {
    await this.questionsService.checkQuestionOwnership(id, req.user.id);
    return await this.questionsService.update(id, content);
  }

  @Put('answer/:id')
  async answer(@Param('id') id: string, @Body('response') response: string, @Req() req: RequestWithAuth) {
    await this.questionsService.checkQuestionOwnership(id, req.user.id);
    const resp = await this.questionsService.answer(id, response);
    const interview = await this.interviewsService.findOne(resp.interviewId);
    if (interview.questions.length === resp.index + 1) {
      this.interviewsService.feedback(resp.interviewId);
    } else {
      await this.interviewsService.update(resp.interviewId, { currentQuestion: resp.index });
    }
    return resp;
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: RequestWithAuth) {
    await this.questionsService.checkQuestionOwnership(id, req.user.id);
    return await this.questionsService.remove(id);
  }
}
