import { Skeleton } from '@/components/ui/skeleton';

export function CrawlJobRowSkeleton() {
     return (
          <div className='flex flex-wrap items-center gap-x-7 gap-y-5 rounded-[20px] border border-zinc-800 bg-gradient-to-b from-[#17141a] to-[#121014] px-6 py-5'>
               <div className='min-w-[190px] flex-1'>
                    <Skeleton className='mt-1.5 h-3.5 w-24' />
                    <div className='mt-2 flex items-center gap-2.5'>
                         <Skeleton className='h-6 w-36' />
                         <Skeleton className='h-5 w-10 rounded-full' />
                    </div>
                    <Skeleton className='mt-2 h-3.5 w-56' />
               </div>

               <div className='flex min-w-[320px] flex-[2] items-center gap-3'>
                    <StepSkeleton />
                    <Skeleton className='h-0.5 min-w-5 flex-1' />
                    <StepSkeleton />
               </div>

               <div className='flex items-center gap-3'>
                    <Skeleton className='h-7 w-24 rounded-full' />
                    <Skeleton className='h-11 w-11 rounded-xl' />
               </div>
          </div>
     );
}

function StepSkeleton() {
     return (
          <>
               <Skeleton className='h-10 w-10 flex-none rounded-full' />
               <div>
                    <Skeleton className='h-4 w-14' />
                    <Skeleton className='mt-1.5 h-3.5 w-16' />
               </div>
          </>
     );
}

export function CrawlJobsListSkeleton({ rows = 5 }: { rows?: number }) {
     return (
          <div className='mt-10 flex flex-col gap-4'>
               {Array.from({ length: rows }).map((_, i) => (
                    <CrawlJobRowSkeleton key={i} />
               ))}
          </div>
     );
}
