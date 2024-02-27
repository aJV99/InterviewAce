import { PartialType } from '@nestjs/mapped-types';
import { InterviewType } from '@prisma/client';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class InterviewDto {
  @IsNotEmpty()
  @IsUUID()
  jobId: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  InterviewType: InterviewType;

  @IsString()
  customType: string;

  @IsString()
  context: string;
}

export class UpdateInterviewDto extends PartialType(InterviewDto) {}
