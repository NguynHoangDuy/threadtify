import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LLMRun } from './entity/llm.entity.js';
import { Repository } from 'typeorm';
import { LLMRunDto } from './dto/llm.dto.js';
import { UpdateLLMRunDto } from './dto/updatellm.dto.js';

@Injectable()
export class LLMService {
     constructor(
          @InjectRepository(LLMRun)
          private LLMRunRepository: Repository<LLMRun>,
     ) {}

     async create(data: LLMRunDto): Promise<LLMRun> {
          return await this.LLMRunRepository.save(data);
     }

     async update(id: string, dto: UpdateLLMRunDto): Promise<LLMRun> {
          const llmRun = await this.LLMRunRepository.preload({
               id,
               ...dto,
          });

          if (!llmRun) {
               throw new Error(`LLMRun ${id} not found`);
          }

          return this.LLMRunRepository.save(llmRun);
     }
}
