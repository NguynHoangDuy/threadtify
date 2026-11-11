import { PostStatusStyle, type Post } from '@/constants/post';
import type { CrawlJob } from '@/store/crawlJobsSlice';
import { callAPI } from '@/utils/apiCaller';
import { useEffect, useState } from 'react';
import { Pagination } from '../layout/Pagination';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Loader2, MessageCircle, Quote } from 'lucide-react';
import { parseJson } from '@/utils';
import { PostCardSkeleton } from '../post/PostLoading';
import { Badge } from '../ui/badge';
import { PostDialog } from '../post/PostDialog';
import { useAppSelector } from '@/store/hooks';

export const PostTab = ({ job }: { job: CrawlJob }) => {
     const [isLoading, setIsLoading] = useState(false);
     const [page, setPage] = useState(1);
     const [pageSize, setPageSize] = useState(9);
     const [posts, setPosts] = useState<Post[]>([]);
     const [totalPage, setTotalPage] = useState(1);
     const [selectedPost, setSelectedPost] = useState<Post | null>(null);
     const [open, setOpen] = useState(false);

     const { pusher } = useAppSelector((state) => state.posts);

     const handleOpen = (post: Post) => {
          setSelectedPost(post);
          setOpen(true);
     };

     const handleClose = () => {
          setOpen(false);
     };

     useEffect(() => {
          const fetchPosts = async () => {
               setIsLoading(true);
               const response = await callAPI('GET', `/api/posts?page=${page}&pageSize=${pageSize}${`&jobId=${job.id}`}`);
               const data = await response;

               setPosts(data.items);
               setTotalPage(data.total);
               setIsLoading(false);
          };
          fetchPosts();
     }, [job.id, page, pageSize]);

     useEffect(() => {
          setPosts((prev) => {
               const index = prev.findIndex((item) => item.id === pusher.id);
               if (index === -1) return prev;

               const next = [...prev];
               next[index] = { ...prev[index], ...pusher.data };
               return next;
          });
          setSelectedPost((prev) => (prev && prev.id === pusher.id ? { ...prev, ...pusher.data } : prev));
     }, [pusher.id, pusher.data]);

     return (
          <div>
               <div className='grid grid-cols-3 gap-6'>
                    {isLoading ? (
                         Array.from({ length: pageSize }).map((_, i) => <PostCardSkeleton key={i} />)
                    ) : posts.length === 0 ? (
                         <p className='col-span-full py-12 text-center text-sm text-muted-foreground'>No data available</p>
                    ) : (
                         posts.map((post) => {
                              const user = parseJson<{ username?: string; profileUrl?: string }>(post.author) ?? {};
                              const status = PostStatusStyle[post.status];

                              return (
                                   <Card
                                        className='group relative flex flex-col overflow-hidden h-full cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 min-h-[250px] max-h-[250px]'
                                        key={post.id}
                                        onClick={() => handleOpen(post)}
                                   >
                                        <Quote className='absolute top-2 right-4 h-12 w-12 text-muted-foreground/10 fill-current' />

                                        <CardHeader className='flex flex-row items-center justify-between pr-16'>
                                             <div className='text-sm font-medium '>@{user.username ?? 'Unknown User'}</div>
                                             <Badge variant='outline' className={`shrink-0 text-[10px] ${status.className}`}>
                                                  {status.isRunning && <Loader2 className='h-3 w-3 animate-spin' />}

                                                  {status.label}
                                             </Badge>
                                        </CardHeader>

                                        <CardContent className='flex-1 text-sm  mt-4'>
                                             <p className='line-clamp-4'>{post.content}</p>
                                        </CardContent>

                                        <CardFooter className='mt-auto flex-col items-stretch gap-2 border-t px-6 pt-3 text-xs text-muted-foreground'>
                                             {post.numComment > 0 ? (
                                                  <>
                                                       <div className='flex items-center justify-between'>
                                                            <span className='flex items-center gap-1.5'>
                                                                 <MessageCircle className='h-3.5 w-3.5' />
                                                                 {post.numComment} Comments
                                                            </span>
                                                            <span className={post.numRelatedComment > 0 ? 'font-medium text-green-400' : ''}>{post.numRelatedComment} Related</span>
                                                       </div>
                                                  </>
                                             ) : (
                                                  <span className='flex items-center gap-1.5'>
                                                       <MessageCircle className='h-3.5 w-3.5' />
                                                       No comments
                                                  </span>
                                             )}
                                        </CardFooter>
                                   </Card>
                              );
                         })
                    )}
               </div>

               <PostDialog selectedPost={selectedPost} handleClose={handleClose} open={open} />

               {totalPage > 1 && <Pagination page={page} pageSize={pageSize} total={totalPage} onPageChange={setPage} onPageSizeChange={setPageSize} pageSizeOptions={[9, 18, 27]} />}
          </div>
     );
};
