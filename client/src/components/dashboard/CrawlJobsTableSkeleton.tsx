import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function CrawlJobsTableSkeleton({ rows = 5 }: { rows?: number }) {
     return (
          <Table className='border-separate border-spacing-y-4 mt-10'>
               <TableHeader>
                    <TableRow className='h-9 border-b border-[#25262b] hover:bg-transparent'>
                         <TableHead className='w-[25%] px-4 text-xs font-normal text-gray-400'>Job</TableHead>
                         <TableHead className='w-[9%] text-xs font-normal text-gray-400'>Post</TableHead>
                         <TableHead className='w-[9%] text-xs font-normal text-gray-400'>Stories</TableHead>
                         <TableHead className='w-[10%] text-xs font-normal text-gray-400'>Status</TableHead>
                         <TableHead className='px-4 text-xs font-normal text-gray-400'>Created</TableHead>
                         <TableHead className='px-4 text-xs font-normal text-gray-400'>Updated</TableHead>
                         <TableHead />
                    </TableRow>
               </TableHeader>
               <TableBody>
                    {Array.from({ length: rows }).map((_, i) => (
                         <TableRow
                              key={i}
                              className='hover:bg-transparent
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
                                   <Skeleton className='h-4 w-32' />
                                   <Skeleton className='mt-2 h-3 w-10' />
                              </TableCell>
                              <TableCell className='px-2 py-4'>
                                   <Skeleton className='h-4 w-8' />
                              </TableCell>
                              <TableCell className='px-2 py-4'>
                                   <Skeleton className='h-4 w-8' />
                              </TableCell>
                              <TableCell className='px-2 py-4'>
                                   <Skeleton className='h-6 w-20 rounded-md' />
                              </TableCell>
                              <TableCell className='px-2 py-4'>
                                   <Skeleton className='h-4 w-32' />
                              </TableCell>
                              <TableCell className='px-2 py-4'>
                                   <Skeleton className='h-4 w-32' />
                              </TableCell>
                              <TableCell className='px-2 py-4'>
                                   <Skeleton className='h-8 w-9 rounded-md' />
                              </TableCell>
                         </TableRow>
                    ))}
               </TableBody>
          </Table>
     );
}
