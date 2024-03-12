import { JsonObject } from '@prisma/client/runtime/library';

export class FeedbackDto {
  strengths: JsonObject;
  improvements: JsonObject;
  score: number;
  exemplar: string;
}
