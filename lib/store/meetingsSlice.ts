import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Meeting {
  id: string;
  title: string;
  startTime: string;
  meetLink: string;
  isInstant: boolean;
}

interface MeetingsState {
  meetings: Meeting[];
}

const initialState: MeetingsState = {
  meetings: [],
};

export const meetingsSlice = createSlice({
  name: 'meetings',
  initialState,
  reducers: {
    addMeeting: (state, action: PayloadAction<Meeting>) => {
      state.meetings.push(action.payload);
    },
  },
});

export const { addMeeting } = meetingsSlice.actions;

export default meetingsSlice.reducer;