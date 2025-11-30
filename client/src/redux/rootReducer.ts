import { combineReducers } from '@reduxjs/toolkit';

import currentsessionReducer from './slices/currentSessionSlice';
import sessionListReducer from './slices/sessionListSlice';
import sessionReducer from './slices/sessionSlice';

const rootReducer = combineReducers({
    session: sessionReducer,
    currentSession: currentsessionReducer,
    sessionList: sessionListReducer,
});

export default rootReducer;
