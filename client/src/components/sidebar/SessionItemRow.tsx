import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip, { tooltipClasses, TooltipProps } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
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
            className={`
                flex justify-between items-center
                w-[332px] h-[45px]
                bg-[#F5F6F7]
                rounded-[24px]
                px-6 mb-1.5 cursor-pointer
                transition-all border
                ${isSelected ? 'border-[#002D49]' : 'border-[#E5E7EB]'}
                hover:border-[#002D49]
            `}
        >
            <Box className="flex flex-col">
                <Typography className="text-[14px] font-medium text-[#28396C]">
                    {session.id}
                </Typography>
                <Typography className="text-[12px] text-[rgba(0,66,90,0.77)]">
                    {new Date(session.createdAt).toLocaleString()}
                </Typography>
            </Box>

            <CustomTooltip
                title={
                    <Box className="flex items-center gap-0 px-2 py-1 bg-[#C6DB5D] rounded-full h-[33px] justify-start">
                        <img src={DeleteIcon} alt="Delete" style={{ width: 12, height: 13, display: 'block' }} />
                        <Typography className="text-[14px] font-normal text-[#002D49] leading-none whitespace-nowrap ml-0.5">
                            Delete
                        </Typography>
                    </Box>
                }
                placement="right-start"
            >
                <Box className="text-[22px] text-[#28396C] cursor-pointer">⋮</Box>
            </CustomTooltip>
        </Box>
    );
}
