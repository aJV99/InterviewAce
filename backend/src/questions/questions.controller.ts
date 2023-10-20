import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { QuestionsService } from './questions.service';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly QuestionsService: QuestionsService) {}

  @Get('response')
  async getGptResponse(): Promise<any> {
    try {
      const response = await this.QuestionsService.getGptResponse();
      return { response };
    } catch (error) {
      throw new HttpException(
        'Failed to get a response from GPT-3.5 API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
