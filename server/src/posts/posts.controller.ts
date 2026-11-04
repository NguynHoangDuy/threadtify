import { Controller, Get, Query } from '@nestjs/common';
import { PostsService } from './posts.service.js';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get()
    async findPosts(@Query() query: { page: number; pageSize: number; jobId?: number; id?: string }) {
        return this.postsService.findAll(query);
    }
}
