import Box from '@mui/material/Box';
import React from 'react';

import { Message } from '../../interfaces/Message';
import MessageBubble from './MessageBubble';
import Table from './Table';

interface MessageListProps {
    messages: Array<Message>;
    bottomRef: React.RefObject<HTMLDivElement>;
    onTableSelectionChange?: (rows: Array<any>) => void;
}

const MessageList: React.FC<MessageListProps> = ({
    messages,
    bottomRef,
    onTableSelectionChange,
}) => {
    return (
        <Box className="absolute top-[9vh] left-5 right-0 bottom-[6vh] p-[1.67vw] flex flex-col gap-[1.25vw] overflow-y-auto">
            {messages.map((msg: Message, idx: string) =>
                msg.action === 'table' ? (
                    <Table
                        key={idx}
                        rows={msg.tableRows || []}
                        onSelectionChange={onTableSelectionChange}
                    />
                ) : (
                    <MessageBubble key={idx} msg={msg} />
                )
            )}
            <Box ref={bottomRef} />
        </Box>
    );
};

export default MessageList;
