import { CrawlJobDetailTab } from '@/components/CrawjobDetail/CrawlJobDetailTab';
import { Connector } from '@/components/layout/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CrawlJobStatus, CrawlJobStatusStyle, STATUS_ORDER, STEPS, StepStyle, type StepState } from '@/constants/crawl-job';
import type { CrawlJob } from '@/store/crawlJobsSlice';
import { useAppSelector } from '@/store/hooks';
import { formatDuration, getJobTimes } from '@/utils';
import { callAPI } from '@/utils/apiCaller';
import { ArrowLeft, Loader2, RefreshCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Fragment } from 'react/jsx-runtime';

export const CrawlJobDetail = () => {
     const { id } = useParams<{ id: string }>();

     const jobId = id ? Number(id) : undefined;
     const { items: jobs, pusher } = useAppSelector((state) => state.crawlJobs);
     const [job, setJob] = useState(jobs.find((job: CrawlJob) => job.id === jobId));

     const [isLoading, setIsLoading] = useState(false);

     useEffect(() => {
          if (job) return;

          const fetch = async () => {
               setIsLoading(true);
               try {
                    const response = await callAPI('GET', `/api/crawl-job/${id}`);
                    setJob(response);
               } catch (error) {
                    console.log('error', error);
               }
               setIsLoading(false);
          };

          fetch();
     }, [id]);

     useEffect(() => {
          if (!pusher.data || pusher.id !== Number(jobId)) return;

          setJob((prev) => (prev ? { ...prev, ...pusher.data } : prev));
     }, [pusher, jobId]);

     if (isLoading || !job) {
          return (
               <div className='flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground'>
                    <Loader2 className='h-4 w-4 animate-spin' />
                    Loading...
               </div>
          );
     }

     const { startTime, endTime, date } = getJobTimes(job.createdAt, job.updatedAt);
     const minutes = formatDuration(job.createdAt, job.updatedAt);

     function getStepState(step: (typeof STEPS)[number], status: string): StepState {
          if (step.failed && status === step.failed) return 'failed';

          const effective = status === CrawlJobStatus.FAILED_MERGE_STORY ? CrawlJobStatus.MERGE_STORY : status;

          const current = STATUS_ORDER.indexOf(effective);
          if (current >= STATUS_ORDER.indexOf(step.done)) return 'done';
          if (effective === step.running) return 'running';
          return 'waiting';
     }

     const stats = [
          { label: 'Posts', value: job.numPosts },
          { label: 'Comments', value: job.numComments },
          { label: 'Relevant', value: job.numRelevant },
          { label: 'Stories', value: job.numStories },
     ];

     return (
          <div>
               <Button variant='ghost' size='sm' onClick={() => window.history.back()} className='group -ml-2 gap-2 text-muted-foreground hover:bg-transparent hover:text-foreground'>
                    <ArrowLeft className='h-5 w-5 transition-transform group-hover:-translate-x-1' />
                    <span className='text-base font-semibold'>Crawl Job History</span>
               </Button>

               <div className='mt-4 ml-4'>
                    <div className='flex items-center justify-between gap-4'>
                         <div className='flex flex-col gap-1'>
                              <div className='flex gap-1 items-center'>
                                   <h2 className='mr-4 text-2xl font-bold p-0'>
                                        {job.keyWord} {id && <span className='text-sm font-normal text-gray-400 mt-2'># {jobId}</span>}
                                   </h2>
                                   <Badge variant='outline' className={`rounded-md px-2 py-1 text-[11px] font-medium tracking-wide border ${CrawlJobStatusStyle[job.status].className ?? ''} `}>
                                        {CrawlJobStatusStyle[job.status].label}
                                   </Badge>{' '}
                              </div>
                              <p className='text-sm text-muted-foreground'>Date: {date}</p>
                              <p className='text-sm text-muted-foreground'>
                                   Created: {startTime} · Updated: {endTime} · Duration: {minutes}
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
                         <CardHeader className='text-md font-bold'>Pipeline</CardHeader>

                         <CardContent>
                              <div className='w-full flex items-center'>
                                   {STEPS.map((step, i) => {
                                        const state = getStepState(step, job.status);
                                        const style = StepStyle[state];
                                        return (
                                             <Fragment key={step.label}>
                                                  <div className='flex items-center gap-3 shrink-0'>
                                                       <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors duration-500 ${style.circle}`}>
                                                            {state === 'done' ? (
                                                                 <span key='done' className='animate-pop'>
                                                                      ✓
                                                                 </span>
                                                            ) : state === 'running' ? (
                                                                 <Loader2 className='h-5 w-5 animate-spin' />
                                                            ) : (
                                                                 i + 1
                                                            )}
                                                       </div>
                                                       <div>
                                                            <div className={`font-semibold transition-colors duration-500 ${style.title}`}>{step.label}</div>
                                                       </div>
                                                  </div>

                                                  {i < STEPS.length - 1 && <Connector state={state} />}
                                             </Fragment>
                                        );
                                   })}
                              </div>
                         </CardContent>
                    </Card>
                    <div className='mt-10 grid w-full grid-cols-2 gap-4 md:grid-cols-4'>
                         {stats.map((item) => (
                              <Card key={item.label} className='px-5 py-4'>
                                   <p className='text-sm text-muted-foreground'>{item.label}</p>
                                   <p className='mt-1 text-3xl font-bold tabular-nums'>{item.value ?? 0}</p>
                              </Card>
                         ))}
                    </div>

                    <CrawlJobDetailTab job={job} />
               </div>
          </div>
     );
};
