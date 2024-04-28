import { Module } from '@nestjs/common';
import { AceAIService } from './aceAI.service';
import { HttpModule } from '@nestjs/axios';
import { GPTService } from './gpt.service';

@Module({
  imports: [HttpModule],
  providers: [AceAIService, GPTService],
  exports: [AceAIService, GPTService],
})
export class AceAIModule {}
