// pusher.service.ts
import { Injectable, Logger } from '@nestjs/common';
import Pusher from 'pusher';
import { CHANNEL_NAME, EVENT_NAME } from '../common/constants/pusher.constant.js';

@Injectable()
export class PusherService {
     private readonly logger = new Logger(PusherService.name);

     private readonly pusher = new Pusher({
          appId: process.env.PUSHER_APP_ID!,
          key: process.env.PUSHER_KEY!,
          secret: process.env.PUSHER_SECRET!,
          cluster: process.env.PUSHER_CLUSTER!,
          useTLS: true,
     });

     async trigger(channel: string, event: string, data: unknown) {
          try {
               await this.pusher.trigger(channel, event, data);
          } catch (e) {
               this.logger.warn(`Pusher failed: ${(e as Error).message}`);
          }
     }

     async addTriggerUpdateJob(data: unknown) {
          try {
               await this.pusher.trigger(CHANNEL_NAME.CRAWL_CHANNEL, EVENT_NAME[CHANNEL_NAME.CRAWL_CHANNEL].JOB_UPDATE, data);
          } catch (e) {
               this.logger.warn(`Pusher failed: ${(e as Error).message}`);
          }
     }

     async addTriggerUpdatePost(data: unknown) {
          try {
               await this.pusher.trigger(CHANNEL_NAME.CRAWL_CHANNEL, EVENT_NAME[CHANNEL_NAME.CRAWL_CHANNEL].POST_UPDATE, data);
          } catch (e) {
               this.logger.warn(`Pusher failed: ${(e as Error).message}`);
          }
     }
}
