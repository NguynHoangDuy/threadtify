import { CHANNEL_NAME, EVENT_NAME } from '@/constants/pusher';
import Pusher from 'pusher-js';
import type { AppStore } from '@/store';
import { setJobPusher, type CrawlJob } from '@/store/crawlJobsSlice';
import { setPostPusher } from '@/store/postSlice';
import type { Post } from '@/constants/post';

export function initPusher(store: AppStore) {
     const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
          cluster: import.meta.env.VITE_PUSHER_CLUSTER,
     });

     const channel = pusher.subscribe(CHANNEL_NAME.CRAWL_CHANNEL);

     channel.bind(EVENT_NAME[CHANNEL_NAME.CRAWL_CHANNEL].JOB_UPDATE, (data: Partial<CrawlJob> & { id: number }) => store.dispatch(setJobPusher({ id: data.id, data })));
     channel.bind(EVENT_NAME[CHANNEL_NAME.CRAWL_CHANNEL].POST_UPDATE, (data: Partial<Post> & { id: string }) => store.dispatch(setPostPusher({ id: data.id, data })));

     return () => {
          channel.unbind_all();
          pusher.disconnect();
     };
}
