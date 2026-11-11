import { useEffect } from 'react';

import { CrawlJobsListSkeleton } from './CrawlJobRowSkeleton';
import { CrawlJobRow } from './CrawlJobRow';
import { Pagination } from '../layout/Pagination';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCrawlJobs, setPage, setPageSize } from '@/store/crawlJobsSlice';

export function CrawlJobsTable() {
     const dispatch = useAppDispatch();
     const { items: jobs, isLoading, total, page, pageSize } = useAppSelector((state) => state.crawlJobs);

     useEffect(() => {
          if (jobs.length === 0) {
               dispatch(fetchCrawlJobs({ page, pageSize }));
          }
     }, []);

     const handlePageSizeChange = (size: number) => {
          dispatch(setPageSize(size));
          dispatch(setPage(1));
          dispatch(fetchCrawlJobs({ page: 1, pageSize: size }));
     };

     const handlePageChange = (p: number) => {
          dispatch(setPage(p));
          dispatch(fetchCrawlJobs({ page: p, pageSize }));
     };

     return (
          <div className='w-full overflow-x-auto'>
               <h4 className='mt-10 text-2xl font-bold mb-5'>Recent Jobs</h4>

               {isLoading ? (
                    <CrawlJobsListSkeleton />
               ) : (
                    <div className='mt-10 flex flex-col gap-4'>
                         {jobs.map((job) => (
                              <CrawlJobRow key={job.id} job={job} />
                         ))}
                    </div>
               )}

               {total > 0 && <Pagination page={page} pageSize={pageSize} total={total} onPageChange={handlePageChange} onPageSizeChange={handlePageSizeChange} />}
          </div>
     );
}
