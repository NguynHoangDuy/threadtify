import { Controller, Get, Query } from '@nestjs/common';
import { StoriesService } from './stories.service.js';

@Controller('stories')
export class StoriesController {
     constructor(private readonly storiesService: StoriesService) {}

     @Get()
     async getStories(@Query() query: { page: number; pageSize: number; jobId?: number }) {
          return this.storiesService.findAll(query);
     }
}
