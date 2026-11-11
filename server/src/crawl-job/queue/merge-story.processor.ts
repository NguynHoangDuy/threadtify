import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { MIN_SCORE, QUEUE_NAME } from '../../common/constants/queue.constant.js';
import { PostPartsService } from '../../post-parts/post-parts.service.js';
import { PostsService } from '../../posts/posts.service.js';
import { CrawlJobService } from '../crawl-job.service.js';
import { LLMClient } from '../../llm/llm.client.js';
import { Job } from 'bullmq';
import { CrawlJobStatus, PostStatus } from '../../common/constants/status.enum.js';
import { StoriesService } from '../../stories/stories.service.js';
import { sleep } from '../../common/utils/index.js';
import { PusherService } from '../../pusher/pusher.service.js';

@Processor(QUEUE_NAME.MERGE_STORY_QUEUE, { concurrency: 1 })
export class MergeStoryProcessor extends WorkerHost {
     constructor(
          private readonly PostPastService: PostPartsService,
          private readonly StoriesService: StoriesService,
          private readonly CrawlJobService: CrawlJobService,
          private readonly PusherService: PusherService,
          private readonly PostsService: PostsService,
          private readonly LLMClient: LLMClient,
     ) {
          super();
     }
     async process(job: Job): Promise<any> {
          const { data: jobId } = job;

          try {
               await this.CrawlJobService.updateCrawlJob(jobId, { status: CrawlJobStatus.MERGE_STORY });
               await this.PusherService.addTriggerUpdateJob({
                    id: jobId,
                    status: CrawlJobStatus.MERGE_STORY,
               });
               const posts = await this.PostsService.findPostToRunning({ jobId, status: [PostStatus.DONE_FILTER_COMMENT, PostStatus.FAILED_MERGE_STORY, PostStatus.MERGE_STORY] });

               for (let i = 0; i < posts.length; i++) {
                    const post = posts[i];
                    const { id, content: postContent } = post;
                    try {
                         await this.PostsService.updateStatus(id, PostStatus.MERGE_STORY);
                         await this.PusherService.addTriggerUpdatePost({
                              id,
                              status: PostStatus.MERGE_STORY,
                         });
                         const parts = await this.PostPastService.findPartInPost(id);
                         const content = [postContent, ...parts.map((p) => p.content)].join('\n\n---\n\n');

                         const merged = await this.LLMClient.mergeStory(content);

                         if (!merged) {
                              await this.PostsService.update(id, {
                                   status: PostStatus.FAILED_MERGE_STORY,
                                   error: 'LLM returned empty result',
                              });
                              await this.PusherService.addTriggerUpdatePost({
                                   id,
                                   status: PostStatus.FAILED_MERGE_STORY,
                                   error: 'LLM returned empty result',
                              });
                              continue;
                         }

                         await this.StoriesService.upsertByPost({
                              jobId,
                              postId: id,
                              content: merged.content,
                              name: merged.name,
                              score: merged.score,
                         });

                         await this.PostsService.updateStatus(id, PostStatus.COMPLETED);
                         await this.PusherService.addTriggerUpdatePost({
                              id,
                              status: PostStatus.COMPLETED,
                              score: merged.score,
                         });
                         await sleep(1000);
                    } catch (error) {
                         const message = error instanceof Error ? error.message : JSON.stringify(error);
                         console.log('QUEUE_NAME.MERGE_STORY_QUEUE postId-jobId', `${id}-${jobId}`, message, error);
                         await this.PostsService.update(id, { status: PostStatus.FAILED_MERGE_STORY, error: message });
                         await this.PusherService.addTriggerUpdatePost({
                              id,
                              status: PostStatus.FAILED_MERGE_STORY,
                              error: message,
                         });
                    }
               }
               const numStories = await this.StoriesService.countStories(jobId);
               await this.CrawlJobService.updateCrawlJob(jobId, { status: CrawlJobStatus.COMPLETED, numStories });
               await this.PusherService.addTriggerUpdateJob({
                    id: jobId,
                    status: CrawlJobStatus.COMPLETED,
                    numStories,
               });
          } catch (error) {
               console.log('MERGE_STORY_QUEUE', error);
               throw Error(JSON.stringify(error));
          }
     }

     @OnWorkerEvent('failed')
     async onFailed(job: Job) {
          const isLastAttempt = job.attemptsMade >= (job.opts.attempts ?? 1);
          if (isLastAttempt) {
               await this.CrawlJobService.updateCrawlJob(job.data, { status: CrawlJobStatus.FAILED });
               await this.PusherService.addTriggerUpdateJob({
                    id: job.data,
                    status: CrawlJobStatus.FAILED,
               });
          }
     }
}
