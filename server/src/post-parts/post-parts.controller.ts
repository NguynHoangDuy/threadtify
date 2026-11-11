import { Controller, Get, ParseBoolPipe, ParseIntPipe, Query } from '@nestjs/common';
import { PostPartsService } from './post-parts.service.js';

@Controller('post-parts')
export class PostPartsController {
     constructor(private readonly postPartsService: PostPartsService) {}

     @Get()
     async findCommentInPost(@Query('postId') postId: string) {
          return this.postPartsService.findCommentInPost(postId);
     }
}
