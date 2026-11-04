import { PartialType } from '@nestjs/mapped-types';
import { CreateStoryDto } from './stories.dto.js';

export class UpdateStoryDto extends PartialType(CreateStoryDto) {}
