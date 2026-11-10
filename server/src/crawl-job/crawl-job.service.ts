import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrawlJob } from './entity/crawl-job.entity.js';
import { ILike, In, Not, Repository } from 'typeorm';
import { CrawlJobStatus, PostStatus } from '../common/constants/status.enum.js';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { QUEUE_NAME } from '../common/constants/queue.constant.js';
import { Post } from '../posts/entity/post.entity.js';
import { GetCrawlJobsDto } from './dto/get-crawl-jobs.dto.js';

@Injectable()
export class CrawlJobService {
    constructor(
        @InjectRepository(CrawlJob)
        private crawlJobRepository: Repository<CrawlJob>,
        @InjectRepository(Post)
        private postRepository: Repository<Post>,
        @InjectQueue(QUEUE_NAME.CRAWL_JOB_QUEUE) private crawlJobQueue: Queue,
    ) {}

    async createCrawlJob(keyWord: string): Promise<CrawlJob> {
        const crawlJob = await this.crawlJobRepository.save({ keyWord });
        await this.crawlJobQueue.add(QUEUE_NAME.CRAWL_JOB_QUEUE, { id: crawlJob.id, keyWord: crawlJob.keyWord });
        return crawlJob;
    }

    async updateCrawlJob(id: number, { status, numPosts, numStories, numComments, numRelevant }: { status?: CrawlJobStatus; numPosts?: number; numStories?: number; numComments?: number; numRelevant?: number }): Promise<CrawlJob> {
        return this.crawlJobRepository.findOneBy({ id }).then((crawlJob) => {
            if (!crawlJob) {
                throw new Error(`CrawlJob with id ${id} not found`);
            }

            if (status) {
                crawlJob.status = status;
            }

            if (numPosts) {
                crawlJob.numPosts = numPosts;
            }

            if (numStories) {
                crawlJob.numStories = numStories;
            }

            if (numComments) {
                crawlJob.numComments = numComments;
            }

            if (numRelevant) {
                crawlJob.numRelevant = numRelevant;
            }

            return this.crawlJobRepository.save(crawlJob);
        });
    }

    async incrementNum(key: string, id: number, by = 1) {
        const result = await this.crawlJobRepository.increment({ id }, key, by);

        if (!result.affected) {
            throw new Error(`CrawlJob with id ${id} not found`);
        }
    }

    async finishIfDone(jobId: number) {
        const remaining = await this.postRepository.count({
            where: {
                jobId,
                status: Not(In([PostStatus.COMPLETED, PostStatus.FAILED])),
            },
        });
        if (remaining > 0) return;

        await this.crawlJobRepository
            .createQueryBuilder()
            .update(CrawlJob)
            .set({ status: CrawlJobStatus.COMPLETED })
            .where('id = :jobId', { jobId })
            .andWhere('status NOT IN (:...done)', {
                done: [CrawlJobStatus.COMPLETED, CrawlJobStatus.FAILED],
            })
            .execute();
    }

    async getCrawlJobs({ page, pageSize, keyWord, status }: GetCrawlJobsDto) {
        const [items, total] = await this.crawlJobRepository.findAndCount({
            where: {
                ...(keyWord && { keyWord: ILike(`%${keyWord}%`) }),
                ...(status && { status }),
            },
            order: { createdAt: 'DESC', id: 'DESC' },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });

        return {
            items,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        };
    }

    async getCrawlJob(id: number) {
        return this.crawlJobRepository.findOneBy({
            id,
        });
    }
}
