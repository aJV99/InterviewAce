import { Module } from '@nestjs/common';
import { AceAIController } from './aceAI.controller';
import { AceAIService } from './aceAI.service';
import { HttpModule } from '@nestjs/axios';
import { GPTService } from './gpt.service';

@Module({
  imports: [HttpModule],
  controllers: [AceAIController],
  providers: [AceAIService, GPTService],
  exports: [AceAIService, GPTService],
})
export class AceAIModule {}
