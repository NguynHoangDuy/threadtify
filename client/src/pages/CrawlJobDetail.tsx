import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { statusStyles } from '@/constants/crawl-job';
import type { CrawlJob } from '@/store/crawlJobsSlice';
import { useAppSelector } from '@/store/hooks';
import { formatDateTime, formatDuration } from '@/utils';
import { ArrowLeft, RefreshCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

export const CrawlJobDetail = () => {
     const { id } = useParams<{ id: string }>();

     const jobId = id ? Number(id) : undefined;
     const { items: jobs } = useAppSelector((state) => state.crawlJobs);

     const job = jobs.find((job: CrawlJob) => job.id === jobId);

     if (!job) {
          return;
     }

     return (
          <div>
               <Button variant='link' className='flex items-center p-0'>
                    <ArrowLeft className='h-6 w-6 cursor-pointer text-gray-400' onClick={() => window.history.back()} />
                    <p className='text-xl font-bold text-gray-400'>Crawl Job History </p>
               </Button>

               {!job ? (
                    <p className='col-span-full py-12 text-center text-sm text-muted-foreground'>Crawl Job not found</p>
               ) : (
                    <div className='mt-4 ml-4'>
                         <div className='flex items-center justify-between gap-4'>
                              <div className='flex flex-col gap-1'>
                                   <div className='flex gap-1 items-center'>
                                        <h2 className='mr-4 text-2xl font-bold p-0'>
                                             {job.keyWord} {id && <span className='text-sm font-normal text-gray-400 mt-2'># {jobId}</span>}
                                        </h2>
                                        <Badge variant='outline' className={`rounded-md px-2 py-1 text-[11px] font-medium tracking-wide border ${statusStyles[job.status] ?? ''} `}>
                                             {job.status}
                                        </Badge>{' '}
                                   </div>

                                   <p className='text-sm text-muted-foreground'>
                                        Created: {formatDateTime(job.createdAt)} · Updated: {formatDateTime(job.updatedAt)} · Duration: {formatDuration(job.createdAt, job.updatedAt)}
                                   </p>
                              </div>

                              <div className='flex items-center'>
                                   <Button variant='default' className='cursor-pointer'>
                                        <RefreshCcw />
                                        <p>Retry</p>
                                   </Button>
                              </div>
                         </div>

                         <Card className='mt-10'>
                              <CardHeader className='text-sm'>Pipeline</CardHeader>
                         </Card>
                    </div>
               )}
          </div>
     );
};
