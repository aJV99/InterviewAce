import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { AceAIService } from './aceAI.service';

@Controller('AceAI')
export class AceAIController {
  constructor(private readonly AceAIService: AceAIService) {}

  @Get('response')
  async getGptResponse(): Promise<any> {
    try {
      const response = await this.AceAIService.generateQuestions("Technology Consultant", "IBM iX","Make websites, mobile apps or do devops.","London, United Kingdom");
      return response;
    } catch (error) {
      throw new HttpException(
        'Failed to get a response from GPT-3.5 API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
