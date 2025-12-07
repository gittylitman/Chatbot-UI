import { Box } from '@mui/material';
import React from 'react';

import logo1 from '../../public/logo.png';

const MobileChatHeader: React.FC = () => {
    return (
        <Box className="w-full h-[10vh] bg-[#002D45] flex justify-center items-center fixed top-0 left-0 z-50">
            <img src={logo1} alt="logo1" className="h-auto w-auto max-h-[6vh]" />
        </Box>
    );
};

export default MobileChatHeader;
