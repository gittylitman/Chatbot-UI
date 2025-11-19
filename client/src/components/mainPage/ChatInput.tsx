import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import React, { useState } from 'react';
import SendIcon from '@mui/icons-material/Send';

const ChatInput: React.FC = () => {
  const [value, setValue] = useState('');
  const [isPressed, setIsPressed] = useState(false);

  const handleSend = () => {
    if (!value.trim()) return;
    setValue('');
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
  };

  return (
    <Paper
      elevation={3}
      className="
      flex items-center
      w-[25.99vw] h-[2.344vw]
      px-[0.521vw] py-[0.208vw]
      !rounded-[1.042vw]
      !shadow-[inset_0.208vw_0_0.313vw_0_rgba(0,0,0,0.25)]
      bg-white
      box-border
    "
    >
      <InputBase
        placeholder="Ask anything"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
          e.key === 'Enter' && handleSend()
        }
        className="flex-1 ml-1 bg-transparent outline-none"
        inputProps={{
          className: '!text-[0.9vw] !text-[#374151]',
        }}
      />

      <IconButton
        onClick={handleSend}
        disabled={!value.trim()}
        className={`transition-transform duration-150 p-[0.208vw] w-[2vw] h-[2vw] ${isPressed ? 'scale-90' : 'scale-100'
          }`}
      >
        <SendIcon className="!w-full !h-full rotate-[335deg]" />
      </IconButton>
    </Paper>
  );
};

export default ChatInput;
