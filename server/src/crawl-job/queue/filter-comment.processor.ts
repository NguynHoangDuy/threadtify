import { InjectQueue, OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { QUEUE_NAME } from '../../common/constants/queue.constant.js';
import { Job, Queue } from 'bullmq';
import { PostPartsService } from '../../post-parts/post-parts.service.js';
import { PostsService } from '../../posts/posts.service.js';
import { CrawlJobService } from '../crawl-job.service.js';
import { CrawlJobStatus, PostStatus } from '../../common/constants/status.enum.js';
import { LLMClient } from '../../llm/llm.client.js';
import { sleep } from '../../common/utils/index.js';
import { PusherService } from '../../pusher/pusher.service.js';

@Processor(QUEUE_NAME.FILTER_COMMENT_QUEUE, { concurrency: 1 })
export class FilterCommentProcessor extends WorkerHost {
    constructor(
        private readonly PostPastService: PostPartsService,
        private readonly PostsService: PostsService,
        private readonly CrawlJobService: CrawlJobService,
        private readonly PusherService: PusherService,
        private readonly LLMClient: LLMClient,
        @InjectQueue(QUEUE_NAME.MERGE_STORY_QUEUE) private MergeStoryQueue: Queue,
    ) {
        super();
    }
    async process(job: Job): Promise<any> {
        const { data: jobId } = job;

        await this.CrawlJobService.updateCrawlJob(jobId, { status: CrawlJobStatus.FILTER_COMMENT });
        await this.PusherService.addTriggerUpdateJob({
            id: jobId,
            status: CrawlJobStatus.FILTER_COMMENT,
        });
        const posts = await this.PostsService.findPostToRunning({ jobId, status: [PostStatus.DONE_CRAWL_COMMENT, PostStatus.FAILED_FILTER_COMMENT, PostStatus.FILTER_COMMENT] });

        for (let i = 0; i < posts.length; i++) {
            const post = posts[i];
            try {
                await this.PostsService.updateStatus(post.id, PostStatus.FILTER_COMMENT);
                await this.PusherService.addTriggerUpdatePost({
                    id: post.id,
                    status: CrawlJobStatus.FILTER_COMMENT,
                });
                const comments = await this.PostPastService.findCommentsInPost(post.id);

                if (comments.length > 0) {
                    const postPart = comments.map((item) => {
                        return { id: item.id, content: item.content };
                    });
                    const CHUNK_SIZE = 20;

                    for (let start = 0; start < postPart.length; start += CHUNK_SIZE) {
                        const chunk = postPart.slice(start, start + CHUNK_SIZE);
                        const results = await this.LLMClient.filterStoryPart({ content: post.content }, chunk);
                        await this.PostPastService.markRelevance(results);
                        await sleep(1000);
                    }
                }

                await this.PostsService.updateStatus(post.id, PostStatus.DONE_FILTER_COMMENT);
                await this.PusherService.addTriggerUpdatePost({
                    id: post.id,
                    status: PostStatus.DONE_FILTER_COMMENT,
                });
            } catch (error) {
                const message = error instanceof Error ? error.message : JSON.stringify(error);

                console.log('Error QUEUE_NAME.FILTER_COMMENT_QUEUE postId-jobId', `${post.id}-${jobId}`, message);
                await this.PostsService.update(post.id, { status: PostStatus.FAILED_FILTER_COMMENT, error: message });
                await this.PusherService.addTriggerUpdatePost({
                    id: post.id,
                    status: PostStatus.FAILED_FILTER_COMMENT,
                });
            }
        }

        const numRelevant = await this.PostPastService.countRelatedComment(jobId);
        await this.CrawlJobService.updateCrawlJob(jobId, { numRelevant, status: CrawlJobStatus.DONE_FILTER_COMMENT });
        await this.PusherService.addTriggerUpdatePost({
            id: jobId,
            status: CrawlJobStatus.DONE_FILTER_COMMENT,
            numRelevant,
        });

        await this.MergeStoryQueue.add(QUEUE_NAME.MERGE_STORY_QUEUE, jobId, {
            attempts: 3,
            backoff: { type: 'exponential', delay: 10000 },
        });
    }

    @OnWorkerEvent('failed')
    async onFailed(job: Job) {
        const isLastAttempt = job.attemptsMade >= (job.opts.attempts ?? 1);
        if (isLastAttempt) {
            await this.CrawlJobService.updateCrawlJob(job.data, { status: CrawlJobStatus.FAILED });
            await this.PusherService.addTriggerUpdatePost({
                id: job.data,
                status: CrawlJobStatus.FAILED,
            });
        }
    }
}
