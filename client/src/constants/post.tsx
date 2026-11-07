export type Post = {
     id: string;
     threadId: string;
     jobId: number;
     author: string;
     content: string;
     imageUrl: string;
     createdAt: Date;
     updatedAt: Date;
     status: string;
     postUrl: string;
     numRelatedComment: number;
     error: string;
};

export const PostStatus = {
     PENDING: 'PENDING',
     CRAWL_COMMENT: 'CRAWL_COMMENT',
     FAILED_CRAWL_COMMENT: 'FAILED_CRAWL_COMMENT',
     DONE_CRAWL_COMMENT: 'DONE_CRAWL_COMMENT',
     FILTER_COMMENT: 'FILTER_COMMENT',
     DONE_FILTER_COMMENT: 'DONE_FILTER_COMMENT',
     FAILED_FILTER_COMMENT: 'FAILED_FILTER_COMMENT',
     MERGE_STORY: 'MERGE_STORY',
     FAILED_MERGE_STORY: 'FAILED_MERGE_STORY',
     COMPLETED: 'COMPLETED',
     FAILED: 'FAILED',
};

const color = {
     idle: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
     running: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
     done: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
     success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
     failed: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export const PostStatusStyle: Record<string, { label: string; className: string; isRunning?: boolean }> = {
     [PostStatus.PENDING]: { label: 'PENDING', className: color.idle },

     [PostStatus.CRAWL_COMMENT]: { label: 'CRAWLING COMMENTS', className: color.running, isRunning: true },
     [PostStatus.FILTER_COMMENT]: { label: 'FILTERING', className: color.running, isRunning: true },
     [PostStatus.MERGE_STORY]: { label: 'MERGING STORY', className: color.running, isRunning: true },

     [PostStatus.DONE_CRAWL_COMMENT]: { label: 'COMMENTS DONE', className: color.done },
     [PostStatus.DONE_FILTER_COMMENT]: { label: 'FILTER DONE', className: color.done },

     [PostStatus.FAILED_CRAWL_COMMENT]: { label: 'CRAWL FAILED', className: color.failed },
     [PostStatus.FAILED_FILTER_COMMENT]: { label: 'FILTER FAILED', className: color.failed },
     [PostStatus.FAILED_MERGE_STORY]: { label: 'MERGE FAILED', className: color.failed },
     [PostStatus.FAILED]: { label: 'FAILED', className: color.failed },

     [PostStatus.COMPLETED]: { label: 'COMPLETED', className: color.success },
};

export type PostDetail = {
     story: { id: string; score: number } | null;
     comments: { content: string }[];
};

export const STEPS = [
     { label: 'Crawl Comments', running: PostStatus.CRAWL_COMMENT, done: PostStatus.DONE_CRAWL_COMMENT, failed: PostStatus.FAILED_CRAWL_COMMENT },
     { label: 'Filter Comments', running: PostStatus.FILTER_COMMENT, done: PostStatus.DONE_FILTER_COMMENT, failed: PostStatus.FAILED_FILTER_COMMENT },
     { label: 'Build story', running: PostStatus.MERGE_STORY, done: PostStatus.COMPLETED, failed: PostStatus.FAILED_MERGE_STORY },
];

export const STATUS_ORDER = [
     PostStatus.PENDING,
     PostStatus.CRAWL_COMMENT,
     PostStatus.DONE_CRAWL_COMMENT,
     PostStatus.FAILED_CRAWL_COMMENT,
     PostStatus.FILTER_COMMENT,
     PostStatus.FAILED_FILTER_COMMENT,
     PostStatus.DONE_FILTER_COMMENT,
     PostStatus.MERGE_STORY,
     PostStatus.FAILED_MERGE_STORY,
     PostStatus.COMPLETED,
];

export type StepState = 'done' | 'running' | 'failed' | 'waiting';

export const StepStyle: Record<StepState, { circle: string; title: string }> = {
     done: { circle: 'bg-green-950 text-green-400', title: 'text-white' },
     running: { circle: 'bg-amber-950 text-amber-400 animate-pulse', title: 'text-amber-400' },
     failed: { circle: 'bg-red-950 text-red-400', title: 'text-red-400' },
     waiting: { circle: 'bg-zinc-900 text-zinc-500', title: 'text-zinc-500' },
};
