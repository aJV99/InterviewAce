import { Controller, Get, Post, Body, Param, Delete, Req, UseGuards, Put } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobDto, UpdateJobDto } from './dto/job.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RequestWithAuth } from 'src/dto/request.dto';

@UseGuards(JwtAuthGuard)
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  async create(@Req() req: RequestWithAuth, @Body() createJobDto: JobDto) {
    return await this.jobsService.create(createJobDto, req.user.id);
  }

  @Get()
  async findAll(@Req() req: RequestWithAuth) {
    return await this.jobsService.findAll(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: RequestWithAuth) {
    await this.jobsService.checkJobOwnership(id, req.user.id);
    return await this.jobsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto, @Req() req: RequestWithAuth) {
    await this.jobsService.checkJobOwnership(id, req.user.id);
    return await this.jobsService.update(id, updateJobDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: RequestWithAuth) {
    await this.jobsService.checkJobOwnership(id, req.user.id);
    return await this.jobsService.remove(id);
  }
}
