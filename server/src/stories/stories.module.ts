import { Module } from '@nestjs/common';
import { StoriesService } from './stories.service.js';
import { StoriesController } from './stories.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stories } from './entity/stories.entity.js';

@Module({
     imports: [TypeOrmModule.forFeature([Stories])],
     controllers: [StoriesController],
     providers: [StoriesService],
     exports: [StoriesService],
})
export class StoriesModule {}
