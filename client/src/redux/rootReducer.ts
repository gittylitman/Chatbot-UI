import { combineReducers } from '@reduxjs/toolkit';

import sessionReducer from './slices/sessionSlice';

const rootReducer = combineReducers({
    session: sessionReducer,
});

export default rootReducer;
