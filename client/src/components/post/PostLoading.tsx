import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function PostCardSkeleton() {
     return (
          <Card className='flex flex-col overflow-hidden h-[250px]'>
               <CardHeader className='flex flex-row items-center justify-between pr-16'>
                    <Skeleton className='h-4 w-24' />
                    <Skeleton className='h-6 w-20 rounded-md' />
               </CardHeader>

               <CardContent className='flex-1 mt-4 space-y-2'>
                    <Skeleton className='h-4 w-full' />
                    <Skeleton className='h-4 w-full' />
                    <Skeleton className='h-4 w-5/6' />
                    <Skeleton className='h-4 w-4/6' />
               </CardContent>
          </Card>
     );
}
