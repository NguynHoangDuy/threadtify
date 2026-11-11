import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrawlJobModule } from './crawl-job/crawl-job.module.js';
import { PostsModule } from './posts/posts.module.js';
import { BullModule } from '@nestjs/bullmq';
import { ThreadsModule } from './threads/thread.module.js';
import { PostPartsModule } from './post-parts/post-parts.module.js';
import { LLMModule } from './llm/llm.module.js';
import { StoriesModule } from './stories/stories.module.js';
import { PusherModule } from './pusher/pusher.module.js';

@Module({
     imports: [
          ConfigModule.forRoot({ isGlobal: true }),
          TypeOrmModule.forRootAsync({
               inject: [ConfigService],
               useFactory: (config: ConfigService) => ({
                    type: 'postgres',
                    host: config.get('DB_HOST'),
                    port: Number(config.get('DB_PORT')),
                    username: config.get('DB_USER'),
                    password: config.get('DB_PASSWORD'),
                    database: config.get('DB_NAME'),
                    autoLoadEntities: true,
                    synchronize: true,
               }),
          }),
          BullModule.forRoot({
               connection: {
                    host: 'redis',
                    port: 6379,
               },
          }),
          CrawlJobModule,
          PostsModule,
          ThreadsModule,
          PostPartsModule,
          LLMModule,
          StoriesModule,
          PusherModule,
     ],
})
export class AppModule {}
