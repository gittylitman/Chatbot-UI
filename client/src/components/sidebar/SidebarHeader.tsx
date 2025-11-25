import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import Close from '../../assets/CloseSidebar.svg';
import Contact from '../../assets/Mail.svg';
import Edit from '../../assets/Edit.svg';


import { session } from '../../services/session/session';
const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} arrow={false} />
))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: 'rgba(198, 219, 93, 1)',
        color: 'rgba(0,45,73,1)',
        fontWeight: 400,
        fontSize: 14,
        borderRadius: 999,
        padding: '8px 16px',
    },
}));

export default function SidebarHeader({ userId,onToggle }: { userId:string,onToggle: () => void }) {
    const handleContactClick = () => {
        window.open(
            'https://kineret.health.gov.il/en/contact',
            '_blank',
            'noopener,noreferrer'
        );
    };

    const handleNewChat = async () => {
        try {
            const res = await session.createSession(userId);
            console.log('New session created:', res.data);

        } catch (err) {
            console.error('Error creating session:', err);
        }
    };

    return (
        <>
            <Box className="flex justify-end gap-1 mb-2">
                <CustomTooltip title="Contact us">
                    <IconButton className="w-[40px] h-[40px] rounded-[10px]"
                        onClick={handleContactClick}
                    >
                        <img src={Contact} alt="contact" className="w-[32px] h-[32px]" /> 
                    </IconButton>
                </CustomTooltip>

                <CustomTooltip title="Close sidebar">
                    <IconButton onClick={onToggle} className="w-[40px] h-[40px] rounded-[10px]">
                        <img src={Close} alt="close" className="w-[32px] h-[32px]" />
                    </IconButton>
                </CustomTooltip>
            </Box>

            <Box
                onClick={handleNewChat}
                className="flex items-center gap-2 w-full px-2 py-1 rounded-[8px] mb-2 cursor-pointer hover:bg-[rgba(0,45,73,0.1)]"
            >
                <img src={Edit} alt="new chat" className="w-[20px] h-[20px]" />
                <Typography className="text-[16px] text-[#002D49]">New Chat</Typography>
            </Box>

        </>
    );
}
