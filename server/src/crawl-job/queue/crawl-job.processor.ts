import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { ThreadsClient } from '../../threads/thread.client.js';
import { PostsService } from '../../posts/posts.service.js';
import { CrawlJobService } from '../crawl-job.service.js';
import { CrawlJobStatus } from '../../common/constants/status.enum.js';
import { QUEUE_NAME } from '../../common/constants/queue.constant.js';
import { Queue } from 'bullmq';
import { PusherService } from '../../pusher/pusher.service.js';

@Processor(QUEUE_NAME.CRAWL_JOB_QUEUE, { concurrency: 1 })
export class CrawlJobProcessor extends WorkerHost {
    constructor(
        private readonly threadsClient: ThreadsClient,
        private readonly postsService: PostsService,
        private readonly crawlJobService: CrawlJobService,
        private readonly PusherService: PusherService,
        @InjectQueue(QUEUE_NAME.CRAWL_COMMENT_QUEUE) private CrawlCommentQueue: Queue,
    ) {
        super();
    }
    async process(job: any) {
        const { id: jobId, keyWord } = job.data;
        try {
            await this.crawlJobService.updateCrawlJob(jobId, { status: CrawlJobStatus.CRAWL_POST });

            await this.PusherService.addTriggerUpdateJob({
                id: jobId,
                status: CrawlJobStatus.CRAWL_POST,
            });

            const rawPost = await this.threadsClient.searchPostByKeyword(keyWord, jobId);

            if (rawPost.length === 0) {
                await this.crawlJobService.updateCrawlJob(jobId, {
                    status: CrawlJobStatus.COMPLETED,
                });

                await this.PusherService.addTriggerUpdateJob({
                    id: jobId,
                    status: CrawlJobStatus.COMPLETED,
                });

                return;
            }

            const posts = await this.postsService.createMany(rawPost);

            await this.PusherService.addTriggerUpdateJob({
                id: jobId,
                status: CrawlJobStatus.DONE_CRAWL_POST,
                numPosts: posts.length,
            });

            await this.crawlJobService.updateCrawlJob(jobId, { status: CrawlJobStatus.DONE_CRAWL_POST, numPosts: posts.length });

            await this.CrawlCommentQueue.add(QUEUE_NAME.CRAWL_COMMENT_QUEUE, jobId, {
                attempts: 3,
                backoff: { type: 'exponential', delay: 10000 },
            });
        } catch (error) {
            console.error('Error processing job:', error);
            await this.crawlJobService.updateCrawlJob(jobId, { status: CrawlJobStatus.FAILED });
            await this.PusherService.addTriggerUpdateJob({
                id: jobId,
                status: CrawlJobStatus.FAILED,
            });
        }
    }
}
