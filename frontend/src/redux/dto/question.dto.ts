export interface Question {
  id: string;
  interviewId: string;
  index: number;
  content: string;
  userResponse: string | null;
  strengths: JSON | null;
  improvements: JSON | null;
  score: number | null;
  exemplarAnswer: string | null;
  createdAt: Date;
  updatedAt: Date;
  jobId: string;
}
