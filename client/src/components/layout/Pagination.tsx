import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
     page: number;
     pageSize: number;
     total: number;
     onPageChange: (page: number) => void;
     onPageSizeChange: (pageSize: number) => void;
     pageSizeOptions?: number[];
};

function getPageNumbers(page: number, totalPages: number): (number | '...')[] {
     if (totalPages <= 7) {
          return Array.from({ length: totalPages }, (_, i) => i + 1);
     }
     if (page <= 4) {
          return [1, 2, 3, 4, 5, '...', totalPages];
     }
     if (page >= totalPages - 3) {
          return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
     }
     return [1, '...', page - 1, page, page + 1, '...', totalPages];
}

export function Pagination({ page, pageSize, total, onPageChange, onPageSizeChange, pageSizeOptions = [10, 20, 50] }: Props) {
     const totalPages = Math.max(1, Math.ceil(total / pageSize));

     return (
          <div className='relative flex items-center w-full justify-center gap-4 mt-4'>
               <div className='flex items-center gap-1'>
                    <Button variant='outline' size='sm' className='cursor-pointer' disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
                         <ChevronLeft className='h-4 w-4' />
                    </Button>

                    {getPageNumbers(page, totalPages).map((p, i) =>
                         p === '...' ? (
                              <span key={`ellipsis-${i}`} className='px-2 text-sm text-gray-400'>
                                   ...
                              </span>
                         ) : (
                              <Button key={p} variant={p === page ? 'default' : 'outline'} size='sm' className='min-w-8 cursor-pointer' onClick={() => onPageChange(p)}>
                                   {p}
                              </Button>
                         ),
                    )}

                    <Button variant='outline' size='sm' className='cursor-pointer' disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
                         <ChevronRight className='h-4 w-4' />
                    </Button>
               </div>

               <label className='absolute right-0 flex items-center gap-2 text-xs text-gray-400'>
                    Rows per page
                    <select value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))} className='h-8 rounded-md border border-border bg-background px-2 text-sm text-foreground'>
                         {pageSizeOptions.map((size) => (
                              <option key={size} value={size}>
                                   {size}
                              </option>
                         ))}
                    </select>
               </label>
          </div>
     );
}
