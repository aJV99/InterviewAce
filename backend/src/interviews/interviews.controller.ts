import { UseGuards, Controller, Post, Body, Req, Get, Param, Put, Delete } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RequestWithAuth } from 'src/dto/request.dto';
import { InterviewsService } from './interviews.service';
import { InterviewDto, UpdateInterviewDto } from './dto/interview.dto';
import { JobsService } from 'src/jobs/jobs.service';

@UseGuards(JwtAuthGuard)
@Controller('interviews')
export class InterviewsController {
  constructor(
    private readonly interviewsService: InterviewsService,
    private readonly jobsService: JobsService,
  ) {}

  @Post(':jobId')
  async create(
    @Param('jobId') jobId: string,
    @Body() createInterviewDto: InterviewDto,
    @Req() req: RequestWithAuth,
  ) {
    await this.jobsService.checkJobOwnership(jobId, req.user.id);
    return await this.interviewsService.create(jobId, createInterviewDto);
  }

  // @Get(':jobId')
  // async findAll(@Param('jobId') jobId: string) {
  //   return await this.interviewsService.findAll(jobId);
  // }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: RequestWithAuth) {
    await this.interviewsService.checkInterviewOwnership(id, req.user.id);
    return await this.interviewsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateInterviewDto: UpdateInterviewDto,
    @Req() req: RequestWithAuth,
  ) {
    await this.interviewsService.checkInterviewOwnership(id, req.user.id);
    return await this.interviewsService.update(id, updateInterviewDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: RequestWithAuth) {
    await this.interviewsService.checkInterviewOwnership(id, req.user.id);
    return await this.interviewsService.remove(id);
  }
}
