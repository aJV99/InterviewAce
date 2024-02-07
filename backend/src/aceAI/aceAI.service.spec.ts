import { Test, TestingModule } from '@nestjs/testing';
import { AceAIService } from './aceAI.service';

describe('AceAIService', () => {
  let service: AceAIService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AceAIService],
    }).compile();

    service = module.get<AceAIService>(AceAIService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
