export const PostStatus = {
     PENDING: 'PENDING',
     RUNNING: 'RUNNING',
     ENRICH: 'ENRICH',
     COMPLETED: 'COMPLETED',
     FAILED: 'FAILED',
};

export const postStatusStyles: Record<string, string> = {
     PENDING: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
     RUNNING: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
     ENRICH: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
     COMPLETED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
     FAILED: 'bg-red-500/10 text-red-400 border-red-500/20',
};
