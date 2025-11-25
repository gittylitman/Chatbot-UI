import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { Message } from '../../interfaces/Message';
import { Session } from '../../interfaces/Session';

interface SessionState {
    session: Session;
}

const initialState: SessionState = {
    session: {
        id: '',
        userId: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        messages: [],
    },
};

const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        resetSession: () => initialState,

        setSession: (state: SessionState, action: PayloadAction<Session>) => {
            state.session = action.payload;
        },

        addMessage: (state: SessionState, action: PayloadAction<Message>) => {
            if (!state.session.messages) {
                state.session.messages = [];
            }
            state.session.messages.push(action.payload);
        },
        setSessionMessage: (state: SessionState, action: PayloadAction<Array<Message>>) => {
            state.session.messages = action.payload;
        },
        updateMessage: (
            state: SessionState,
            action: PayloadAction<{ id: string; message: Message }>
        ) => {
            state.session.messages = state.session.messages.map(msg =>
                msg.id === action.payload.id ? action.payload.message : msg
            );
        },
    },
});

export const { resetSession, setSession, addMessage, setSessionMessage, updateMessage } =
    sessionSlice.actions;
export default sessionSlice.reducer;
