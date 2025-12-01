import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import React, { useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { useDispatch, useSelector } from 'react-redux';

import { Answer } from '../../interfaces/Answer';
import { AppDispatch } from '../store';
import { Message } from '../../interfaces/Message';
import { RootState } from '../../redux/store';
import { addMessage, updateMessage } from '../../redux/slices/sessionSlice';
import { sessionApi } from '../../services/session/session';

const ChatInput: React.FC = () => {
    const [value, setValue] = useState('');
    const [isPressed, setIsPressed] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const sessionId = useSelector((state: RootState) => state.currentSession.sessionId);

    const createMessage = (
        role: 'user' | 'agent',
        content: string,
        action: string = '',
        id?: string
    ): Message => {
        return {
            id: id ?? crypto.randomUUID(),
            sessionId: sessionId || '',
            role,
            content,
            action,
            createdAt: new Date(),
        };
    };

    const handleSend = async () => {
        if (!value.trim()) return;

        const userMessage: Message = createMessage('user', value);
        dispatch(addMessage(userMessage));
        setValue('');

        const loadingMessage: Message = createMessage('agent', '', 'typing');
        dispatch(addMessage(loadingMessage));

        const response: Answer = await sessionApi.sendMessage(sessionId!, {
            message: userMessage.content,
        });
        const updatedMessage: Message = createMessage(
            'agent',
            response.content,
            response.action,
            loadingMessage.id
        );

        dispatch(updateMessage({ id: loadingMessage.id, message: updatedMessage }));

        setIsPressed(true);
        setTimeout(() => setIsPressed(false), 150);
    };

    return (
        <Box className="relative flex items-center w-[40vw] min-h-[7vh] px-[0.5vw] py-[0.2vw] bg-white !rounded-[1.042vw] shadow-md border border-gray-200 transition-shadow duration-200 hover:shadow-lg">
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
                className={`!absolute !right-1 !bg-[#0F766E]
                    transition-transform duration-150 p-[0.208vw] w-[1.8vw] h-[1.8vw] ${isPressed ? 'scale-90' : 'scale-100'} hover:bg-gray-100 rounded-full`}
            >
                <SendIcon className="!w-full !h-full rotate-[335deg] text-[#FFFFFF]" />
            </IconButton>
        </Box>
    );
};

export default ChatInput;
