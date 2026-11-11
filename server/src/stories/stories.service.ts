import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, MoreThanOrEqual, Repository } from 'typeorm';
import { Stories } from './entity/stories.entity.js';
import { CreateStoryDto } from './dto/stories.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateStoryDto } from './dto/updateStories.dto.js';
import { MIN_SCORE } from '../common/constants/queue.constant.js';

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

     async findByJobId(jobId: number): Promise<Stories[]> {
          return this.StoriesRepository.find({
               where: { jobId },
               order: { createdAt: 'ASC' },
          });
     }

     async upsertByPost(data: CreateStoryDto) {
          await this.StoriesRepository.upsert(data, ['postId']);
     }

     async countStories(jobId: number) {
          return this.StoriesRepository.count({ where: { jobId, score: MoreThanOrEqual(MIN_SCORE) } });
     }

     async findAll({ page, pageSize, jobId }: { page: number; pageSize: number; jobId?: number }) {
          const where: FindOptionsWhere<Stories> = {
               score: MoreThanOrEqual(MIN_SCORE),
               ...(jobId !== undefined && { jobId }),
          };

          const [items, total] = await this.StoriesRepository.findAndCount({
               where,
               order: { createdAt: 'DESC', id: 'DESC' },
               skip: (page - 1) * pageSize,
               take: pageSize,
          });

          return { items, total, totalPages: Math.ceil(total / pageSize) };
     }
}
