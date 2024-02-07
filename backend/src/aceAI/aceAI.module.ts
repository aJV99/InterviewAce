import { Module } from '@nestjs/common';
import { AceAIController } from './aceAI.controller';
import { AceAIService } from './aceAI.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [AceAIController],
  providers: [AceAIService],
})
export class AceAIModule {}
