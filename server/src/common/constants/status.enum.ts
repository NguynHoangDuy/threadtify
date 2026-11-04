export enum CrawlJobStatus {
    PENDING = 'PENDING',
    RUNNING = 'RUNNING',
    PAUSED = 'PAUSED',
    CRAWL_POST = 'CRAWL_POST',
    CRAWL_PART = 'CRAWL_PART',
    MERGE_STORY = 'MERGE_STORY',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
}

export enum PostStatus {
    PENDING = 'PENDING',
    RUNNING = 'RUNNING',
    ENRICH = 'ENRICH',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
}

export enum LLMType {
    FILTER_COMMENT = 'Filter Comment of Post',
    MERGE_STORY = 'Merge story by post and comment',
}

export enum LLMStatus {
    PENDING = 'Pending',
    SUCCESS = 'Success',
    FAILED = 'Failed',
}
