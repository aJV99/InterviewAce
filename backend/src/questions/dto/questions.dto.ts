import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';

export class QuestionDto {
  @IsNotEmpty()
  @IsString()
  interviewId: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}

export class UpdateQuestionDto extends PartialType(QuestionDto) {}
