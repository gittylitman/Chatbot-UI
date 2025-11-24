import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import React, { useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { useDispatch } from 'react-redux';

import { AppDispatch } from '../store';
import { Message } from '../interfaces/Message';
import { addMessage, updateMessage } from '../../redux/slices/sessionSlice';
import { sessionApi } from '../../services/session/session';

const ChatInput: React.FC = () => {
    const [value, setValue] = useState('');
    const [isPressed, setIsPressed] = useState(false);
    const dispatch = useDispatch<AppDispatch>();

    const handleSend = async () => {
        if (!value.trim()) return;

        const userMessage: Message = {
            id: crypto.randomUUID(),
            sessionId: 'current',
            role: 'user',
            content: value,
            action: '',
            createdAt: new Date(),
        };
        dispatch(addMessage(userMessage));
        setValue('');

        const loadingMessage: Message = {
            id: crypto.randomUUID(),
            sessionId: 'current',
            role: 'agent',
            content: '',
            action: 'typing',
            createdAt: new Date(),
        };
        dispatch(addMessage(loadingMessage));

        const response: Message = await sessionApi.sendMessage('current', userMessage);
        dispatch(updateMessage({ id: loadingMessage.id, message: response }));

        setIsPressed(true);
        setTimeout(() => setIsPressed(false), 150);
    };

    return (
        <Box className="relative flex items-center w-[36vw] min-h-[5vh] px-[0.5vw] py-[0.2vw] bg-white !rounded-[1.042vw] shadow-md border border-gray-200 transition-shadow duration-200 hover:shadow-lg">
            <TextareaAutosize
                minRows={1}
                maxRows={6}
                value={value}
                onChange={e => setValue(e.target.value)}
                onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                    }
                }}
                placeholder="Ask anything"
                className="flex-1 bg-transparent outline-none resize-none !text-[0.75vw] !text-[#374151] leading-[1.5] max-h-[9vw] pr-[3vw] overflow-y-auto"
            />
            <IconButton
                onClick={handleSend}
                disabled={!value.trim()}
                className={`!absolute !right-1 !bottom-1 transition-transform duration-150 p-[0.208vw] w-[2vw] h-[2vw] ${isPressed ? 'scale-90' : 'scale-100'} hover:bg-gray-100 rounded-full`}
            >
                <SendIcon className="!w-full !h-full rotate-[335deg]" />
            </IconButton>
        </Box>
    );
};

export default ChatInput;
