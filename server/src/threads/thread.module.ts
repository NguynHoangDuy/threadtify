import { Module } from '@nestjs/common';
import { ThreadsClient } from './thread.client.js';

@Module({
    providers: [ThreadsClient],
    exports: [ThreadsClient],
})
export class ThreadsModule {}
