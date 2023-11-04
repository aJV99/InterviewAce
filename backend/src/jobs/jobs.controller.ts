import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  UseGuards,
  Put,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RequestWithAuth } from 'src/dto/request.dto';

@UseGuards(JwtAuthGuard)
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  create(@Body() createJobDto: CreateJobDto, @Req() req: RequestWithAuth) {
    return this.jobsService.create(createJobDto, req.user.id);
  }

  @Get()
  findAll(@Req() req: RequestWithAuth) {
    return this.jobsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: RequestWithAuth) {
    return this.jobsService.findOne(id, req.user.id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
    @Req() req: RequestWithAuth,
  ) {
    return this.jobsService.update(id, updateJobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: RequestWithAuth) {
    return this.jobsService.remove(id, req.user.id);
  }
}
