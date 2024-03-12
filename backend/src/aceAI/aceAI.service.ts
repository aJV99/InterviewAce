import { Injectable, Logger } from '@nestjs/common';
import { GPTService } from './gpt.service';
import { InterviewType } from '@prisma/client';
import { FeedbackDto } from 'src/dto/feedback.dto';

@Injectable()
export class AceAIService {
  private readonly logger = new Logger(AceAIService.name);
  constructor(private readonly gptService: GPTService) {}

  // Refactored to use sendRequest
  async getGptResponse(): Promise<JSON> {
    const systemContent =
      'You are an interview response evaluator. Reply in JSON. Specify parts of the response which could be replaced. Your response should look like {"feedback": "...", "suggestions": [["replace this","with this"],["replace this","with this"]]}';
    const userContent =
      'Question: Tell me about a time you faced a challenge at work and how you handled it.' +
      'Answer: Once at my previous job, I was given a project with a tight deadline. I quickly organized a team, delegated tasks, and ensured open communication. We worked extra hours and managed to complete the project on time, receiving appreciation from our superiors.';
    return this.gptService.sendRequest(systemContent, userContent);
  }

  // Refactored to use sendRequest and to handle multiple user content pieces
  async generateQuestions(
    jobTitle: string,
    company: string,
    jobDescription: string,
    jobLocation: string | null,
    interviewTitle: string,
    interviewType: InterviewType,
    interviewContext: string | null,
  ): Promise<any> {
    const systemContent = `You specialize in creating realistic mock interview questions, carefully tailored to the specific requirements of the job role using factors like the job role title, company, job description, job location, interview title, type of interview, and any additional context. You must generate questions in an array format, aiming for 7 to 10 questions on average, unless specified otherwise, and make educated assumptions based on common role requirements. The tone adapts to the job role's context, ensuring realism. AceMaker's responses are exclusively the questions themselves, with nothing else included, ensuring a focused and relevant interview preparation experience. The questions should be formatted as ['question1','question2', 'question3']. Additionally always include an introduction question. If the content seems to be like a joke, illegal, incorrect or bad in any way, please just return with {error: error reasoning}`;

    let userContent = `Generate questions for the below role and interview:\nRole Title: "${jobTitle}"\nCompany: "${company}"\nJob Description: "${jobDescription}"\n`;
    if (jobLocation) {
      userContent += `Location: "${jobLocation}"\n`;
    }
    userContent += `Interview Title: "${interviewTitle}"\nInterview Type: "${interviewType}"\n`;
    if (interviewContext) {
      userContent += `Interview Context: "${interviewContext}"`;
    }

    return this.gptService.sendRequest(systemContent, userContent);
  }

  async giveFeedback(
    jobTitle: string,
    company: string,
    interviewType: InterviewType,
    question: string,
    response: string,
    criteria: string,
  ): Promise<FeedbackDto> {
    const systemContent = `Your role is to provide tailored feedback on responses to interview questions, focusing on four key areas in your feedback. You will identify strengths in the response, pinpoint areas for improvement, score the response out of 100 based on the given criteria, and provide an exemplary answer for comparison. Your feedback should be specific to the role title, company, question, and criteria provided, ensuring it aligns with relevance to the role, company, and overall effectiveness. Avoid offering opinions on the company or the role itself but concentrate on the interview response's effectiveness. Your feedback must be structured in a JSON format as follows: {"strengths":{"Criteria1":"explanation",...},"improvements":{"Criteria2":"explanation",...},"score": number, "exemplar":"answer"}. The exemplar answer should improve the response and should ideally score a 100. Do not create new criteria unless specifically told to do so. Aim to deliver a comprehensive evaluation and constructive feedback based on the provided information.`;
    const userContent = `Provide feedback on the response:\n\nRole Title: "${jobTitle}"\nCompany: "${company}"\nInterview Type: "${interviewType}"\nQuestion: "${question}"\nResponse: ${response}\nCriteria: "${criteria}"`;

    return this.gptService.sendRequest(systemContent, userContent);
  }
}
