import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { QUEUE_NAME } from '../../common/constants/queue.constant.js';
import { Job, Queue } from 'bullmq';
import { PostPartsService } from '../../post-parts/post-parts.service.js';
import { PostsService } from '../../posts/posts.service.js';
import { CrawlJobService } from '../crawl-job.service.js';
import { CrawlJobStatus, PostStatus } from '../../common/constants/status.enum.js';
import { ThreadsClient } from '../../threads/thread.client.js';
import { LLMClient } from '../../llm/llm.client.js';

@Processor(QUEUE_NAME.ENRICH_POST_QUEUE, { concurrency: 1 })
export class EnrichPostProcessor extends WorkerHost {
    constructor(
        private readonly PostPastService: PostPartsService,
        private readonly PostsService: PostsService,
        private readonly CrawlJobService: CrawlJobService,
        private readonly ThreadsClient: ThreadsClient,
        private readonly LLMClient: LLMClient,
        @InjectQueue(QUEUE_NAME.MERGE_STORY) private MergeStoryQueue: Queue,
    ) {
        super();
    }
    async process(job: Job): Promise<any> {
        const { data: post } = job;
        try {
            await this.CrawlJobService.updateCrawlJob(post.jobId, { status: CrawlJobStatus.CRAWL_PART });
            await this.PostsService.updateStatus(post.id, PostStatus.RUNNING);
            const postPartRaw = await this.ThreadsClient.searchPostInfo(post.threadId, post.id);
            if (postPartRaw.length === 0) {
                await this.PostsService.updateStatus(post.id, PostStatus.COMPLETED);
                return;
            }

            const postPart = await this.PostPastService.createMany(postPartRaw);

            const results = await this.LLMClient.filterStoryPart({ content: post.content }, postPart);

            await this.PostPastService.markRelevance(results);
            await this.PostsService.updateStatus(post.id, PostStatus.ENRICH);

            await this.MergeStoryQueue.add(QUEUE_NAME.MERGE_STORY, post, {
                attempts: 3,
                backoff: { type: 'exponential', delay: 10000 },
            });
        } catch (error) {
            await this.PostsService.updateStatus(post.id, PostStatus.FAILED);
            console.log('error', error);
        }
    }
}
