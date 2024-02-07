import { PartialType } from '@nestjs/mapped-types';
import { InterviewType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString, IsUUID, isEnum } from 'class-validator';

// export enum InterviewType {
//   GENERAL = 'GENERAL',
//   BEHAVIORAL = 'BEHAVIORAL',
//   TECHNICAL = 'TECHNICAL',
//   BUSINESS = 'BUSINESS',
//   SALARY_NEGOTIATION = 'SALARY_NEGOTIATION',
//   CUSTOM = 'CUSTOM',
// }

export class InterviewDto {
  @IsNotEmpty()
  @IsUUID()
  jobId: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  customType: string;

  @IsString()
  context: string;
}

export class UpdateInterviewDto extends PartialType(InterviewDto) {}
