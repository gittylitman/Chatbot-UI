import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

interface MenuButtonProps {
    onClick: () => void;
    icon: string;
    label: string;
}

export default function MenuButton({ onClick, icon, label }: MenuButtonProps) {
    return (
        <Box className="flex flex-col items-center">
            <IconButton
                className="w-[3vw] h-[3vw] rounded-[0.52vw] flex flex-col items-center gap-1"
                onClick={onClick}
            >
                <img src={icon} alt={label} className="w-[1.8vw] h-[2vw]" />
            </IconButton>
            <Typography className="font-inter font-normal !text-[0.99vw] leading-[1] text-[#002D49] text-center">
                {label}
            </Typography>
        </Box>
    );
}
