import { useState } from 'react';
import { CrawlJobsTable } from '@/components/dashboard/CrawlJobsTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { callAPI } from '@/utils/apiCaller';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCrawlJobs, setPage } from '@/store/crawlJobsSlice';

export const DashBoardPage = () => {
     const [topic, setTopic] = useState('');
     const [isSubmitting, setIsSubmitting] = useState(false);
     const dispatch = useAppDispatch();
     const { pageSize } = useAppSelector((state) => state.crawlJobs);

     const onClickCrawl = async () => {
          const keyWord = topic.trim();
          if (!keyWord || isSubmitting) return;

          try {
               setIsSubmitting(true);
               await callAPI('POST', '/api/crawl-job/create', { keyWord });
               setTopic('');

               dispatch(setPage(1));
               dispatch(fetchCrawlJobs({ page: 1, pageSize }));
          } catch (error) {
               console.error(error);
          } finally {
               setIsSubmitting(false);
          }
     };

     return (
          <div>
               <h2 className='text-4xl font-bold'>Horror Story Crawler</h2>

               <Card className='mt-6'>
                    <CardContent className='flex items-center gap-4'>
                         <Input placeholder='Enter a horror story topic...' value={topic} onChange={(e) => setTopic(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && onClickCrawl()} />
                         <Button className='w-[120px] cursor-pointer' variant='primary' onClick={onClickCrawl} disabled={!topic.trim() || isSubmitting}>
                              {isSubmitting ? 'Starting...' : 'Start Crawl'}
                         </Button>
                    </CardContent>
               </Card>

               <CrawlJobsTable />
          </div>
     );
};
