import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { Post } from '../../posts/entity/post.entity.js';

@Entity('PostParts')
export class PostPart {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    postId: string;

    @Column({ type: 'text' })
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ type: 'boolean', nullable: true, default: false })
    isRelevant: boolean | null;

    @ManyToOne('Post', 'PostParts', {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'postId', referencedColumnName: 'id' })
    post: Post;
}
