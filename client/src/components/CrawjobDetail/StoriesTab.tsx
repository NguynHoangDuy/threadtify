import { type Story } from '@/constants/stories';
import type { CrawlJob } from '@/store/crawlJobsSlice';
import { callAPI } from '@/utils/apiCaller';
import { useEffect, useState } from 'react';
import { Pagination } from '../layout/Pagination';
import { Card } from '../ui/card';
import { StoryDialog } from '../story/StoryDialog';

const RADIUS = 16;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const getScoreColor = (score: number) => {
     if (score >= 70) return 'stroke-green-500';
     if (score >= 60) return 'stroke-amber-500';
     return 'stroke-red-500';
};

const ScoreRing = ({ score }: { score: number }) => {
     const value = Math.min(100, Math.max(0, score));

     return (
          <svg width='44' height='44' viewBox='0 0 44 44' className='shrink-0'>
               <circle cx='22' cy='22' r={RADIUS} fill='none' strokeWidth='4' className='stroke-muted' />
               <circle cx='22' cy='22' r={RADIUS} fill='none' strokeWidth='4' strokeLinecap='round' strokeDasharray={`${(value / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`} transform='rotate(-90 22 22)' className={getScoreColor(value)} />
               <text x='22' y='26' textAnchor='middle' fontSize='12' fontWeight='500' className='fill-foreground'>
                    {value}
               </text>
          </svg>
     );
};

const StoryCardSkeleton = () => <div className='h-[96px] animate-pulse rounded-xl bg-muted/40' />;

export const StoriesTab = ({ job }: { job: CrawlJob }) => {
     const [stories, setStories] = useState<Story[]>([]);
     const [isLoading, setIsLoading] = useState(false);
     const [page, setPage] = useState(1);
     const [pageSize, setPageSize] = useState(10);
     const [total, setTotal] = useState(0);
     const [selectedStory, setSelectedStory] = useState<Story | null>(null);
     const [open, setOpen] = useState(false);

     const handleOpen = (story: Story) => {
          setSelectedStory(story);
          setOpen(true);
     };

     const handleClose = () => {
          setOpen(false);
     };

     const handlePageSizeChange = (size: number) => {
          setPageSize(size);
          setPage(1);
     };

     useEffect(() => {
          const fetchStories = async () => {
               try {
                    setIsLoading(true);
                    const data = await callAPI('GET', `/api/stories?page=${page}&pageSize=${pageSize}&jobId=${job.id}`);

                    setStories(data.items);
                    setTotal(data.total);
               } catch (error) {
                    console.error(error);
               } finally {
                    setIsLoading(false);
               }
          };
          fetchStories();
     }, [job.id, page, pageSize]);

     return (
          <div>
               <div className='flex flex-col gap-3'>
                    {isLoading ? (
                         Array.from({ length: Math.min(pageSize, 4) }).map((_, i) => <StoryCardSkeleton key={i} />)
                    ) : stories.length === 0 ? (
                         <p className='py-12 text-center text-sm text-muted-foreground'>No data available</p>
                    ) : (
                         stories.map((story) => {
                              const words = story.content.trim().split(/\s+/).filter(Boolean).length;

                              return (
                                   <Card key={story.id} onClick={() => handleOpen(story)} className='group cursor-pointer transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10'>
                                        <div className='flex items-center gap-4 p-4'>
                                             <ScoreRing score={story.score} />

                                             <div className='min-w-0 flex-1'>
                                                  <div className={`text-base font-medium ${story.name ? '' : 'italic text-muted-foreground'}`}>{story.name ?? `Story #${story.id}`}</div>

                                                  <p className='mt-1 line-clamp-2 text-sm text-muted-foreground'>{story.content}</p>

                                                  <div className='mt-2 flex gap-3 text-xs text-muted-foreground/70'>
                                                       <span>Job #{story.jobId}</span>
                                                       <span>{words.toLocaleString('en-US')} words</span>
                                                  </div>
                                             </div>
                                        </div>
                                   </Card>
                              );
                         })
                    )}
               </div>

               <StoryDialog selectedStory={selectedStory} handleClose={handleClose} open={open} />

               {total > pageSize && <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} onPageSizeChange={handlePageSizeChange} pageSizeOptions={[10, 20, 30]} />}
          </div>
     );
};
