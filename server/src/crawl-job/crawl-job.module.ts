import { Module } from '@nestjs/common';
import { CrawlJobService } from './crawl-job.service.js';
import { CrawlJobController } from './crawl-job.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrawlJob } from './entity/crawl-job.entity.js';
import { BullModule } from '@nestjs/bullmq';
import { CrawlJobProcessor } from './queue/crawl-job.processor.js';
import { ThreadsClient } from '../threads/thread.client.js';
import { PostsModule } from '../posts/posts.module.js';
import { QUEUE_NAME } from '../common/constants/queue.constant.js';
import { PostPartsModule } from '../post-parts/post-parts.module.js';
import { CrawlCommentProcessor } from './queue/crawl-comment.processor.js';
import { FilterCommentProcessor } from './queue/filter-comment.processor.js';
import { LLMModule } from '../llm/llm.module.js';
import { MergeStoryProcessor } from './queue/merge-story.processor.js';
import { StoriesModule } from '../stories/stories.module.js';
import { Post } from '../posts/entity/post.entity.js';
import { PusherService } from '../pusher/pusher.service.js';

@Module({
     imports: [
          TypeOrmModule.forFeature([CrawlJob, Post]),
          BullModule.registerQueue({
               name: QUEUE_NAME.CRAWL_JOB_QUEUE,
          }),
          BullModule.registerQueue({
               name: QUEUE_NAME.CRAWL_COMMENT_QUEUE,
          }),
          BullModule.registerQueue({
               name: QUEUE_NAME.FILTER_COMMENT_QUEUE,
          }),
          BullModule.registerQueue({
               name: QUEUE_NAME.MERGE_STORY_QUEUE,
          }),
          PostsModule,
          PostPartsModule,
          LLMModule,
          StoriesModule,
     ],
     controllers: [CrawlJobController],
     providers: [CrawlJobService, CrawlJobProcessor, CrawlCommentProcessor, FilterCommentProcessor, ThreadsClient, MergeStoryProcessor, PusherService],
})
export class CrawlJobModule {}
