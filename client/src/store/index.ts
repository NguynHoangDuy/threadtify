import { configureStore } from '@reduxjs/toolkit';
import crawlJobsReducer from './crawlJobsSlice';

export const store = configureStore({
     reducer: {
          crawlJobs: crawlJobsReducer,
     },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
