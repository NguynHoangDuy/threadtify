import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { LLMStatus, LLMType } from '../../common/constants/status.enum.js';

@Entity('LLMRun')
export class LLMRun {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    type: LLMType;

    @Column({ type: 'text' })
    prompt: string;

    @Column({ type: 'text', nullable: true })
    result: string | null;

    @Column({ type: 'text', nullable: true })
    error: string | null;

    @Column({ default: LLMStatus.PENDING })
    status: LLMStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
