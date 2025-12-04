import Box from '@mui/material/Box';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ChatWindow from './mainPage/ChatWindow';
import ClosedSidebar from './sidebar/ClosedSidebar';
import Header from './customComponent/ChatHeader';
import { RootState } from '../redux/store';
import Sidebar from './sidebar/Sidebar';
import { addSession } from '../redux/slices/sessionListSlice';
import { sessionApi } from '../services/session/session';
import { setCurrentSessionId } from '../redux/slices/currentSessionSlice';
import { setSession } from '../redux/slices/sessionSlice';

const Chatbot: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
    const userId = '456';
    const session = useSelector((state: RootState) => state.session.session);

    const handleToggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };
    const handleContactClick = () => {
        window.open('https://kineret.health.gov.il/en/contact', '_blank', 'noopener,noreferrer');
    };
    const dispatch = useDispatch();
    const handleNewChat = async () => {
        if (session && session.messages && session.messages.length === 0) return;
        const newSession = await sessionApi.createSession(userId);
        dispatch(setSession({ ...newSession, messages: [] }));
        dispatch(setCurrentSessionId(newSession.id));
        dispatch(addSession(newSession));
        setSelectedSessionId(newSession.id);
    };
    return (
        <Box>
            <Header />
            <Box className="flex">
                {isSidebarOpen ? (
                    <Sidebar
                        onToggle={handleToggleSidebar}
                        onNewChat={handleNewChat}
                        onContactClick={handleContactClick}
                        userId={userId}
                        selectedSessionId={selectedSessionId}
                        setSelectedSessionId={setSelectedSessionId}
                    />
                ) : (
                    <ClosedSidebar
                        onToggle={handleToggleSidebar}
                        onNewChat={handleNewChat}
                        onContactClick={handleContactClick}
                    />
                )}
                <ChatWindow resetSessionTrigger={selectedSessionId} />
            </Box>
        </Box>
    );
};

export default Chatbot;
