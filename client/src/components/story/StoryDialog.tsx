import type { Story } from '@/constants/stories';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';

type Props = {
     selectedStory: Story | null;
     open: boolean;
     handleClose: () => void;
};

const getScoreLevel = (score: number) => {
     if (score >= 70) {
          return {
               label: 'Good',
               stroke: 'stroke-green-500',
               badge: 'border-green-500/30 bg-green-500/10 text-green-400',
          };
     }
     if (score >= 60) {
          return {
               label: 'Okay',
               stroke: 'stroke-amber-500',
               badge: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
          };
     }
     return {
          label: 'Poor',
          stroke: 'stroke-red-500',
          badge: 'border-red-500/30 bg-red-500/10 text-red-400',
     };
};

export const StoryDialog = ({ selectedStory, open, handleClose }: Props) => {
     if (!selectedStory) return null;

     const words = selectedStory.content.trim().split(/\s+/).filter(Boolean).length;
     const level = getScoreLevel(selectedStory.score);

     return (
          <Dialog open={open} onOpenChange={(value) => !value && handleClose()}>
               <DialogContent className='flex max-h-[85vh] !w-[60vw] !max-w-[60rem] flex-col'>
                    <DialogHeader>
                         <DialogTitle className='flex items-center gap-3'>
                              {selectedStory.name ?? `Story #${selectedStory.id}`}
                              <Badge variant='outline' className={`gap-1.5 text-[11px] font-medium ${level.badge}`}>
                                   <span className='font-semibold'>{selectedStory.score}</span>
                                   <span className='opacity-70'>·</span>
                                   {level.label}
                              </Badge>
                         </DialogTitle>
                         <DialogDescription>
                              Job #{selectedStory.jobId} · {words.toLocaleString('en-US')} words
                         </DialogDescription>
                    </DialogHeader>

                    <div className='flex-1 overflow-y-auto pr-2'>
                         <p className='whitespace-pre-line text-sm leading-7'>{selectedStory.content}</p>
                    </div>
               </DialogContent>
          </Dialog>
     );
};
