import { Module } from '@nestjs/common';
import { PostPartsService } from './post-parts.service.js';
import { PostPartsController } from './post-parts.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostPart } from './entity/post-part.entity.js';
import { Stories } from '../stories/entity/stories.entity.js';

@Module({
    imports: [TypeOrmModule.forFeature([PostPart, Stories])],
    controllers: [PostPartsController],
    providers: [PostPartsService],
    exports: [PostPartsService],
})
export class PostPartsModule {}
