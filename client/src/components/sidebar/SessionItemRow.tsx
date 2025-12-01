import Box from '@mui/material/Box';
import Tooltip, { tooltipClasses, TooltipProps } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
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

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} arrow={false} />
))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#0F766E',
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

export default function SessionItemRow({
    session,
    isSelected,
    onClick,
    onDelete,
}: SessionItemRowProps) {
    const dispatch = useDispatch();
    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await sessionApi.deleteSession(session.id);
        onDelete(session.id);
        dispatch(removeSession(session.id));
    };

    return (
        <Box
            onClick={onClick}
            className={`
                flex justify-between items-center
                w-[17.292vw] h-[4.167vh]
                bg-[#F5F6F7]
                rounded-[1.25vw]
                px-6 mb-1.5 cursor-pointer
                transition-all border
                ${isSelected ? 'border-[#002D49]' : 'border-[#E5E7EB]'}
                hover:border-[#002D49]
            `}
        >
            <Box className="flex flex-col">
                <Typography className="text-[0.729vw] font-medium text-[#28396C]">
                    {session.id.substring(0, 11) + '...'}
                </Typography>
                <Typography className="text-[0.625vw] text-[rgba(0,66,90,0.77)]">
                    {new Date(session.createdAt).toLocaleString()}
                </Typography>
            </Box>

            <CustomTooltip
                title={
                    <Box
                        className="flex items-center gap-0 px-2 py-1 bg-[#0F766E] rounded-full h-[3.056vh] justify-center"
                        onClick={handleDelete}
                    >
                        <img src={DeleteIcon} alt="Delete" style={{ width: 12, height: 13 }} />
                        <Typography className="text-[0.729vw] font-normal text-[#002D49] m-[0.156vw]">
                            Delete
                        </Typography>
                    </Box>
                }
                placement="right-start"
            >
                <Box className="cursor-pointer">
                    <img src={DeleteIcon} alt="Delete" className="color-[#002D49]" />
                </Box>
            </CustomTooltip>
        </Box>
    );
}
