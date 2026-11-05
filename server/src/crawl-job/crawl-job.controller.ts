import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CrawlJobService } from './crawl-job.service.js';
import { GetCrawlJobsDto } from './dto/get-crawl-jobs.dto.js';
import { InjectQueue } from '@nestjs/bullmq';
import { QUEUE_NAME } from '../common/constants/queue.constant.js';
import { Queue } from 'bullmq';

@Controller('crawl-job')
export class CrawlJobController {
    constructor(
        private readonly crawlJobService: CrawlJobService,
        @InjectQueue(QUEUE_NAME.FILTER_COMMENT_QUEUE) private readonly FilterCommentQueue: Queue,
    ) {}

    @Get()
    async createCrawlJob(@Query('keyWord') keyWord: string): Promise<any> {
        const result = await this.crawlJobService.createCrawlJob(keyWord);
        return result;
    }

    @Post()
    async getCrawlJobs(@Body() body: GetCrawlJobsDto) {
        return this.crawlJobService.getCrawlJobs(body);
    }

    @Get(':id/retry-filter-comment')
    async retryMerge(@Param('id') id: string) {
        const jobId = Number(id);
        await this.FilterCommentQueue.add(QUEUE_NAME.FILTER_COMMENT_QUEUE, jobId, {
            attempts: 3,
            backoff: { type: 'exponential', delay: 10000 },
        });
        return { ok: true };
    }
}
