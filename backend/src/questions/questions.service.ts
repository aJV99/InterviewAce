import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { QuestionDto, UpdateQuestionDto } from './dto/questions.dto';

@Injectable()
export class QuestionsService {
  constructor(private readonly prisma: PrismaService) {}

  async createMany(interviewId: string, createQuestionDtos: string[]) {
    return this.prisma.question.createMany({
      data: createQuestionDtos.map((questionDto) => ({
        content: questionDto,
        interviewId,
      })),
    });
  }

  async create(createQuestionDto: QuestionDto) {
    return this.prisma.question.create({
      data: createQuestionDto,
    });
  }

  async findAll() {
    return this.prisma.question.findMany();
  }

  async findOne(id: string) {
    return this.prisma.question.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateQuestionDto: UpdateQuestionDto) {
    return this.prisma.question.update({
      where: { id },
      data: updateQuestionDto,
    });
  }

  async remove(id: string) {
    return this.prisma.question.delete({
      where: { id },
    });
  }
}
