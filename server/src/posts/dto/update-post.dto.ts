import { PartialType } from '@nestjs/mapped-types';
import { PostDto } from './post.dto.js';

export class UpdatePostDto extends PartialType(PostDto) {}
