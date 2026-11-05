import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostPart } from './entity/post-part.entity.js';
import { DeepPartial, In, Repository } from 'typeorm';
import { PostPartDto } from './dto/post-parts.dto.js';
import { Stories } from '../stories/entity/stories.entity.js';

@Injectable()
export class PostPartsService {
    constructor(
        @InjectRepository(PostPart)
        private PostPartRepository: Repository<PostPart>,
        @InjectRepository(Stories)
        private StoriesRepository: Repository<Stories>,
    ) {}

    async createMany(data: PostPartDto[]): Promise<PostPart[]> {
        return this.PostPartRepository.save(data);
    }

    async markRelevance(results: { id: string; isRelevant: boolean }[]) {
        if (!results.length) return;

        const filteredAt = new Date();
        const relevantIds = results.filter((r) => r.isRelevant).map((r) => r.id);
        const irrelevantIds = results.filter((r) => !r.isRelevant).map((r) => r.id);

        if (relevantIds.length) {
            await this.PostPartRepository.update({ id: In(relevantIds) }, { isRelevant: true });
        }

        if (irrelevantIds.length) {
            await this.PostPartRepository.update({ id: In(irrelevantIds) }, { isRelevant: false });
        }
    }

    async findPartInPost(postId: string): Promise<{ content: string }[]> {
        return this.PostPartRepository.find({
            select: { content: true },
            where: { postId, isRelevant: true },
        });
    }

    async findCommentsInPost(postId: string): Promise<PostPart[]> {
        return this.PostPartRepository.find({
            where: { postId },
        });
    }

    async findCommentInPost(postId: string): Promise<{
        story: { id: string; score: number } | null;
        comments: { content: string }[];
    }> {
        const [story, comments] = await Promise.all([
            this.StoriesRepository.findOne({
                select: { id: true, score: true },
                where: { postId },
            }),
            this.PostPartRepository.find({
                select: { content: true },
                where: { postId, isRelevant: true },
            }),
        ]);

        return { story, comments };
    }

    async replaceForPost(postId: string, parts: DeepPartial<PostPart>[]) {
        await this.PostPartRepository.manager.transaction(async (manager) => {
            await manager.delete(PostPart, { postId });
            if (parts.length > 0) {
                await manager.save(PostPart, parts);
            }
        });
    }

    async countComment(jobId: string) {
        return this.PostPartRepository.createQueryBuilder('part').innerJoin('part.post', 'post').where('post.jobId = :jobId', { jobId }).getCount();
    }

    async countRelatedComment(jobId: string) {
        return this.PostPartRepository.createQueryBuilder('part').innerJoin('part.post', 'post').where('post.jobId = :jobId', { jobId }).andWhere('part.isRelevant = true').getCount();
    }
}
