import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Stories } from './entity/stories.entity.js';
import { CreateStoryDto } from './dto/stories.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateStoryDto } from './dto/updateStories.dto.js';

@Injectable()
export class StoriesService {
    constructor(@InjectRepository(Stories) private readonly StoriesRepository: Repository<Stories>) {}

    async create(data: CreateStoryDto): Promise<Stories> {
        return this.StoriesRepository.save(data);
    }

    async update(id: string, data: UpdateStoryDto): Promise<Stories> {
        const story = await this.StoriesRepository.findOne({ where: { id } });
        if (!story) {
            throw new NotFoundException(`Story not found ${id}`);
        }

        Object.assign(story, data);
        return this.StoriesRepository.save(story);
    }

    async findByPostId(postId: string): Promise<Stories[]> {
        return this.StoriesRepository.find({ where: { postId } });
    }

    async findByJobId(jobId: string): Promise<Stories[]> {
        return this.StoriesRepository.find({
            where: { jobId },
            order: { createdAt: 'ASC' },
        });
    }
}
