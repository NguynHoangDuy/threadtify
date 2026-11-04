export const statusStyles: Record<string, string> = {
     PENDING: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
     RUNNING: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
     PAUSED: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
     CRAWL_POST: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
     CRAWL_PART: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
     MERGE_STORY: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
     COMPLETED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
     FAILED: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export const CrawlJobStatus = {
     PENDING: 'PENDING',
     RUNNING: 'RUNNING',
     PAUSED: 'PAUSED',
     CRAWL_POST: 'CRAWL_POST',
     CRAWL_PART: 'CRAWL_PART',
     MERGE_STORY: 'MERGE_STORY',
     COMPLETED: 'COMPLETED',
     FAILED: 'FAILED',
};
