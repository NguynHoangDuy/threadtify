import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { CrawlJobStatus } from '../../common/constants/status.enum.js';

export class GetCrawlJobsDto {
     @IsOptional()
     @Type(() => Number)
     @IsInt()
     @Min(1)
     page: number = 1;

     @IsOptional()
     @Type(() => Number)
     @IsInt()
     @Min(1)
     @Max(100)
     pageSize: number = 10;

     @IsOptional()
     @IsString()
     keyWord?: string;

     @IsOptional()
     @IsEnum(CrawlJobStatus)
     status?: CrawlJobStatus;
}
