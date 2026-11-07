import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './entity/post.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PostDto } from './dto/post.dto.js';
import { PostStatus } from '../common/constants/status.enum.js';
import { UpdatePostDto } from './dto/update-post.dto.js';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private postRepository: Repository<Post>,
    ) {}

    createMany(posts: PostDto[]): Promise<Post[]> {
        return this.postRepository.save(posts);
    }

    async updateStatus(id: string, status: PostStatus): Promise<PostDto> {
        const post = await this.postRepository.findOneBy({ id });

        if (!post) {
            throw new Error(`Post with id ${id} not found`);
        }

        post.status = status;

        return this.postRepository.save(post);
    }

    async update(id: string, data: UpdatePostDto): Promise<Post> {
        const post = await this.postRepository.findOneBy({ id });

        if (!post) {
            throw new NotFoundException(`Post with id ${id} not found`);
        }

        Object.assign(post, data);

        return this.postRepository.save(post);
    }

    findByJobId(jobId: number): Promise<Post[]> {
        return this.postRepository.find({ where: { jobId } });
    }

    findPostToRunning({ jobId, status }: { jobId: number; status: PostStatus[] }): Promise<Post[]> {
        return this.postRepository.find({ where: { jobId, status: In(status) } });
    }

    async findAll({ page, pageSize, jobId, id }: { page: number; pageSize: number; jobId?: number; id?: string }) {
        const where = {
            ...(jobId && { jobId: Number(jobId) }),
            ...(id && { id }),
        };

        const qb = this.postRepository
            .createQueryBuilder('post')
            .leftJoin('post.postParts', 'part', 'part.isRelevant = :isRelevant', { isRelevant: true })
            .addSelect('COUNT(part.id)', 'numComment')
            .groupBy('post.id')
            .orderBy('post.createdAt', 'DESC')
            .addOrderBy('post.id', 'DESC')
            .offset((page - 1) * pageSize)
            .limit(pageSize);

        if (jobId) qb.andWhere('post.jobId = :jobId', { jobId: Number(jobId) });
        if (id) qb.andWhere('post.id = :id', { id });

        const [{ entities, raw }, total] = await Promise.all([qb.getRawAndEntities(), this.postRepository.count({ where })]);

        const items = entities.map((post) => {
            const row = raw.find((r) => r.post_id === post.id);
            return { ...post, numRelatedComment: Number(row?.numComment ?? 0) };
        });

        return { items, total, totalPages: Math.ceil(total / pageSize) };
    }
}
