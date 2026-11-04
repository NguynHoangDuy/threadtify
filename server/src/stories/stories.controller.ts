import { Controller } from '@nestjs/common';
import { StoriesService } from './stories.service.js';

@Controller('stories')
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}
}
