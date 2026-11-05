import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CrawlJobStatus } from '../../common/constants/status.enum.js';
import { Post } from '../../posts/entity/post.entity.js';

@Entity('CrawlJobs')
export class CrawlJob {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    keyWord: string;

    @Column({ default: 0 })
    numPosts: number;

    @Column({ default: 0 })
    numStories: number;

    @Column({ default: 0 })
    numComments: number;

    @Column({ default: 0 })
    numRelevant: number;

    @Column({ default: CrawlJobStatus.PENDING })
    status: CrawlJobStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Post, (post) => post.job, {
        cascade: true,
    })
    posts: Post[];
}
