export enum InterviewType {
  GENERAL = 'GENERAL',
  BEHAVIORAL = 'BEHAVIORAL',
  TECHNICAL = 'TECHNICAL',
  BUSINESS = 'BUSINESS',
  SALARY_NEGOTIATION = 'SALARY_NEGOTIATION',
  CUSTOM = 'CUSTOM',
}

export interface Interview {
  id: string;
  jobId: string;
  title: string;
  type: InterviewType;
  customType: string | null;
  context: string | null;
  overallScore: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInterviewDto {
  jobId: string;
  title: string;
  type: InterviewType;
  customType?: string;
  context?: string;
}

export interface UpdateInterviewDto extends Partial<CreateInterviewDto> {}