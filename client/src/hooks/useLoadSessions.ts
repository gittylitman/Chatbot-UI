import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

import { sessionApi } from '../services/session/session';
import { setCurrentSessionId } from '../redux/slices/currentSessionSlice';
import { setSession } from '../redux/slices/sessionSlice';
import { setSessionList } from '../redux/slices/sessionListSlice';
import { userApi } from '../services/users/users';

// src/hooks/useLoadSessions.ts

export const useLoadSessions = (userId: string) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const loadSessions = async () => {
            try {
                const sessions = await userApi.userHistory(userId);
                dispatch(setSessionList(sessions));
                const lastSession = sessions[0];
                dispatch(setCurrentSessionId(lastSession.id));
                const sessionData = await sessionApi.getSession(lastSession.id);
                dispatch(setSession(sessionData));
            } catch {
                const newSession = await sessionApi.createSession(userId);
                dispatch(setSessionList([newSession]));
                dispatch(setCurrentSessionId(newSession.id));
                dispatch(setSession(newSession));
            }
        };

        loadSessions();
    }, [dispatch, userId]);
};
