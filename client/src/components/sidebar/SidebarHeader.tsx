import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import Close from '../../assets/CloseSidebar.svg';
import Contact from '../../assets/Contact.svg';
import NewChat from '../../assets/NewChat.svg';

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} arrow={false} />
))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#0F766E',
        color: 'white',
        fontWeight: 400,
        fontSize: 14,
        borderRadius: 999,
        padding: '0.417vw 1.481vh',
    },
}));

export default function SidebarHeader({
    onToggle,
    onNewChat,
    onContactClick,
}: {
    onToggle: () => void;
    onNewChat: () => void;
    onContactClick: () => void;
}) {
    return (
        <>
            <Box className="flex justify-end gap-1 m-4">
                <CustomTooltip title="Contact us">
                    <IconButton
                        className="w-[2.8vw] h-[2.8vw] rounded-[0.52vw]"
                        onClick={onContactClick}
                    >
                        <img src={Contact} alt="contact" />
                    </IconButton>
                </CustomTooltip>
                <CustomTooltip title="Close sidebar">
                    <IconButton onClick={onToggle} className="w-[2.8vw] h-[2.8vw] rounded-[0.52vw]">
                        <img src={Close} alt="close" />
                    </IconButton>
                </CustomTooltip>
            </Box>
            <Box
                onClick={onNewChat}
                className="flex items-center gap-2 w-full px-2 py-1 rounded-[0.417vw] mb-2 cursor-pointer hover:bg-[rgba(0,45,73,0.1)]"
            >
                <img src={NewChat} alt="new chat" />
                <Typography className="text-[0.833vw] text-[#002D49]">New Chat</Typography>
            </Box>
        </>
    );
}
