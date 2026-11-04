import { CrawlJobsTable } from '@/components/dashboard/CrawlJobsTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export const DashBoardPage = () => {
     return (
          <div>
               <h2 className='text-4xl font-bold'>Horror Story Crawler</h2>

               <Card className='mt-6'>
                    <CardContent className='flex items-center gap-4'>
                         <Input placeholder='Enter a horror story topic...' />
                         <Button className='w-[120px] cursor-pointer' variant='primary'>
                              Start Crawl
                         </Button>
                    </CardContent>
               </Card>

               <CrawlJobsTable />
          </div>
     );
};
