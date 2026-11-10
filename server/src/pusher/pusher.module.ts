import { Module } from '@nestjs/common';
import { PusherService } from './pusher.service.js';

@Module({
    providers: [PusherService],
    exports: [PusherService],
})
export class PusherModule {}
