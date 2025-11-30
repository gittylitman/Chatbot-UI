import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Chats from '../../assets/Chats.svg';
import { RootState } from '../../redux/store';
import SessionItemRow from './SessionItemRow';
import SidebarHeader from './SidebarHeader';
import { removeSession, setSessionList } from '../../redux/slices/sessionListSlice';
import { sessionApi } from '../../services/session/session';
import { setCurrentSessionId } from '../../redux/slices/currentSessionSlice';
import { setSession } from '../../redux/slices/sessionSlice';
import { userApi } from '../../services/users/users';

interface SidebarProps {
    onToggle: () => void;
    userId: string;
}

export default function Sidebar({ onToggle, userId }: SidebarProps) {
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
    const [open, setOpen] = useState(true);

    const sessions = useSelector((state: RootState) => state.sessionList.sessions);
    const dispatch = useDispatch();

    useEffect(() => {
        const loadSessions = async () => {
            const sessions = await userApi.userHistory(userId);
            dispatch(setSessionList(sessions));
        };

        loadSessions();
    }, [dispatch, userId]);

    const handleSelectSession = async (sessionId: string) => {
        const session = await sessionApi.getSession(sessionId);
        dispatch(setSession(session));
        dispatch(setCurrentSessionId(sessionId));
    };

    const handleDeleteSession = async (sessionId: string) => {
        const deleteSession = await sessionApi.deleteSession(sessionId);
        dispatch(removeSession(deleteSession));
    };

    return (
        <Box className="w-[23.229vw] h-screen bg-[#FBFBFB] flex flex-col pt-[9.259vh] px-[1.042vw]">
            <SidebarHeader onToggle={onToggle} userId={userId} />

            <List component="nav">
                <ListItemButton onClick={() => setOpen(!open)}>
                    <img src={Chats} alt="chats" className="w-[1.667vw] h-[2.963vh]" />
                    <ListItemText
                        primary="Chats"
                        className="text-[0.833vw] text-[#002D49] !hover:bg-[rgba(0,45,73,0.1)]"
                    />
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>

                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box className="max-h-[70vh] overflow-y-auto">
                        <List disablePadding>
                            {sessions.map(session => (
                                <Box key={session.id} className="ml-2">
                                    <SessionItemRow
                                        session={session}
                                        isSelected={selectedSessionId === session.id}
                                        onDelete={handleDeleteSession}
                                        onClick={() => {
                                            setSelectedSessionId(session.id);
                                            handleSelectSession(session.id);
                                        }}
                                    />
                                </Box>
                            ))}
                        </List>
                    </Box>
                </Collapse>
            </List>
        </Box>
    );
}
