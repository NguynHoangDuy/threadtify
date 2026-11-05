import { postStatusStyles, type Post, type PostDetail } from '@/constants/post';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { parseJson } from '@/utils';
import { Badge } from '../ui/badge';
import { useEffect, useState } from 'react';
import { callAPI } from '@/utils/apiCaller';
import axios from 'axios';
import { BookOpen, ExternalLink, MessageCircle } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';

export const PostDialog = ({ selectedPost, handleClose, open }: { selectedPost: Post | null; handleClose: () => void; open: boolean }) => {
     const user = parseJson<{ username?: string; profileUrl?: string }>(selectedPost?.author) ?? {};

     const [detail, setDetail] = useState<PostDetail | null>(null);
     const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(false);

     useEffect(() => {
          if (!open || !selectedPost) return;

          const controller = new AbortController();

          const fetchDetail = async () => {
               setIsLoadingDetail(true);
               setDetail(null);
               try {
                    const data = await callAPI('GET', `/api/post-parts?postId=${selectedPost.id}`, undefined, { signal: controller.signal });
                    setDetail(data);
               } catch (error) {
                    if (axios.isCancel(error)) return;
                    console.error('Fetch detail failed:', error);
               } finally {
                    if (!controller.signal.aborted) setIsLoadingDetail(false);
               }
          };

          fetchDetail();

          return () => controller.abort();
     }, [open, selectedPost?.id]);

     return (
          <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
               <DialogContent className='duration-100 flex max-h-[85vh] !w-[60vw] !max-w-[60rem] flex-col gap-0 p-0'>
                    <DialogHeader className='border-b p-5 pr-12'>
                         <div className='flex items-center gap-3'>
                              <DialogTitle className='flex-1 text-base mb-0'>@{user.username ?? 'Unknown User'}</DialogTitle>
                              <Badge variant='outline' className={`rounded-md px-2 py-1 text-[11px] font-medium tracking-wide border ${(selectedPost?.status && postStatusStyles[selectedPost?.status]) ?? ''}`}>
                                   {selectedPost?.status}
                              </Badge>
                         </div>
                         <DialogDescription className='sr-only'>Post details and related comments</DialogDescription>
                    </DialogHeader>

                    <div className='flex-1 overflow-y-auto p-6'>
                         <p className='whitespace-pre-line text-sm leading-relaxed'>{selectedPost?.content}</p>

                         <div className='mt-6 border-t pt-4'>
                              {isLoadingDetail ? (
                                   <div className='space-y-3'>
                                        <Skeleton className='h-4 w-32' />
                                        <Skeleton className='h-16 w-full' />
                                        <Skeleton className='h-16 w-full' />
                                   </div>
                              ) : (
                                   <>
                                        <div className='mb-3 flex items-center gap-2 text-sm font-medium'>
                                             <MessageCircle className='h-4 w-4' />
                                             Related comments ({detail?.comments.length ?? 0})
                                        </div>

                                        {!detail || detail.comments.length === 0 ? (
                                             <p className='py-6 text-center text-sm text-muted-foreground'>No related comments</p>
                                        ) : (
                                             <ul className='space-y-3'>
                                                  {detail.comments.map((c, i) => (
                                                       <li key={i} className='rounded-lg bg-muted/50 px-3 py-2 text-sm text-muted-foreground whitespace-pre-line'>
                                                            {c.content}
                                                       </li>
                                                  ))}
                                             </ul>
                                        )}
                                   </>
                              )}
                         </div>
                    </div>

                    <DialogFooter className='flex-row items-center justify-between gap-3 border-t p-4 sm:justify-between'>
                         <div className='flex items-center gap-3'>
                              <div className='flex flex-col leading-tight'>
                                   {isLoadingDetail ? (
                                        <Skeleton className='mt-1 h-4 w-16' />
                                   ) : detail?.story ? (
                                        <span className='text-sm font-semibold'>
                                             <Badge variant='outline' className='border-primary/40 text-primary'>
                                                  Score: {detail.story.score}
                                             </Badge>
                                        </span>
                                   ) : (
                                        <span className='text-sm text-muted-foreground'>No story yet</span>
                                   )}
                              </div>
                         </div>

                         <div className='flex items-center gap-2'>
                              <Button size='sm' className='cursor-pointer' disabled={!detail?.story?.id} onClick={() => detail?.story && window.open(`/story/${detail.story.id}`, '_blank')}>
                                   <BookOpen className='h-4 w-4' />
                                   View story
                              </Button>

                              {selectedPost?.postUrl && (
                                   <Button size='sm' variant='outline' className='cursor-pointer flex items-center gap-1' onClick={() => window.open(selectedPost.postUrl, '_blank')}>
                                        <ExternalLink className='h-4 w-4' />
                                        Open on Threads
                                   </Button>
                              )}
                         </div>
                    </DialogFooter>
               </DialogContent>
          </Dialog>
     );
};
