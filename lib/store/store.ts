import { configureStore } from '@reduxjs/toolkit';
import meetingsReducer from './meetingsSlice';

export const store = configureStore({
  reducer: {
    meetings: meetingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;