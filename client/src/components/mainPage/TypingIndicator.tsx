import Box from '@mui/material/Box';
import React from 'react';

const TypingIndicator: React.FC = () => {
    return (
        <Box className="flex items-center space-x-1">
            <Box className="w-2 h-2 bg-black rounded-full animate-bounce delay-0" />
            <Box className="w-2 h-2 bg-black rounded-full animate-bounce delay-200" />
            <Box className="w-2 h-2 bg-black rounded-full animate-bounce delay-400" />

            <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        .animate-bounce {
          animation: bounce 1s infinite ease-in-out;
        }
        .delay-0 { animation-delay: 0s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-400 { animation-delay: 0.4s; }
      `}</style>
        </Box>
    );
};

export default TypingIndicator;
