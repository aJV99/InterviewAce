import { Interview } from '@/redux/dto/interview.dto';

type ExcludeInterviews<T> = Omit<T, 'interviews'>;

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string | null;
  createdAt: Date;
  updatedAt: Date;
  interviews: { [key: string]: Interview };
}

export interface JobResponse extends ExcludeInterviews<Job> {
  interviews: Interview[];
}

export interface CreateJobDto {
  title: string;
  company: string;
  description: string;
  location?: string;
}

export interface UpdateJobDto extends Partial<CreateJobDto> {}
