import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { ThreadsClient } from '../../threads/thread.client.js';
import { PostsService } from '../../posts/posts.service.js';
import { CrawlJobService } from '../crawl-job.service.js';
import { CrawlJobStatus } from '../../common/constants/status.enum.js';
import { QUEUE_NAME } from '../../common/constants/queue.constant.js';
import { Queue } from 'bullmq';

@Processor(QUEUE_NAME.CRAWL_JOB_QUEUE, { concurrency: 1 })
export class CrawlJobProcessor extends WorkerHost {
    constructor(
        private readonly threadsClient: ThreadsClient,
        private readonly postsService: PostsService,
        private readonly crawlJobService: CrawlJobService,
        @InjectQueue(QUEUE_NAME.ENRICH_POST_QUEUE) private enrichPostQueue: Queue,
    ) {
        super();
    }
    async process(job: any) {
        const { id: jobId, keyWord } = job.data;
        try {
            await this.crawlJobService.updateCrawlJob(jobId, { status: CrawlJobStatus.RUNNING });

            const rawPost = await this.threadsClient.searchPostByKeyword(keyWord, jobId);

            const posts = await this.postsService.createMany(rawPost);
            await this.crawlJobService.updateCrawlJob(jobId, { status: CrawlJobStatus.CRAWL_POST, numPosts: posts.length });

            for (const post of posts) {
                await this.enrichPostQueue.add(QUEUE_NAME.ENRICH_POST_QUEUE, post, {
                    attempts: 5,
                    backoff: { type: 'exponential', delay: 10000 },
                });
            }
        } catch (error) {
            console.error('Error processing job:', error);
            await this.crawlJobService.updateCrawlJob(jobId, { status: CrawlJobStatus.FAILED });
        }
    }
}
