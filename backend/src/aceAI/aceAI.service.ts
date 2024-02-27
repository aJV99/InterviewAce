import { Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AceAIService {
  private readonly logger = new Logger(AceAIService.name);
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
      messages: [
        {
          role: 'system',
          content:
            'You are an interview response evaluator. Reply in JSON. Specify parts of the response which could be replaced. Your response should look like {"feedback": "...", "suggestions": [["replace this","with this"],["replace this","with this"]]}',
        },
        {
          role: 'user',
          content:
            'Question: Tell me about a time you faced a challenge at work and how you handled it.',
        },
        {
          role: 'user',
          content:
            'Answer: Once at my previous job, I was given a project with a tight deadline. I quickly organized a team, delegated tasks, and ensured open communication. We worked extra hours and managed to complete the project on time, receiving appreciation from our superiors.',
        },
      ],
      model: 'gpt-4-1106-preview',
      response_format: { type: 'json_object' },
    };

    const { data } = await firstValueFrom(
      this.httpService
        .post(this.OPENAI_API_ENDPOINT, payload, { headers })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(
              error.response?.data || 'Error contacting OpenAI API',
            );
            throw new Error('Failed to get a response from OpenAI API');
          }),
        ),
    );

    return JSON.parse(data.choices[0].message.content) || 'No response';
    // return data.choices[0].message || 'No response';
  }

  async generateQuestions(
    jobTitle: string,
    companyName: string,
    jobDescription: string,
    jobLocation: string,
  ): Promise<any> {
    const headers = {
      Authorization: `Bearer ${this.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    };

    const payload = {
      messages: [
        {
          role: 'system',
          content:
            'You are a professional career coach. Generate an array of interview questions based on the job details provided which would be done in a behavioral interview. Only respond with the array ["question #1", "question #2",...]',
        },
        {
          role: 'user',
          content: `Job Title: ${jobTitle}\nCompany: ${companyName}\nJob Description: ${jobDescription}\nLocation: ${jobLocation}`,
        },
      ],
      model: 'gpt-4-1106-preview',
      response_format: { type: 'text' },
    };

    const { data } = await firstValueFrom(
      this.httpService
        .post(this.OPENAI_API_ENDPOINT, payload, { headers })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(
              error.response?.data || 'Error contacting OpenAI API',
            );
            throw new Error('Failed to get a response from OpenAI API');
          }),
        ),
    );

    return JSON.parse(data.choices[0].message.content) || 'No response';
    // return data.choices[0].message || 'No response';
  }
}
