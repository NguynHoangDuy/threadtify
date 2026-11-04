import { PartialType } from '@nestjs/mapped-types';
import { LLMRunDto } from './llm.dto.js';

export class UpdateLLMRunDto extends PartialType(LLMRunDto) {}
