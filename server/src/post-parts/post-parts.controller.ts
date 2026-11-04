import { Controller } from '@nestjs/common';
import { PostPartsService } from './post-parts.service.js';

@Controller('post-parts')
export class PostPartsController {
  constructor(private readonly postPartsService: PostPartsService) {}
}
