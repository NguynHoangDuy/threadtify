import { Module } from '@nestjs/common';
import { LLMClient } from './llm.client.js';
import { LLMService } from './llm.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LLMRun } from './entity/llm.entity.js';

@Module({
    imports: [TypeOrmModule.forFeature([LLMRun])],
    providers: [LLMClient, LLMService],
    exports: [LLMClient, LLMService],
})
export class LLMModule {}
