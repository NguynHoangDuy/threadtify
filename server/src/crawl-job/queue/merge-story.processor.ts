import { Processor, WorkerHost } from '@nestjs/bullmq';
import { MIN_SCORE, QUEUE_NAME } from '../../common/constants/queue.constant.js';
import { PostPartsService } from '../../post-parts/post-parts.service.js';
import { PostsService } from '../../posts/posts.service.js';
import { CrawlJobService } from '../crawl-job.service.js';
import { LLMClient } from '../../llm/llm.client.js';
import { Job } from 'bullmq';
import { CrawlJobStatus, PostStatus } from '../../common/constants/status.enum.js';
import { StoriesService } from '../../stories/stories.service.js';

@Processor(QUEUE_NAME.MERGE_STORY, { concurrency: 1 })
export class MergeStoryProcessor extends WorkerHost {
    constructor(
        private readonly PostPastService: PostPartsService,
        private readonly StoriesService: StoriesService,
        private readonly CrawlJobService: CrawlJobService,
        private readonly PostsService: PostsService,
        private readonly LLMClient: LLMClient,
    ) {
        super();
    }
    async process(job: Job): Promise<any> {
        const { data: post } = job;

        try {
            await this.CrawlJobService.updateCrawlJob(post.jobId, { status: CrawlJobStatus.MERGE_STORY });

            const parts = await this.PostPastService.findPartInPost(post.id);
            const content = [post.content, ...parts.map((p) => p.content)].join('\n\n---\n\n');

            const merged = await this.LLMClient.mergeStory(content);

            if (!merged) {
                return;
            }

            await this.StoriesService.create({
                jobId: post.jobId,
                postId: post.id,
                content: merged.content,
                score: merged.score,
            });

            if (merged.score >= MIN_SCORE) {
                await this.CrawlJobService.incrementNumStories(post.jobId);
            }

            await this.PostsService.updateStatus(post.id, PostStatus.COMPLETED);

            await this.CrawlJobService.finishIfDone(post.jobId);
        } catch (error) {
            console.log('error', error);
        }
    }
}
