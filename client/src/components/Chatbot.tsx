import Box from '@mui/material/Box';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import ChatWindow from './mainPage/ChatWindow';
import ClosedSidebar from './sidebar/ClosedSidebar';
import Header from './customComponent/ChatHeader';
import Sidebar from './sidebar/Sidebar';
import { addSession } from '../redux/slices/sessionListSlice';
import { sessionApi } from '../services/session/session';
import { setCurrentSessionId } from '../redux/slices/currentSessionSlice';
import { setSession } from '../redux/slices/sessionSlice';

const Chatbot: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const userId = '456';

    const handleToggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };
    const handleContactClick = () => {
        window.open('https://kineret.health.gov.il/en/contact', '_blank', 'noopener,noreferrer');
    };
    const dispatch = useDispatch();
    const handleNewChat = async () => {
        const newSession = await sessionApi.createSession(userId);
        dispatch(setSession({ ...newSession, messages: [] }));
        dispatch(setCurrentSessionId(newSession.id));
        dispatch(addSession(newSession));
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
                    />
                ) : (
                    <ClosedSidebar
                        onToggle={handleToggleSidebar}
                        onNewChat={handleNewChat}
                        onContactClick={handleContactClick}
                    />
                )}
                <ChatWindow />
            </Box>
        </Box>
    );
};

export default Chatbot;
