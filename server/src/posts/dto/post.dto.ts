import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

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

    @IsString()
    imageUrl: string;

    @IsString()
    postUrl: string;
}
