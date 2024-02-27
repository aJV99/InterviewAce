export interface Question {
  id: string;
  interviewId: string;
  content: string;
  userResponse: string | null;
  feedback: string | null;
  score: number | null;
  createdAt: Date;
  updatedAt: Date;
}

// export interface CreateInterviewDto {
//   jobId: string;
//   title: string;
//   type: InterviewType;
//   customType?: string;
//   context?: string;
// }

// export interface UpdateInterviewDto extends Partial<CreateInterviewDto> {}
