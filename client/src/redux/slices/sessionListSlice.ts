import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Session } from '../../interfaces/Session';

interface SessionListState {
    sessions: Array<Session>;
}

const initialState: SessionListState = {
    sessions: [],
};

const sessionListSlice = createSlice({
    name: 'sessionList',
    initialState,
    reducers: {
        setSessionList: (state: SessionListState, action: PayloadAction<Array<string>>) => {
            state.sessions = action.payload;
        },
        addSession: (state: SessionListState, action: PayloadAction<string>) => {
            state.sessions.push(action.payload);
        },
        removeSession: (state: SessionListState, action: PayloadAction<string>) => {
            state.sessions = state.sessions.filter(session => session.id !== action.payload);
        },
    },
});

export const { setSessionList, addSession, removeSession } = sessionListSlice.actions;
export default sessionListSlice.reducer;
