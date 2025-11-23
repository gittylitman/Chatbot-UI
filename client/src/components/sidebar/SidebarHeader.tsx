import { Box, IconButton, Typography } from '@mui/material';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

import Close from '../../assets/CloseSidebar.svg';
import Contact from '../../assets/Mail.svg';
import Edit from '../../assets/Edit.svg';

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

export default function SidebarHeader({ onToggle }: { onToggle: () => void }) {
    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
                <CustomTooltip title="Contact us">
                    <IconButton sx={{ width: 40, height: 40, borderRadius: '10px' }}>
                        <img src={Contact} alt="contact" style={{ width: 32, height: 32 }} />
                    </IconButton>
                </CustomTooltip>

                <CustomTooltip title="Close sidebar">
                    <IconButton
                        onClick={onToggle}
                        sx={{ width: 40, height: 40, borderRadius: '10px' }}
                    >
                        <img src={Close} alt="close" style={{ width: 32, height: 32 }} />
                    </IconButton>
                </CustomTooltip>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    width: '100%',
                    paddingX: 2,
                    paddingY: 1,
                    borderRadius: '8px',
                    marginBottom: 2,
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: 'rgba(0,45,73,0.1)' },
                }}
            >
                <img src={Edit} alt="new chat" style={{ width: 20, height: 20 }} />
                <Typography sx={{ fontSize: 16, color: 'rgba(0,45,73,1)' }}>New Chat</Typography>
            </Box>
        </>
    );
}
