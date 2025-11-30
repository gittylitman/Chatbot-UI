import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CurrentSessionState {
    sessionId: string | null;
}

const initialState: CurrentSessionState = {
    sessionId: null,
};

const currentSessionSlice = createSlice({
    name: 'currentSession',
    initialState,
    reducers: {
        setCurrentSessionId: (state: CurrentSessionState, action: PayloadAction<string>) => {
            state.sessionId = action.payload;
        },
        clearCurrentSessionId: (state: CurrentSessionState) => {
            state.sessionId = null;
        },
    },
});

export const { setCurrentSessionId, clearCurrentSessionId } = currentSessionSlice.actions;
export default currentSessionSlice.reducer;
