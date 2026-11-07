import { PostStatus, PostStatusStyle, STATUS_ORDER, STEPS, StepStyle, type Post, type PostDetail } from '@/constants/post';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { parseJson } from '@/utils';
import { Badge } from '../ui/badge';
import { Fragment, useEffect, useState } from 'react';
import { callAPI } from '@/utils/apiCaller';
import axios from 'axios';
import { BookOpen, ExternalLink, Loader2, MessageCircle, RefreshCw, Route } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import type { StepState } from '@/constants/crawl-job';
import { Connector } from '../layout/utils';

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

     const status = PostStatusStyle[selectedPost?.status || PostStatus.PENDING];

     function getStepState(step: (typeof STEPS)[number], status: string): StepState {
          if (step.failed && status === step.failed) return 'failed';

          const effective = status === PostStatus.FAILED_MERGE_STORY ? PostStatus.MERGE_STORY : status;

          const current = STATUS_ORDER.indexOf(effective);
          if (current >= STATUS_ORDER.indexOf(step.done)) return 'done';
          if (effective === step.running) return 'running';
          return 'waiting';
     }

     const isFailed = [PostStatus.FAILED_MERGE_STORY, PostStatus.FAILED_FILTER_COMMENT, PostStatus.FAILED_CRAWL_COMMENT].includes(selectedPost ? selectedPost?.status : '');

     return (
          <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
               <DialogContent className='duration-100 flex max-h-[85vh] !w-[60vw] !max-w-[60rem] flex-col gap-0 p-0'>
                    <DialogHeader className='border-b p-5 pr-12'>
                         <div className='flex items-center gap-3'>
                              <DialogTitle className='flex-1 text-base mb-0'>@{user.username ?? 'Unknown User'}</DialogTitle>
                              <Badge variant='outline' className={`rounded-md px-2 py-1 text-[11px] font-medium tracking-wide border ${status.className}`}>
                                   {status.label}
                              </Badge>
                         </div>
                         <DialogDescription className='sr-only'>Post details and related comments</DialogDescription>
                    </DialogHeader>

                    <div className='flex-1 overflow-y-auto'>
                         <div className='p-6'>
                              <p className='whitespace-pre-line text-sm leading-relaxed'>{selectedPost?.content}</p>
                         </div>
                         <div className='border-t'>
                              <div className='p-6'>
                                   <div className='flex items-center gap-4 mb-6'>
                                        <Route size={16} />
                                        <p className='text-sm text-[14px] font-bold'>Pipeline</p>
                                   </div>
                                   <div className='w-full flex items-center'>
                                        {STEPS.map((step, i) => {
                                             const state = getStepState(step, selectedPost?.status || PostStatus.PENDING);
                                             const style = StepStyle[state];
                                             return (
                                                  <Fragment key={step.label}>
                                                       <div className='flex items-center gap-3 shrink-0'>
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors duration-500 ${style.circle}`}>
                                                                 {state === 'done' ? (
                                                                      <span key='done' className='animate-pop'>
                                                                           ✓
                                                                      </span>
                                                                 ) : state === 'running' ? (
                                                                      <Loader2 className='h-5 w-5 animate-spin' />
                                                                 ) : (
                                                                      i + 1
                                                                 )}
                                                            </div>
                                                            <div>
                                                                 <div className={`font-semibold transition-colors duration-500 ${style.title}`}>{step.label}</div>
                                                            </div>
                                                       </div>

                                                       {i < STEPS.length - 1 && <Connector state={state} />}
                                                  </Fragment>
                                             );
                                        })}
                                   </div>
                                   {isFailed && (
                                        <div className='mt-6 flex items-center justify-between gap-3 rounded-lg border border-red-900 bg-red-950/50 px-3 py-2.5'>
                                             <p className='min-w-0 flex-1 break-words text-xs text-red-300'>{selectedPost?.error ?? 'Something went wrong'}</p>
                                             <Button
                                                  variant='outline'
                                                  size='sm'
                                                  // onClick={() => handleRetry(selectedPost.id)}
                                                  className='h-7 shrink-0 gap-1.5 border-red-800 bg-transparent px-2.5 text-xs text-red-200 hover:bg-red-900/40 hover:text-red-100 cursor-pointer'
                                             >
                                                  <RefreshCw className='h-3.5 w-3.5' />
                                                  Retry
                                             </Button>
                                        </div>
                                   )}{' '}
                              </div>
                         </div>
                         <div className='border-t'>
                              <div className='p-6'>
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
