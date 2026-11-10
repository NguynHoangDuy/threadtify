import { InjectQueue, OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { QUEUE_NAME } from '../../common/constants/queue.constant.js';
import { Job, Queue } from 'bullmq';
import { PostPartsService } from '../../post-parts/post-parts.service.js';
import { PostsService } from '../../posts/posts.service.js';
import { CrawlJobService } from '../crawl-job.service.js';
import { CrawlJobStatus, PostStatus } from '../../common/constants/status.enum.js';
import { ThreadsClient } from '../../threads/thread.client.js';
import { sleep } from '../../common/utils/index.js';
import { PusherService } from '../../pusher/pusher.service.js';

@Processor(QUEUE_NAME.CRAWL_COMMENT_QUEUE, { concurrency: 1 })
export class CrawlCommentProcessor extends WorkerHost {
    constructor(
        private readonly PostPastService: PostPartsService,
        private readonly PostsService: PostsService,
        private readonly CrawlJobService: CrawlJobService,
        private readonly ThreadsClient: ThreadsClient,
        private readonly PusherService: PusherService,
        @InjectQueue(QUEUE_NAME.FILTER_COMMENT_QUEUE) private FilterCommentQueue: Queue,
    ) {
        super();
    }
    async process(job: Job): Promise<any> {
        const { data: jobId } = job;
        await this.CrawlJobService.updateCrawlJob(jobId, { status: CrawlJobStatus.CRAWL_COMMENT });
        await this.PusherService.addTriggerUpdateJob({
            id: jobId,
            status: CrawlJobStatus.CRAWL_COMMENT,
        });

        const posts = await this.PostsService.findPostToRunning({ jobId, status: [PostStatus.PENDING, PostStatus.FAILED_CRAWL_COMMENT, PostStatus.CRAWL_COMMENT] });

        for (let i = 0; i < posts.length; i++) {
            const post = posts[i];
            try {
                await this.PostsService.updateStatus(post.id, PostStatus.CRAWL_COMMENT);
                await this.PusherService.addTriggerUpdatePost({
                    id: post.id,
                    status: PostStatus.CRAWL_COMMENT,
                });
                const postPartRaw = await this.ThreadsClient.searchPostInfo(post.threadId, post.id);

                if (postPartRaw.length > 0) {
                    await this.PostPastService.replaceForPost(post.id, postPartRaw);
                }
                await this.PostsService.updateStatus(post.id, PostStatus.DONE_CRAWL_COMMENT);
                await this.PusherService.addTriggerUpdatePost({
                    id: post.id,
                    status: PostStatus.DONE_CRAWL_COMMENT,
                });
                await sleep(1000);
            } catch (error) {
                console.log('CRAWL_COMMENT_QUEUE postId-jobId', `${post.id}-${jobId}`, JSON.stringify(error));
                await this.PusherService.addTriggerUpdatePost({
                    id: post.id,
                    status: PostStatus.FAILED_CRAWL_COMMENT,
                    error: JSON.stringify(error),
                });
                await this.PostsService.update(post.id, { status: PostStatus.FAILED_CRAWL_COMMENT, error: JSON.stringify(error) });
            }
        }
        const numComments = await this.PostPastService.countComment(jobId);
        await this.CrawlJobService.updateCrawlJob(jobId, { numComments, status: CrawlJobStatus.DONE_CRAWL_COMMENT });

        await this.PusherService.addTriggerUpdateJob({
            id: jobId,
            numComments,
            status: CrawlJobStatus.DONE_CRAWL_COMMENT,
        });

        await this.FilterCommentQueue.add(QUEUE_NAME.FILTER_COMMENT_QUEUE, jobId, {
            attempts: 3,
            backoff: { type: 'exponential', delay: 10000 },
        });
    }

    @OnWorkerEvent('failed')
    async onFailed(job: Job) {
        const isLastAttempt = job.attemptsMade >= (job.opts.attempts ?? 1);
        if (isLastAttempt) {
            await this.PusherService.addTriggerUpdateJob({
                id: job.data,
                status: CrawlJobStatus.FAILED,
            });
            await this.CrawlJobService.updateCrawlJob(job.data, { status: CrawlJobStatus.FAILED });
        }
    }
}
