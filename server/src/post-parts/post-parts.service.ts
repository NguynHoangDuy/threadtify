import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostPart } from './entity/post-part.entity.js';
import { In, Repository } from 'typeorm';
import { PostPartDto } from './dto/post-parts.dto.js';

@Injectable()
export class PostPartsService {
    constructor(
        @InjectRepository(PostPart)
        private PostPartRepository: Repository<PostPart>,
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
}
