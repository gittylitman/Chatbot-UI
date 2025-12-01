import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import ChatsList from '../../assets/Chats.svg';
import Close from '../../assets/CloseSidebar.svg';
import Contact from '../../assets/Contact.svg';
import MenuButton from './MenuButton';
import NewChat from '../../assets/NewChat.svg';

interface ClosedSidebarProps {
    onToggle: () => void;
    onNewChat: () => void;
    onContactClick: () => void;
}

export default function ClosedSidebar({ onToggle, onNewChat, onContactClick }: ClosedSidebarProps) {
    const handleNweChat = () => {
        onNewChat();
        onToggle();
    };

    return (
        <Box className="w-[9.1vw] h-screen bg-[#FBFBFB] flex flex-col items-center pb-[1.25vw] pr-[0.83vw] pl-[0.83vw] gap-[2.5vw]">
            <Box className="mt-[6vw] flex flex-col items-center gap-[2.5vw]">
                <IconButton onClick={onToggle} className="w-[3vw] h-[3vw] rounded-[0.52vw]">
                    <img src={Close} alt="close" className="w-[1.8vw] h-[2vw]" />
                </IconButton>
                <MenuButton onClick={onContactClick} label="Contact us" icon={Contact}></MenuButton>
                <MenuButton onClick={handleNweChat} label="New Chat" icon={NewChat}></MenuButton>
                <MenuButton onClick={onToggle} label="Chats" icon={ChatsList}></MenuButton>
            </Box>
        </Box>
    );
}
