import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PostStatus } from '../../common/constants/status.enum.js';

export class PostDto {
     @IsString()
     @IsNotEmpty()
     threadId: string;

     @IsNumber()
     @IsNotEmpty()
     jobId: number;

     @IsString()
     author: string;

     @IsString()
     content: string;

     @IsOptional()
     @IsEnum(PostStatus)
     status?: PostStatus;

     @IsOptional()
     @IsString()
     error?: string | null;

     @IsString()
     imageUrl: string;

     @IsString()
     postUrl: string;
}
