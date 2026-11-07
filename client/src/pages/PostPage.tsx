import { Pagination } from '@/components/layout/Pagination';
import { PostDialog } from '@/components/post/PostDialog';
import { PostCardSkeleton } from '@/components/post/PostLoading';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PostStatusStyle, type Post } from '@/constants/post';
import { parseJson } from '@/utils';
import { callAPI } from '@/utils/apiCaller';
import { Quote } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

export const PostPage = () => {
     const { id } = useParams<{ id: string }>();

     const jobId = id ? Number(id) : undefined;
     const [posts, setPosts] = useState<Post[]>([]);
     const [isLoading, setIsLoading] = useState<boolean>(true);
     const [page, setPage] = useState<number>(1);
     const [pageSize, setPageSize] = useState<number>(9);
     const [totalPage, setTotalPage] = useState<number>(1);
     const [selectedPost, setSelectedPost] = useState<Post | null>(null);
     const [open, setOpen] = useState(false);

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
               const response = await callAPI('GET', `/api/posts?page=${page}&pageSize=${pageSize}${jobId ? `&jobId=${jobId}` : ''}`);
               const data = await response;

               setPosts(data.items);
               setTotalPage(data.total);
               setIsLoading(false);
          };
          fetchPosts();
     }, [id, page, pageSize]);

     return (
          <div>
               <h2 className='text-4xl font-bold'>Post Crawled {id && <span className='text-sm font-normal text-gray-400 mt-2'># {jobId}</span>}</h2>

               <div className='grid grid-cols-3 gap-6 mt-10'>
                    {isLoading ? (
                         Array.from({ length: pageSize }).map((_, i) => <PostCardSkeleton key={i} />)
                    ) : posts.length === 0 ? (
                         <p className='col-span-full py-12 text-center text-sm text-muted-foreground'>No data available</p>
                    ) : (
                         posts.map((post) => {
                              const user = parseJson<{ username?: string; profileUrl?: string }>(post.author) ?? {};
                              return (
                                   <Card
                                        className='group relative flex flex-col overflow-hidden h-full cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 min-h-[250px] max-h-[250px]'
                                        key={post.id}
                                        onClick={() => handleOpen(post)}
                                   >
                                        <Quote className='absolute top-2 right-4 h-12 w-12 text-muted-foreground/10 fill-current' />

                                        <CardHeader className='flex flex-row items-center justify-between pr-16'>
                                             <div className='text-sm font-medium text-muted-foreground'>@{user.username ?? 'Unknown User'}</div>
                                             <Badge variant='outline' className={`shrink-0 text-[10px] ${PostStatusStyle[post.status].className}`}>
                                                  {PostStatusStyle[post.status].label}
                                             </Badge>
                                        </CardHeader>

                                        <CardContent className='flex-1 text-sm text-muted-foreground mt-4'>
                                             <p className='line-clamp-6'>{post.content}</p>
                                        </CardContent>
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
