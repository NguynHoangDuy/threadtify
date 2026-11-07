import { CrawlJobStatus, CrawlJobStatusStyle } from '@/constants/crawl-job';
import type { CrawlJob } from '@/store/crawlJobsSlice';
import { formatDuration, getJobTimes } from '@/utils';
import { ArrowUpRight, Check, X } from 'lucide-react';
import { Link } from 'react-router';

export function CrawlJobRow({ job }: { job: CrawlJob }) {
     const { startTime, endTime, date } = getJobTimes(job.createdAt, job.updatedAt);
     const minutes = formatDuration(job.createdAt, job.updatedAt);
     const noStories = job.numStories === 0;

     const isRunning = ![CrawlJobStatus.COMPLETED, CrawlJobStatus.FAILED].includes(job.status);

     return (
          <div className='group flex flex-wrap items-center gap-x-7 gap-y-5 rounded-[20px] border border-zinc-800 bg-gradient-to-b from-[#17141a] to-[#121014] px-6 py-5 transition-all duration-200 '>
               <div className='min-w-[190px] flex-1'>
                    <div className='mt-1.5 text-[13px] text-zinc-400'>{date}</div>

                    <div className='flex flex-wrap items-center gap-2.5'>
                         <span className='text-lg font-semibold'>{job.keyWord}</span>
                         <span className='rounded-full border border-zinc-700 px-2.5 py-0.5 text-xs text-zinc-400'>#{job.id}</span>
                    </div>
                    <div className='mt-1.5 text-[13px] text-zinc-400'>
                         {startTime} → {endTime} · Duration {minutes}
                    </div>
               </div>

               <div className='flex min-w-[320px] flex-[2] items-center gap-3'>
                    <Step ok label='Crawl' sub={`${job.numPosts} posts`} />

                    {isRunning ? (
                         <div className='relative h-0.5 min-w-5 flex-1 overflow-hidden rounded bg-zinc-700'>
                              <div className='absolute inset-y-0 w-1/3 rounded bg-green-400 animate-[slide_1.2s_linear_infinite]' />
                         </div>
                    ) : (
                         <div className='h-0 min-w-5 flex-1 border-t-2 border-green-400' />
                    )}

                    <Step ok={!noStories} label='Extract' sub={`${job.numStories} stories`} />
               </div>

               <div className='flex items-center gap-3'>
                    <span className={`rounded-full px-3 py-1.5 text-xs font-semibold tracking-wider ${CrawlJobStatusStyle[job.status].className ?? CrawlJobStatusStyle.PENDING}`}>{CrawlJobStatusStyle[job.status].label}</span>
                    <Link
                         to={`/jobs/${job.id}`}
                         aria-label={`Open job ${job.id}`}
                         className='flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-700 text-zinc-300 transition hover:border-violet-500/50  hover:text-white'
                    >
                         <ArrowUpRight size={18} />
                    </Link>
               </div>
          </div>
     );
}

function Step({ ok, label, sub }: { ok: boolean; label: string; sub: string }) {
     return (
          <>
               <div className={`flex h-10 w-10 flex-none items-center justify-center rounded-full border-2 ${ok ? 'border-green-800 bg-green-950 text-green-400' : 'animate-pulse border-[#e5484d] bg-[#2a0d12] text-[#ff8a8d]'}`}>
                    {ok ? <Check size={18} /> : <X size={18} />}
               </div>
               <div className='min-w-0'>
                    <div className='text-sm font-semibold'>{label}</div>
                    <div className={`mt-0.5 text-[13px] ${ok ? 'text-zinc-400' : 'text-[#ff8a8d]'}`}>{sub}</div>
               </div>
          </>
     );
}
