import Box from '@mui/material/Box';

import ChatsList from '../../assets/ChatsMobile.svg';
import Contact from '../../assets/ContactMobile.svg';
import Imugi from '../../assets/ImugiMobile.svg';
import NewChat from '../../assets/NewChatMobile.svg';

interface MobileNavbarProps {
    onNewChat: () => void;
    onContactClick: () => void;
    onChatsClick: () => void;
}

export default function MobileNavbar({
    onNewChat,
    onContactClick,
    onChatsClick,
}: MobileNavbarProps) {
    return (
        <Box className="fixed w-full h-[14.3vh] flex items-center justify-center bottom-[0] gap-[15vw]">
            <img src={Imugi} />
            <img src={ChatsList} onClick={onChatsClick} />
            <img src={NewChat} onClick={onNewChat} />
            <img src={Contact} onClick={onContactClick} />
        </Box>
    );
}
