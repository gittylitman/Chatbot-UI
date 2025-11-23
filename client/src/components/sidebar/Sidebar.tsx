import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';

import Dot from '../../assets/ChevronDown.svg';
import { SessionItem } from './types';
import SessionItemRow from './SessionItemRow';
import SidebarHeader from './SidebarHeader';

interface SidebarProps {
    onToggle: () => void;
    sessions: Array<SessionItem>;
}

export default function Sidebar({ onToggle, sessions }: SidebarProps) {
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

    return (
        <Box
            sx={{
                width: 446,
                height: '100vh',
                backgroundColor: '#FBFBFB',
                display: 'flex',
                flexDirection: 'column',
                paddingTop: '100px',
                paddingX: '20px',
            }}
        >
            <SidebarHeader onToggle={onToggle} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginY: 1, marginLeft: 2 }}>
                <Typography sx={{ fontSize: 16, color: 'rgba(0,45,73,1)' }}>Chats</Typography>
                <img src={Dot} alt="dot" style={{ width: 13, height: 13 }} />
            </Box>

            <Box sx={{ flex: 1, overflowY: 'auto', paddingRight: '10px', mt: 1 }}>
                {sessions.map(session => (
                    <SessionItemRow
                        key={session.id}
                        session={session}
                        isSelected={selectedSessionId === session.id}
                        onClick={() => setSelectedSessionId(session.id)}
                    />
                ))}
            </Box>
        </Box>
    );
}
