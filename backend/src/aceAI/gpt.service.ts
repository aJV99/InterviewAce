import { Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class GPTService {
  private readonly logger = new Logger(GPTService.name);
  private readonly OPENAI_API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
  private readonly OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  constructor(private readonly httpService: HttpService) {}

  async sendRequest(systemContent: string, userContent: string): Promise<any> {
    const headers = {
      Authorization: `Bearer ${this.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    };

    const responseFormat = systemContent.includes('JSON') ? { type: 'json_object' } : { type: 'text' };
    const payload = {
      messages: [
        {
          role: 'system',
          content: systemContent,
        },
        {
          role: 'user',
          content: userContent,
        },
      ],
      model: 'gpt-4-1106-preview',
      response_format: responseFormat,
    };

    const { data } = await firstValueFrom(
      this.httpService.post(this.OPENAI_API_ENDPOINT, payload, { headers }).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response?.data || 'Error contacting OpenAI API');
          throw new Error('Failed to get a response from OpenAI API');
        }),
      ),
    );

    // Adjusted to handle different response formats
    if (responseFormat.type === 'json_object') {
      return JSON.parse(data.choices[0].message.content) || 'No response';
    } else {
      return data.choices[0].message.content || 'No response';
    }
  }
}
