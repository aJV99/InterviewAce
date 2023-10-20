import { Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class QuestionsService {
  private readonly logger = new Logger(QuestionsService.name);
  private readonly OPENAI_API_ENDPOINT =
    'https://api.openai.com/v1/chat/completions';
  private readonly OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  constructor(private readonly httpService: HttpService) {}

  async getGptResponse(): Promise<JSON> {
    const headers = {
      Authorization: `Bearer ${this.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    };

    const payload = {
      messages: [{"role": "system", "content": "You are an interview response evaluator."},
      {"role": "user", "content": "Question: Tell me about a time you faced a challenge at work and how you handled it."},
      {"role": "user", "content": "Answer: Once at my previous job, I was given a project with a tight deadline. I quickly organized a team, delegated tasks, and ensured open communication. We worked extra hours and managed to complete the project on time, receiving appreciation from our superiors."},],
      model: 'gpt-4',
    };

    const { data } = await firstValueFrom(
      this.httpService
        .post(this.OPENAI_API_ENDPOINT, payload, { headers })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response?.data || 'Error contacting OpenAI API');
            throw new Error('Failed to get a response from OpenAI API');
          }),
        ),
    );

    return data.choices || 'No response';
  }
}
