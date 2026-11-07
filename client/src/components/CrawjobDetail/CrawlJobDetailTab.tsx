import type { CrawlJob } from '@/store/crawlJobsSlice';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Fragment } from 'react/jsx-runtime';
import { PostTab } from './PostTab';

export const CrawlJobDetailTab = ({ job }: { job: CrawlJob }) => {
     const tabList = [
          { value: 'posts', label: `Posts (${job.numPosts})` },
          { value: 'stories', label: `Stories (${job.numStories})` },
     ];
     return (
          <Tabs defaultValue='posts' className='mt-10 w-full'>
               <TabsList className='h-auto w-full justify-start gap-6 rounded-none border-b bg-transparent p-0 gap-0'>
                    {tabList.map((tab, index) => (
                         <Fragment key={tab.value}>
                              {index !== 0 && <span className='h-4 w-px bg-zinc-600' />}
                              <TabsTrigger value={tab.value} className='max-w-[150px] cursor-pointer rounded-none'>
                                   {tab.label}
                              </TabsTrigger>
                         </Fragment>
                    ))}
               </TabsList>
               <TabsContent value='posts' className='mt-6'>
                    <PostTab job={job} />
               </TabsContent>

               <TabsContent value='stories' className='mt-6'>
                    ...
               </TabsContent>
          </Tabs>
     );
};
