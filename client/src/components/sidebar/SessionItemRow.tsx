import { Box, Typography, Tooltip, tooltipClasses, TooltipProps, styled } from '@mui/material';

import DeleteIcon from '../../assets/Delete.svg';
import { SessionItem } from './types';

interface SessionItemRowProps {
    session: SessionItem;
    isSelected: boolean;
    onClick: () => void;
}

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} arrow={false} />
))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: 'rgba(198, 219, 93, 1)',
        width: 95.1,
        height: 33,
        padding: 0,
        borderRadius: 999,
        display: 'flex',
        alignItems: 'center',
        fontSize: 14,
        lineHeight: '100%',
        color: 'rgba(0,45,73,1)',
    },
}));

export default function SessionItemRow({ session, isSelected, onClick }: SessionItemRowProps) {
    return (
        <Box
            onClick={onClick}
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: 332,
                height: 45,
                backgroundColor: 'rgba(245,246,247,1)',
                border: isSelected ? '1px solid rgba(0,45,73,1)' : '1px solid rgba(229,231,235,1)',
                borderRadius: 24,
                padding: '0 24px',
                cursor: 'pointer',
                mb: 1.5,
                transition: 'border 0.2s',
                '&:hover': {
                    border: '1px solid rgba(0,45,73,1)',
                },
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography sx={{ fontSize: 14, fontWeight: 500, color: 'rgba(40,57,108,1)' }}>
                    {session.id}
                </Typography>
                <Typography sx={{ fontSize: 12, color: 'rgba(0,66,90,0.77)' }}>
                    {new Date(session.createdAt).toLocaleString()}
                </Typography>
            </Box>

            <CustomTooltip
                title={
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0,
                            px: 2,
                            py: 1,
                            backgroundColor: 'rgba(198, 219, 93, 1)',
                            borderRadius: 999,
                            height: 33,
                            justifyContent: 'flex-start',
                        }}
                    >
                        <img
                            src={DeleteIcon}
                            alt="Delete"
                            style={{ width: 12, height: 13, display: 'block' }}
                        />
                        <Typography
                            sx={{
                                fontSize: 14,
                                fontWeight: 400,
                                color: 'rgba(0,45,73,1)',
                                lineHeight: '100%',
                                whiteSpace: 'nowrap',
                                ml: 0.5,
                            }}
                        >
                            Delete
                        </Typography>
                    </Box>
                }
                placement="right-start"
            >
                <Box sx={{ fontSize: '22px', color: 'rgba(40,57,108,1)', cursor: 'pointer' }}>
                    ⋮
                </Box>
            </CustomTooltip>
        </Box>
    );
}
