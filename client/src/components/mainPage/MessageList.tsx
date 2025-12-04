import Box from "@mui/material/Box";
import { Message } from "../../interfaces/Message";
import MessageBubble from "./MessageBubble";
import React from 'react';
import CustomTable from "./Table";

interface MessageListProps {
  messages: Message[];
  bottomRef: React.RefObject<HTMLDivElement>;
  onTableSelectionChange?: (rows: any[]) => void;
}

const MessageList: React.FC<MessageListProps> = ({ messages, bottomRef, onTableSelectionChange }) => {
    console.log(messages);
    console.log(messages[1].action);
    
    
  return (
    <Box className="absolute top-[9vh] left-5 right-0 bottom-[6vh] p-[1.67vw] flex flex-col gap-[1.25vw] overflow-y-auto">
      {messages.map((msg, idx) =>
         msg.action === "table" ? (
          <CustomTable key={idx} rows={msg.tableRows || []} onSelectionChange={onTableSelectionChange} />
        ) : (
          <MessageBubble key={idx} msg={msg} />
        )
      )}
      <Box ref={bottomRef} />
    </Box>
  );
};

export default MessageList;
