import Box from '@mui/material/Box';

import ChatWindow from './mainPage/ChatWindow';
import Header from './customComponent/ChatHeader';
import Sidebar from './sidebar/Sidebar';

const Chatbot: React.FC = () => {
    return (
        <Box>
            <Header />
            <Box className="flex">
                <Sidebar userId={'456'} />
                <ChatWindow />
            </Box>
        </Box>
    );
};

export default Chatbot;
