import Box from '@mui/material/Box';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ChatWindow from './mainPage/ChatWindow';
import ClosedSidebar from './sidebar/ClosedSidebar';
import Header from './customComponent/ChatHeader';
import MobileChatHeader from './customComponent/MobileChatHeader';
import MobileChatWindow from './mainPage/MobileChatWindow';
import MobileNavbar from './sidebar/MobileNavbar';
import { RootState } from '../redux/store';
import Sidebar from './sidebar/Sidebar';
import { addSession } from '../redux/slices/sessionListSlice';
import { removeSession } from '../redux/slices/sessionListSlice';
import { sessionApi } from '../services/session/session';
import { setCurrentSessionId } from '../redux/slices/currentSessionSlice';
import { setSession } from '../redux/slices/sessionSlice';
import { useIsMobile } from '../hooks/useIsMobile';
import { useLoadSessions } from '../hooks/useLoadSessions';

const Chatbot: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const userId = '456';
    const isMobile = useIsMobile();
    const session = useSelector((state: RootState) => state.session.session);
    const dispatch = useDispatch();
    useLoadSessions(userId);
    const handleToggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };
    const handleContactClick = () => {
        window.open('https://kineret.health.gov.il/en/contact', '_blank', 'noopener,noreferrer');
    };
    const handleDeleteSession = async (sessionId: string) => {
        try {
            await sessionApi.deleteSession(sessionId);
            dispatch(removeSession(sessionId));
        } catch (error) {
            console.error('Failed to delete session:', error);
        }
    };

    const handleNewChat = async () => {
        if (session && session.messages && session.messages.length === 0) {
            setShowChatList(false);
            return;
        }
        const newSession = await sessionApi.createSession(userId);
        dispatch(setSession({ ...newSession, messages: [] }));
        dispatch(setCurrentSessionId(newSession.id));
        dispatch(addSession(newSession));
        setShowChatList(false);
    };

    const [showChatList, setShowChatList] = useState(false);
    const sessions = useSelector((state: RootState) => state.sessionList.sessions);

    const handleShowChats = () => setShowChatList(true);
    const handleCloseChats = () => setShowChatList(false);

    const handleSelectSession = async (sessionId: string) => {
        const session = await sessionApi.getSession(sessionId);
        dispatch(setSession(session));
        dispatch(setCurrentSessionId(sessionId));
        handleCloseChats();
    };

    return (
        <>
            {isMobile ? (
                <Box className="bg-[#002D45] min-h-screen overflow-hidden">
                    <MobileChatHeader></MobileChatHeader>
                    <MobileChatWindow
                        showChatList={showChatList}
                        sessions={sessions}
                        onSelect={handleSelectSession}
                        onCloseChatList={handleCloseChats}
                        onDeleteSession={handleDeleteSession}
                    />
                    <MobileNavbar
                        onNewChat={handleNewChat}
                        onContactClick={handleContactClick}
                        onChatsClick={handleShowChats}
                    />
                </Box>
            ) : (
                <Box>
                    <Header />
                    <Box className="flex">
                        {isSidebarOpen ? (
                            <Sidebar
                                onToggle={handleToggleSidebar}
                                onNewChat={handleNewChat}
                                onContactClick={handleContactClick}
                                onDeleteSession={handleDeleteSession}
                                onSelectSession={handleSelectSession}
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
            )}
        </>
    );
};

export default Chatbot;
