import { useEffect, useRef, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '../ui/button';
import { ExternalLink } from 'lucide-react';
import { statusStyles } from '@/constants/crawl-job';
import { formatDateTime } from '@/utils';
import { CrawlJobsTableSkeleton } from './CrawlJobsTableSkeleton';
import { Pagination } from '../layout/Pagination';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCrawlJobs, type CrawlJob } from '@/store/crawlJobsSlice';

export function CrawlJobsTable() {
     const [page, setPage] = useState(1);
     const [pageSize, setPageSize] = useState(10);

     const dispatch = useAppDispatch();
     const { items: jobs, isLoading, total } = useAppSelector((state) => state.crawlJobs);

     useEffect(() => {
          if (jobs.length === 0) {
               dispatch(fetchCrawlJobs({ page, pageSize }));
          }
     }, []);

     if (isLoading) return <CrawlJobsTableSkeleton />;

     const handlePageSizeChange = (size: number) => {
          setPageSize(size);
          setPage(1);
          dispatch(fetchCrawlJobs({ page: 1, pageSize }));
     };

     const handlePageChange = (p: number) => {
          setPage(1);
          dispatch(fetchCrawlJobs({ page: p, pageSize }));
     };

     return (
          <div className='w-full overflow-x-auto'>
               <Table className='border-separate border-spacing-y-4 mt-10'>
                    <TableHeader>
                         <TableRow className='h-9 border-b border-[#25262b] hover:bg-transparent'>
                              <TableHead className='w-[25%] px-4 text-xs font-normal text-gray-400'>Job</TableHead>

                              <TableHead className='w-[9%] text-xs font-normal text-gray-400'>Post</TableHead>

                              <TableHead className='w-[9%] text-xs font-normal text-gray-400'>Stories</TableHead>

                              <TableHead className='w-[10%] text-xs font-normal text-gray-400'>Status</TableHead>

                              <TableHead className='px-4 text-xs font-normal text-gray-400'>Created</TableHead>
                              <TableHead className='px-4 text-xs font-normal text-gray-400'>Updated</TableHead>
                         </TableRow>
                    </TableHeader>
                    <TableBody>
                         {jobs.map((job: CrawlJob) => (
                              <TableRow
                                   key={job.id}
                                   className='transition-colors
                                   hover:bg-muted/50
                                   data-[state=selected]:bg-muted
                                   [&>td]:border-y
                                   [&>td]:border-border
                                   [&>td:first-child]:border-l
                                   [&>td:last-child]:border-r
                                   [&>td:first-child]:rounded-l-lg
                                   [&>td:last-child]:rounded-r-lg
                                   [&>td:first-child]:border-l-4
                                   [&>td:first-child]:border-l-green-500
                              '
                              >
                                   <TableCell className='px-2 py-4'>
                                        <p className='font-medium text-light'>{job.keyWord}</p>
                                        <p className='text-xs font-normal text-gray-400 mt-2'>#{job.id}</p>
                                   </TableCell>
                                   <TableCell className='px-2 py-4'>{job.numPosts}</TableCell>
                                   <TableCell className='px-2 py-4'>{job.numStories}</TableCell>
                                   <TableCell className='px-2 py-4'>
                                        <Badge variant='outline' className={`rounded-md px-2 py-1 text-[11px] font-medium tracking-wide border ${statusStyles[job.status] ?? ''} `}>
                                             {job.status}
                                        </Badge>
                                   </TableCell>
                                   <TableCell className='px-2 py-4'>{formatDateTime(job.createdAt)}</TableCell>
                                   <TableCell className='px-2 py-4'>{formatDateTime(job.updatedAt)}</TableCell>
                                   <TableCell className='px-2 py-4'>
                                        <Button variant='outline' size='sm' className='cursor-pointer'>
                                             <ExternalLink className='h-4 w-4' />
                                        </Button>
                                   </TableCell>
                              </TableRow>
                         ))}
                    </TableBody>
               </Table>
               {total > 0 && <Pagination page={page} pageSize={pageSize} total={total} onPageChange={handlePageChange} onPageSizeChange={handlePageSizeChange} />}
          </div>
     );
}
