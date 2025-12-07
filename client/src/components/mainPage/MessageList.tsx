import Box from '@mui/material/Box';

import { Message } from '../../interfaces/Message';
import MessageBubble from './MessageBubble';
import { useIsMobile } from '../../hooks/useIsMobile';

interface MessageListProps {
    messages: Array<Message>;
    bottomRef: React.RefObject<HTMLDivElement>;
}

const MessageList: React.FC<MessageListProps> = ({ messages, bottomRef }) => {
    const isMobile = useIsMobile();

    const containerClass = isMobile
        ? 'absolute top-[2vh] left-0 right-0 px-[5vw] bottom-[25vw] md:bottom-[6vh] p-[1.67vw] flex flex-col gap-[2.5vw] overflow-y-auto'
        : 'absolute top-[6vh] left-0 right-0 bottom-[6vh] p-[1.67vw] flex flex-col gap-[1.25vw] overflow-y-auto';

    return (
        <Box className={containerClass}>
            {messages.map((msg: Message, idx: number) => (
                <MessageBubble key={idx} msg={msg} />
            ))}
            <Box ref={bottomRef} />
        </Box>
    );
};

export default MessageList;
