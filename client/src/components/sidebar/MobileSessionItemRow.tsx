import Box from '@mui/material/Box';
import React from 'react';
import Typography from '@mui/material/Typography';

import DeleteIcon from '../../assets/Delete.svg';
import { Session } from '../../interfaces/Session';

interface Props {
    session: Session;
    onSelect: (sessionId: string) => void;
    onDelete: (sessionId: string) => void;
    tooltipSessionId: string | null;
    setTooltipSessionId: (id: string | null) => void;
}

const MobileSessionItemRow: React.FC<Props> = ({
    session,
    onSelect,
    onDelete,
    tooltipSessionId,
    setTooltipSessionId,
}) => {
    const isTooltipOpen = tooltipSessionId === session.id;

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setTooltipSessionId(isTooltipOpen ? null : session.id);
    };

    const handleConfirmDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(session.id);
        setTooltipSessionId(null);
    };

    const handleClickSession = () => {
        if (isTooltipOpen) {
            setTooltipSessionId(null);
            return;
        }
        onSelect(session.id);
    };

    return (
        <Box className="w-[84.5vw] h-[6.2vh] pt-[1.88vh] pr-[6.1vw] pb-[1.88vh] pl-[6.1vw] flex justify-between items-center bg-[#F5F6F7] border border-[#E5E7EB] rounded-[6.1vw] mb-[2vw] cursor-pointer transition-all">
            <Box onClick={handleClickSession} className="flex-1 truncate">
                <Typography className="text-[3.5vw] font-semibold text-[#28396C] truncate">
                    {session.id.substring(0, 11) + '...'}
                </Typography>
                <Typography className="text-[2.5vw] text-[rgba(0,66,90,0.4)]">
                    {new Date(session.createdAt).toLocaleString()}
                </Typography>
            </Box>

            <Box className="relative ml-[4vw] flex items-center justify-center">
                <img
                    src={DeleteIcon}
                    alt="Delete"
                    onClick={handleDeleteClick}
                    className="w-[5vw] h-[5vw] cursor-pointer"
                />

                {isTooltipOpen && (
                    <Box
                        onClick={handleConfirmDelete}
                        className="flex absolute top-[-11vw] right-[-2vw] bg-[#0F766E] text-white 
                       px-[3vw] py-[1.5vw] rounded-full text-[3.5vw] shadow-md z-50"
                    >
                        Delete
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default MobileSessionItemRow;
