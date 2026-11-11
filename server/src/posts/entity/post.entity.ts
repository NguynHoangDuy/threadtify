import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { CrawlJob } from '../../crawl-job/entity/crawl-job.entity.js';
import { PostStatus } from '../../common/constants/status.enum.js';
import { PostPart } from '../../post-parts/entity/post-part.entity.js';
@Entity('Posts')
export class Post {
     @PrimaryGeneratedColumn('uuid')
     id: string;

     @Column()
     threadId: string;

     @Column()
     jobId: number;

     @Column({ type: 'text' })
     author: string;

     @Column({ type: 'text' })
     content: string;

     @Column({ type: 'text', nullable: true })
     imageUrl: string;

     @Column({ default: PostStatus.PENDING })
     status: PostStatus;

     @Column({ type: 'text', nullable: true })
     error: string | null;

     @Column()
     postUrl: string;

     @CreateDateColumn()
     createdAt: Date;

     @UpdateDateColumn()
     updatedAt: Date;

     @ManyToOne('CrawlJob', 'Posts', {
          onDelete: 'CASCADE',
     })
     @JoinColumn({ name: 'jobId', referencedColumnName: 'id' })
     job: CrawlJob;

     @OneToMany(() => PostPart, (postPart) => postPart.post, {
          cascade: true,
     })
     @JoinColumn({ name: 'id', referencedColumnName: 'jobId' })
     postParts: PostPart[];
}
