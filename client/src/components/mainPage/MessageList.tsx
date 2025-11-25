import Box from '@mui/material/Box';

import { Message } from '../../interfaces/Message';
import MessageBubble from './MessageBubble';

interface MessageListProps {
    messages: Array<Message>;
    bottomRef: React.RefObject<HTMLDivElement>;
}

const MessageList: React.FC<MessageListProps> = ({ messages, bottomRef }) => {
    return (
        <Box className="absolute top-0 left-0 right-0 bottom-[6vh] p-[1.67vw] flex flex-col gap-[1.25vw] overflow-y-auto">
            {messages.map((msg: Message, idx: string) => (
                <MessageBubble key={idx} msg={msg} />
            ))}
            <Box ref={bottomRef} />
        </Box>
    );
};

export default MessageList;
