import { Controller, Get, Query } from '@nestjs/common';
import { PostPartsService } from './post-parts.service.js';

@Controller('post-parts')
export class PostPartsController {
    constructor(private readonly postPartsService: PostPartsService) {}

    @Get()
    async findCommentInPost(@Query('postId') postId: string): Promise<{
        story: { id: string; score: number } | null;
        comments: { content: string }[];
    }> {
        return this.postPartsService.findCommentInPost(postId);
    }
}
