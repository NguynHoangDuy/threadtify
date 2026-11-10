import { configureStore } from '@reduxjs/toolkit';
import crawlJobsReducer from './crawlJobsSlice';
import postReducer from './postSlice';

export const store = configureStore({
     reducer: {
          crawlJobs: crawlJobsReducer,
          posts: postReducer,
     },
});

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
