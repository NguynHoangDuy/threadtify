import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateStoryDto {
     @IsNumber()
     jobId: number;

     @IsString()
     postId: string;

     @IsString()
     content: string;

     @IsOptional()
     @IsString()
     name: string | null;

     @IsInt()
     score: number;
}
