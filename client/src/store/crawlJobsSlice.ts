import { callAPI } from '@/utils/apiCaller';
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type CrawlJob = {
     id: number;
     keyWord: string;
     status: string;
     numPosts: number;
     numStories: number;
     numComments: number;
     numRelevant: number;
     createdAt: string;
     updatedAt: string;
};
type PusherState = { id: number | null; data: Partial<CrawlJob> | null };

const initialState: { items: CrawlJob[]; isLoading: boolean; total: number; page: number; pageSize: number; pusher: PusherState } = {
     items: [],
     isLoading: false,
     total: 0,
     page: 1,
     pageSize: 10,
     pusher: { id: null, data: null },
};

export type CrawlJobParams = {
     page: number;
     pageSize: number;
     keyWord?: string;
     status?: string;
};

export const fetchCrawlJobs = createAsyncThunk('crawlJobs/fetch', async (data: CrawlJobParams) => {
     try {
          const response = await callAPI('POST', '/api/crawl-job', data);
          return { items: response.items, total: response.total };
     } catch (err) {
          return { items: [], total: 0 };
     }
});

const crawlJobsSlice = createSlice({
     name: 'crawlJobs',
     initialState,
     reducers: {
          setJobs: (state, action: PayloadAction<CrawlJob[]>) => {
               state.items = action.payload;
          },
          setJobPusher: (state, action: PayloadAction<{ id: number; data: Partial<CrawlJob> }>) => {
               const { id, data } = action.payload;
               state.pusher = action.payload;

               const job = state.items.find((item) => item.id === id);
               if (job) {
                    Object.assign(job, data);
               }
          },
          setPage: (state, action: PayloadAction<number>) => {
               state.page = action.payload;
          },
          setPageSize: (state, action: PayloadAction<number>) => {
               state.pageSize = action.payload;
          },
     },
     extraReducers: (builder) => {
          builder
               .addCase(fetchCrawlJobs.pending, (state) => {
                    state.isLoading = true;
               })
               .addCase(fetchCrawlJobs.fulfilled, (state, action) => {
                    state.items = action.payload.items;
                    state.total = action.payload.total;
                    state.isLoading = false;
               })
               .addCase(fetchCrawlJobs.rejected, (state, action) => {
                    if (action.meta.aborted) return;
                    state.isLoading = false;
               });
     },
});

export const { setJobs, setJobPusher, setPage, setPageSize } = crawlJobsSlice.actions;
export default crawlJobsSlice.reducer;
