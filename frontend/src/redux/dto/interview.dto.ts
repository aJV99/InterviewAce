import { Question } from '@/redux/dto/question.dto';

export enum InterviewType {
  GENERAL = 'GENERAL',
  BEHAVIORAL = 'BEHAVIORAL',
  TECHNICAL = 'TECHNICAL',
  BUSINESS = 'BUSINESS',
  LEADERSHIP = 'LEADERSHIP',
  CUSTOM = 'CUSTOM',
}

export interface Interview {
  id: string;
  jobId: string;
  title: string;
  type: InterviewType;
  customType: string | null;
  context: string | null;
  questions: Question[];
  currentQuestion: number;
  overallScore: number | null;
  loading: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInterviewDto {
  title: string;
  type: InterviewType;
  customType?: string;
  context?: string;
  currentQuestion?: number;
}

export interface UpdateInterviewDto extends Partial<CreateInterviewDto> {}

export interface StartInterviewDto {
  jobId: string;
  interviewId: string;
}
