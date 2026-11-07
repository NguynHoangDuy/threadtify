export const CrawlJobStatus = {
     PENDING: 'PENDING',
     RUNNING: 'RUNNING',
     PAUSED: 'PAUSED',
     CRAWL_POST: 'CRAWL_POST',
     DONE_CRAWL_POST: 'DONE_CRAWL_POST',
     CRAWL_COMMENT: 'CRAWL_COMMENT',
     DONE_CRAWL_COMMENT: 'DONE_CRAWL_COMMENT',
     FILTER_COMMENT: 'FILTER_COMMENT',
     DONE_FILTER_COMMENT: 'DONE_FILTER_COMMENT',
     MERGE_STORY: 'MERGE_STORY',
     FAILED_MERGE_STORY: 'FAILED_MERGE_STORY',
     COMPLETED: 'COMPLETED',
     FAILED: 'FAILED',
};

export const CrawlJobStatusStyle: Record<string, { label: string; className: string }> = {
     [CrawlJobStatus.PENDING]: { label: 'PENDING', className: 'bg-zinc-800 text-zinc-300' },
     [CrawlJobStatus.PAUSED]: { label: 'PAUSED', className: 'bg-zinc-800 text-zinc-300' },
     [CrawlJobStatus.RUNNING]: { label: 'RUNNING', className: 'bg-amber-950 text-amber-400' },
     [CrawlJobStatus.CRAWL_POST]: { label: 'CRAWLING POSTS', className: 'bg-amber-950 text-amber-400' },
     [CrawlJobStatus.DONE_CRAWL_POST]: { label: 'POSTS DONE', className: 'bg-amber-950 text-amber-400' },
     [CrawlJobStatus.CRAWL_COMMENT]: { label: 'CRAWLING COMMENTS', className: 'bg-amber-950 text-amber-400' },
     [CrawlJobStatus.DONE_CRAWL_COMMENT]: { label: 'COMMENTS DONE', className: 'bg-amber-950 text-amber-400' },
     [CrawlJobStatus.FILTER_COMMENT]: { label: 'FILTERING', className: 'bg-amber-950 text-amber-400' },
     [CrawlJobStatus.DONE_FILTER_COMMENT]: { label: 'FILTER DONE', className: 'bg-amber-950 text-amber-400' },
     [CrawlJobStatus.MERGE_STORY]: { label: 'MERGING STORIES', className: 'bg-amber-950 text-amber-400' },
     [CrawlJobStatus.FAILED_MERGE_STORY]: { label: 'MERGE FAILED', className: 'bg-red-950 text-red-400' },
     [CrawlJobStatus.COMPLETED]: { label: 'COMPLETED', className: 'bg-green-950 text-green-400' },
     [CrawlJobStatus.FAILED]: { label: 'FAILED', className: 'bg-red-950 text-red-400' },
};

export type StepState = 'done' | 'running' | 'failed' | 'waiting';

export const STEPS = [
     { label: 'Crawl Post', running: CrawlJobStatus.CRAWL_POST, done: CrawlJobStatus.DONE_CRAWL_POST },
     { label: 'Crawl Comments', running: CrawlJobStatus.CRAWL_COMMENT, done: CrawlJobStatus.DONE_CRAWL_COMMENT },
     { label: 'Filter Comments', running: CrawlJobStatus.FILTER_COMMENT, done: CrawlJobStatus.DONE_FILTER_COMMENT },
     { label: 'Build story', running: CrawlJobStatus.MERGE_STORY, done: CrawlJobStatus.COMPLETED, failed: CrawlJobStatus.FAILED_MERGE_STORY },
];

export const STATUS_ORDER = [
     CrawlJobStatus.PENDING,
     CrawlJobStatus.RUNNING,
     CrawlJobStatus.CRAWL_POST,
     CrawlJobStatus.DONE_CRAWL_POST,
     CrawlJobStatus.CRAWL_COMMENT,
     CrawlJobStatus.DONE_CRAWL_COMMENT,
     CrawlJobStatus.FILTER_COMMENT,
     CrawlJobStatus.DONE_FILTER_COMMENT,
     CrawlJobStatus.MERGE_STORY,
     CrawlJobStatus.COMPLETED,
];

export const StepStyle: Record<StepState, { circle: string; title: string }> = {
     done: { circle: 'bg-green-950 text-green-400', title: 'text-white' },
     running: { circle: 'bg-amber-950 text-amber-400 animate-pulse', title: 'text-amber-400' },
     failed: { circle: 'bg-red-950 text-red-400', title: 'text-red-400' },
     waiting: { circle: 'bg-zinc-900 text-zinc-500', title: 'text-zinc-500' },
};
