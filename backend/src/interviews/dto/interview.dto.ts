import { PartialType } from '@nestjs/mapped-types';
import { InterviewType } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class InterviewDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  type: InterviewType;

  @IsString()
  customType: string;

  @IsString()
  context: string;
}

export class UpdateInterviewDto extends PartialType(InterviewDto) {}
