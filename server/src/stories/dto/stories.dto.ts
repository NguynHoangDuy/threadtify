import { IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateStoryDto {
    @IsUUID()
    jobId: string;

    @IsString()
    postId: string;

    @IsString()
    content: string;

    @IsInt()
    score: number;
}
