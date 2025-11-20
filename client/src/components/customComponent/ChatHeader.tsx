import { Box } from '@mui/material';
import React from 'react';

import logo1 from '../../public/logo.png';

const Header: React.FC = () => {
    return (
        <Box
            className="
                fixed top-0 left-0 w-full 
                h-[7vh] 
                bg-[#00385B]
                flex items-center 
                px-[1vw]
                z-[2000]
                shadow-md
            "
        >
            <Box className="flex items-center gap-[0.5vw]">
                <img src={logo1} alt="logo1" className="h-[4.5vh] w-auto object-contain" />
            </Box>
        </Box>
    );
};

export default Header;
