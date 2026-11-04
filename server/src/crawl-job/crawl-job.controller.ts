import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CrawlJobService } from './crawl-job.service.js';
import { GetCrawlJobsDto } from './dto/get-crawl-jobs.dto.js';

@Controller('crawl-job')
export class CrawlJobController {
    constructor(private readonly crawlJobService: CrawlJobService) {}

    @Get()
    async createCrawlJob(@Query('keyWord') keyWord: string): Promise<any> {
        const result = await this.crawlJobService.createCrawlJob(keyWord);
        return result;
    }

    @Post()
    async getCrawlJobs(@Body() body: GetCrawlJobsDto) {
        console.log('body', body);
        return this.crawlJobService.getCrawlJobs(body);
    }
}
