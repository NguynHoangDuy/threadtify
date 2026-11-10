import type { Post } from '@/constants/post';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type PusherState = { id: string | null; data: Partial<Post> | null };

const initialState: { pusher: PusherState } = {
     pusher: { id: null, data: null },
};

const postSlice = createSlice({
     name: 'crawlJobs',
     initialState,
     reducers: {
          setPostPusher: (state, action: PayloadAction<{ id: string; data: Partial<Post> }>) => {
               state.pusher = action.payload;
          },
     },
});

export const { setPostPusher } = postSlice.actions;
export default postSlice.reducer;
