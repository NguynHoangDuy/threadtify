import { IsString } from 'class-validator';

export class PostPartDto {
     @IsString()
     postId: string;

     @IsString()
     content: string;
}
