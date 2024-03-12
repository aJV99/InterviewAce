import { Interview } from './interview.dto';

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string | null;
  createdAt: Date;
  updatedAt: Date;
  interviews: Interview[];
}

export interface CreateJobDto {
  title: string;
  company: string;
  description: string;
  location?: string;
}

export interface UpdateJobDto extends Partial<CreateJobDto> {}
