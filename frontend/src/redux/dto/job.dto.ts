import { Interview } from './interview.dto';

type ExcludeInterviews<T> = Omit<T, 'interviews'>;

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string | null;
  createdAt: Date;
  updatedAt: Date;
  interviews: { [key: string]: Interview }; // Expecting a dictionary here
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
