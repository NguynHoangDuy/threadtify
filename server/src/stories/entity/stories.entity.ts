import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CrawlJob } from '../../crawl-job/entity/crawl-job.entity.js';
import { Post } from '../../posts/entity/post.entity.js';

@Entity('Stories')
export class Stories {
     @PrimaryGeneratedColumn('uuid')
     id: string;

     @Column()
     jobId: number;

     @Column()
     postId: string;

     @Column({ type: 'text' })
     content: string;

     @Column()
     score: number;

     @Column({ type: 'varchar', nullable: true })
     name: string | null;

     @CreateDateColumn()
     createdAt: Date;

     @UpdateDateColumn()
     updatedAt: Date;

     @ManyToOne('CrawlJob', 'Stories', {
          onDelete: 'CASCADE',
     })
     @JoinColumn({ name: 'jobId', referencedColumnName: 'id' })
     job: CrawlJob;

     @OneToOne(() => Post, { onDelete: 'CASCADE' })
     @JoinColumn({ name: 'postId', referencedColumnName: 'id' })
     post: Post;
}
