import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { AceAIService } from './aceAI.service';

@Controller('AceAI')
export class AceAIController {
  constructor(private readonly aceAIService: AceAIService) {}

  @Get('response')
  async getGptResponse2(): Promise<any> {
    try {
      const response = await this.aceAIService.getGptResponse();
      return response;
    } catch (error) {
      throw new HttpException('Failed to get a response from GPT-3.5 API', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('questions')
  async getGptResponse(): Promise<any> {
    try {
      const response = await this.aceAIService.generateQuestions(
        'Technology Consultant',
        'IBM iX',
        'Make websites, mobile apps or do devops.',
        'London, United Kingdom',
        'First Round',
        'BEHAVIORAL',
        null,
      );
      return response;
    } catch (error) {
      throw new HttpException(
        // 'Failed to get a response from GPT-3.5 API',
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('feedback')
  async getFeedback(): Promise<any> {
    try {
      const response = await this.aceAIService.giveFeedback(
        'Technology Consultant',
        'IBM iX',
        'BEHAVIORAL',
        'Describe a time when you had to work under pressure to meet a tight deadline. What was the situation, and how did you handle it?',
        "In my final year of university, I spearheaded a team project to develop a software application within a tight one-month deadline. The challenge escalated when a key team member fell ill. Recognizing the urgency, I immediately reprioritized tasks to focus on essential features, extending my working hours and reallocating tasks based on each member's strengths and workload capacity. We implemented agile development principles, conducting daily stand-ups to dynamically adjust our plan and employed a Kanban board to visually manage our workflow, identifying and addressing bottlenecks swiftly. One specific challenge was integrating a critical feature under the revised constraints, which we managed by simplifying the implementation without compromising its functionality. This approach not only ensured that the application was functional and met the primary requirements but also reinforced the value of flexibility, effective communication, and proactive problem-solving in a high-pressure environment. This experience sharpened my technical and project management skills, particularly in agile methodologies, making me well-prepared for the dynamic and collaborative work environment at IBM.",
        'Relevance, Clarity and Structure, Depth and Detail, Alignment with Job Requirements, Uniqueness',
      );
      return response;
    } catch (error) {
      throw new HttpException('Failed to get a response from GPT-3.5 API', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
