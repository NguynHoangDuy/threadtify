import type { StepState } from '@/constants/crawl-job';

export function Connector({ state }: { state: StepState }) {
     return (
          <div className='relative h-0.5 flex-1 mx-4 overflow-hidden rounded bg-zinc-800'>
               <div className={`absolute inset-y-0 left-0 bg-green-500 transition-all duration-700 ease-out ${state === 'done' ? 'w-full' : 'w-0'}`} />
               {state === 'running' && <div className='absolute inset-y-0 left-0 w-1/3 bg-amber-400 animate-slide' />}
          </div>
     );
}
