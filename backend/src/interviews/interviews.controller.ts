import {
  UseGuards,
  Controller,
  Post,
  Body,
  Req,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RequestWithAuth } from 'src/dto/request.dto';
import { InterviewsService } from './interviews.service';
import { InterviewDto, UpdateInterviewDto } from './dto/interview.dto';

@UseGuards(JwtAuthGuard)
@Controller('interviews')
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Post()
  create(
    @Body() createInterviewDto: InterviewDto,
    @Req() req: RequestWithAuth,
  ) {
    return this.interviewsService.create(createInterviewDto, req.user.id);
  }

  @Get(':jobId')
  findAll(@Param('jobId') jobId: string) {
    return this.interviewsService.findAll(jobId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.interviewsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateInterviewDto: UpdateInterviewDto,
  ) {
    return this.interviewsService.update(id, updateInterviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.interviewsService.remove(id);
  }
}
