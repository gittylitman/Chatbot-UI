import Box from '@mui/material/Box';
import React, { useState } from 'react';
import Typography from '@mui/material/Typography';

import Dot from '../../assets/ChevronDown.svg';
import { SessionItem } from './types';
import SessionItemRow from './SessionItemRow';
import SidebarHeader from './SidebarHeader';

interface SidebarProps {
    onToggle: () => void;
    sessions: Array<SessionItem>;
    userId:string
}

export default function Sidebar({ onToggle, sessions,userId }: SidebarProps) {
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

    return (
      <Box className="w-[446px] h-screen bg-[#FBFBFB] flex flex-col pt-[100px] px-[20px]">
            <SidebarHeader onToggle={onToggle} userId={userId} />

            <Box className="flex items-center gap-1 my-1 ml-2">
                <Typography className="text-[16px] text-[#002D49]">Chats</Typography>
                <img src={Dot} alt="dot" className="w-[13px] h-[13px]" />
            </Box>

            <Box className="flex-1 overflow-y-auto pr-[10px] mt-1">
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
