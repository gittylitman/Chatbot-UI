import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';

import Close from '../../assets/CloseSidebar.svg';
import Contact from '../../assets/Contact.svg';
import NewChat from '../../assets/NewChat.svg';
import { addSession } from '../../redux/slices/sessionListSlice';
import { sessionApi } from '../../services/session/session';
import { RootState } from '../../redux/store';
import { setCurrentSessionId } from '../../redux/slices/currentSessionSlice';
import { setSession } from '../../redux/slices/sessionSlice';

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} arrow={false} />
))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#0F766E',
        color: 'rgba(0,45,73,1)',
        fontWeight: 400,
        fontSize: 14,
        borderRadius: 999,
        padding: '0.417vw 1.481vh',
    },
}));

export default function SidebarHeader({
    userId,
    onToggle,
}: {
    userId: string;
    onToggle: () => void;
}) {
    const handleContactClick = () => {
        window.open('https://kineret.health.gov.il/en/contact', '_blank', 'noopener,noreferrer');
    };

    const dispatch = useDispatch();
    const session = useSelector((state: RootState) => state.session.session);
    const handleNewChat = async () => {
        console.log(session);
        
        if (session?.id && session.messages?.length === 0) {
            return;
        }
                
        const newSession = await sessionApi.createSession(userId);
        dispatch(setSession({ ...newSession, messages: [] }));
        dispatch(setCurrentSessionId(newSession.id));
        dispatch(addSession(newSession));
    };

    return (
        <>
            <Box className="flex justify-end gap-1 mb-2">
                <CustomTooltip title="Contact us">
                    <IconButton
                        className="w-[2.083vw] h-[3.704vh] rounded-[0.521vw]"
                        onClick={handleContactClick}
                    >
                        <img src={Contact} alt="contact" className="w-[2.083vw] h-[3.704vh]" />
                    </IconButton>
                </CustomTooltip>
                <CustomTooltip title="Close sidebar">
                    <IconButton
                        onClick={onToggle}
                        className="w-[2.083vw] h-[3.704vh] rounded-[0.521vw]"
                    >
                        <img src={Close} alt="close" className="w-[1.667vw] h-[2.963vh]" />
                    </IconButton>
                </CustomTooltip>
            </Box>
            <Box
                onClick={handleNewChat}
                className="flex items-center gap-2 w-full px-2 py-1 rounded-[0.417vw] mb-2 cursor-pointer hover:bg-[rgba(0,45,73,0.1)]"
            >
                <img src={NewChat} alt="new chat" className="w-[1.354vw] h-[2.407vh]" />
                <Typography className="text-[0.833vw] text-[#002D49]">New Chat</Typography>
            </Box>
        </>
    );
}
