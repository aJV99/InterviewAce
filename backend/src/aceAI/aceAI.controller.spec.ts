import { Test, TestingModule } from '@nestjs/testing';
import { AceAIController } from './aceAI.controller';

describe('AceAIController', () => {
  let controller: AceAIController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AceAIController],
    }).compile();

    controller = module.get<AceAIController>(AceAIController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
