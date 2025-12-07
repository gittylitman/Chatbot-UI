import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import DeleteIcon from '../../assets/Delete.svg';
import { SessionItem } from '../../interfaces/types';
import { removeSession } from '../../redux/slices/sessionListSlice';
import { sessionApi } from '../../services/session/session';

interface SessionItemRowProps {
    session: SessionItem;
    isSelected: boolean;
    onClick: () => void;
    onDelete: (sessionId: string) => void;
}

export default function SessionItemRow({
    session,
    isSelected,
    onClick,
    onDelete,
}: SessionItemRowProps) {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);

    const handleDelete = async () => {
        await sessionApi.deleteSession(session.id);
        onDelete(session.id);
        dispatch(removeSession(session.id));
        setOpen(false);
    };

    return (
        <Box className="relative w-full">
            <Box
                onClick={onClick}
                className={
                    `flex justify-between items-center w-full h-[42px] px-3 rounded-[0.625rem] mb-2 cursor-pointer transition-all border ` +
                    (isSelected
                        ? 'bg-gray-300 border-[#002D49]'
                        : 'bg-gray-100 border-[#E5E7EB] hover:border-[#002D49]')
                }
            >
                <Box className="flex flex-col justify-center h-full">
                    <Typography className="text-[0.75rem] font-medium text-[#28396C] truncate">
                        {session.id.substring(0, 11) + '...'}
                    </Typography>
                    <Typography className="text-[0.3rem] h-5 text-[rgba(0,66,90,0.3)]">
                        {new Date(session.createdAt).toLocaleString()}
                    </Typography>
                </Box>
                <Box
                    className="cursor-pointer flex items-center h-full"
                    onClick={e => {
                        e.stopPropagation();
                        setOpen(prev => !prev);
                    }}
                >
                    <img src={DeleteIcon} alt="Delete" className="w-4 h-4" />
                </Box>
            </Box>

            {open && (
                <Box
                    className="
            fixed
            top-1/2
            left-[300px] 
            -translate-y-1/2
            bg-white
            rounded-[0.5vw]
            border border-[rgba(0,45,73,1)]
            shadow-md
            p-[0.8vw]
            flex flex-col items-center justify-between
            z-[9999]
            w-[18vw]
            h-[16vh]
        "
                    onClick={e => e.stopPropagation()}
                >
                    <Typography className="text-[0.9vw] font-medium text-center text-[rgba(40,57,108,1)]">
                        Are you sure you want to delete the conversation?
                    </Typography>
                    <Box className="flex gap-[1vw] mt-[1vw]">
                        <Button
                            variant="contained"
                            onClick={handleDelete}
                            size="small"
                            sx={{
                                backgroundColor: 'rgba(15,118,110,1)',
                                '&:hover': { backgroundColor: 'rgba(10,90,85,1)' },
                            }}
                        >
                            Yes
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={() => setOpen(false)}
                            size="small"
                            sx={{
                                borderColor: 'rgba(40,57,108,1)',
                                color: '#28396C',
                            }}
                        >
                            No
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
}
