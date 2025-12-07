import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import Chats from '../../assets/Chats.svg';
import { RootState } from '../../redux/store';
import SessionItemRow from './SessionItemRow';
import SidebarHeader from './SidebarHeader';

interface SidebarProps {
    onToggle: () => void;
    onNewChat: () => void;
    onContactClick: () => void;
    onDeleteSession: (sessionId: string) => void;
    onSelectSession: (sessionId: string) => void;
}

export default function Sidebar({
    onToggle,
    onNewChat,
    onContactClick,
    onDeleteSession,
    onSelectSession,
}: SidebarProps) {
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
    const [open, setOpen] = useState(true);

    const sessions = useSelector((state: RootState) => state.sessionList.sessions);

    return (
        <Box className="w-[26vw] min-w-[240px] max-w-[330px] h-screen bg-white flex flex-col pt-[9vh] px-[1vw]">
            <SidebarHeader
                onToggle={onToggle}
                onNewChat={onNewChat}
                onContactClick={onContactClick}
            />
            <List component="nav">
                <ListItemButton
                    onClick={() => setOpen(!open)}
                    className="!p-0 hover:bg-transparent"
                >
                    <Box className="flex items-center gap-2 w-full rounded-[0.417vw] cursor-pointer hover:bg-[rgba(0,45,73,0.1)]">
                        <img src={Chats} alt="chats" />
                        <ListItemText
                            primary="Chats"
                            className="text-[0.833vw] text-[#002D49] m-0"
                            primaryTypographyProps={{ noWrap: true }}
                        />
                        {open ? <ExpandLess /> : <ExpandMore />}
                    </Box>
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box className="flex-1 overflow-y-auto pr-[0.3vw] mt-2">
                        <List disablePadding>
                            {[...sessions].reverse().map(session => (
                                <Box key={session.id} className="ml-2">
                                    <SessionItemRow
                                        session={session}
                                        isSelected={selectedSessionId === session.id}
                                        onDelete={onDeleteSession}
                                        onClick={() => {
                                            setSelectedSessionId(session.id);
                                            onSelectSession(session.id);
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
