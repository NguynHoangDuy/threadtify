import { callAPI } from '@/utils/apiCaller';
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type CrawlJob = {
     id: number;
     keyWord: string;
     status: string;
     numPosts: number;
     numStories: number;
     createdAt: string;
     updatedAt: string | null;
};

const initialState: { items: CrawlJob[]; isLoading: boolean; total: number } = {
     items: [],
     isLoading: false,
     total: 0,
};

export type CrawlJobParams = {
     page: number;
     pageSize: number;
     keyWord?: string;
     status?: string;
};

export const fetchCrawlJobs = createAsyncThunk('crawlJobs/fetch', async (data: CrawlJobParams) => {
     const response = await callAPI('POST', '/api/crawl-job', data);
     return { items: response.items, total: response.total };
});

const crawlJobsSlice = createSlice({
     name: 'crawlJobs',
     initialState,
     reducers: {
          setJobs: (state, action: PayloadAction<CrawlJob[]>) => {
               state.items = action.payload;
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

export const { setJobs } = crawlJobsSlice.actions;
export default crawlJobsSlice.reducer;
