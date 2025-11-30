import Box from '@mui/material/Box';
import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Dot from '../../assets/ChevronDown.svg';
import { SessionItem } from './types';
import SessionItemRow from './SessionItemRow';
import SidebarHeader from './SidebarHeader';
import Close from '../../assets/CloseSidebar.svg';
import Contact from '../../assets/Mail.svg';
import Edit from '../../assets/Edit.svg'
import ChatsList from '../../assets/ChatsList.svg'
interface ClosedSidebarProps {
    onToggle: () => void;
    sessions: Array<SessionItem>;
}

export default function ClosedSidebar({ onToggle, sessions }: ClosedSidebarProps) {
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

    return (
        <Box className="w-[174px] h-screen bg-[#FBFBFB] flex flex-col items-center pt-[44px] pb-[24px] pr-[16px] pl-[16px] gap-[40px]">
            <IconButton onClick={onToggle} className="w-[48px] h-[48px] rounded-[10px]">
                <img src={Close} alt="close" className="w-[26px] h-[27px]" />
            </IconButton>
            <Box className="flex flex-col items-center">
                <IconButton className="w-[48px] h-[48px] rounded-[10px] flex flex-col items-center gap-1">
                    <img src={Contact} alt="contact" className="w-[26px] h-[27px]" />
                </IconButton>
                <Typography className="font-inter font-normal !text-[14px] leading-[100%] text-[#002D49] text-center">Contact us</Typography>
            </Box>
            <Box className="flex flex-col items-center">
            <IconButton className="w-[48px] h-[48px] rounded-[10px] flex flex-col items-center gap-1">
                <img src={Edit} alt="new chat" className="w-[26px] h-[27px]" />
                </IconButton>
                <Typography className="font-inter font-normal !text-[14px] leading-[100%] text-[#002D49] text-center">New Chat</Typography>
            </Box>
            <Box className="flex flex-col items-center">
            <IconButton className="w-[48px] h-[48px] rounded-[10px] flex flex-col items-center gap-1">
                <img src={ChatsList} alt="new chat" className="w-[26px] h-[27px]" />
                </IconButton>
                <Typography className="font-inter font-normal !text-[14px] leading-[100%] text-[#002D49] text-center">Chats</Typography>
            </Box>
        </Box>
        

    );
}
