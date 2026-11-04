import { IsEnum, IsOptional, IsString } from 'class-validator';
import { LLMStatus, LLMType } from '../../common/constants/status.enum.js';

export class LLMRunDto {
    @IsString()
    prompt: string;

    @IsEnum(LLMType)
    type: LLMType;

    @IsEnum(LLMStatus)
    @IsOptional()
    status?: LLMStatus;

    @IsOptional()
    @IsString()
    result?: string | null;

    @IsOptional()
    @IsString()
    error?: string | null;
}
