import { PartialType } from '@nestjs/mapped-types';
import { InterviewType } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class InterviewDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  type: InterviewType;

  @IsOptional()
  @IsString()
  customType: string;

  @IsOptional()
  @IsString()
  context: string;

  @IsOptional()
  @IsNumber()
  currentQuestion: number;
}

export class UpdateInterviewDto extends PartialType(InterviewDto) {}
