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
import { useIsMobile } from '../../hooks/useIsMobile';

const ChatInput: React.FC = () => {
    const [value, setValue] = useState('');
    const [isPressed, setIsPressed] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const sessionId = useSelector((state: RootState) => state.currentSession.sessionId);
    const isMobile = useIsMobile();

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
        <Box
            className={`
        relative flex items-center 
        ${
            isMobile
                ? 'w-[77.86vw] h-[14.76vw] px-[6.87vw] py-[5.09vw] rounded-[5.09vw]'
                : 'w-[40vw] min-h-[7vh] px-[0.5vw] py-[0.2vw] rounded-[1.042vw]'
        }
        gap-[2.55vw] 
        bg-${isMobile ? '[#F1F7F6]' : 'white'} 
        shadow-md border border-gray-200 transition-shadow duration-200 hover:shadow-lg
      `}
            style={
                isMobile
                    ? {
                          boxShadow: 'inset 1.02vw 0 1.53vw 0 rgba(0, 56, 91, 0.2)',
                          border: '0.063vw solid #002D49',
                      }
                    : undefined
            }
        >
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
                className={`
          flex-1 resize-none outline-none overflow-y-auto
          ${
              isMobile
                  ? '!text-[4.07vw] !text-[#002D49] leading-[1] font-inter bg-[#F1F7F6]'
                  : '!text-[1vw] !text-[#374151] leading-[1.5] bg-transparent pr-[3vw]'
          }
        `}
            />
            <IconButton
                onClick={handleSend}
                disabled={!value.trim()}
                className={`
          ${isMobile ? 'w-[6.1vw] h-[6.1vw]' : 'absolute right-1 w-[1.8vw] h-[1.8vw]'}
          transition-transform duration-150 
          ${isPressed ? 'scale-90' : 'scale-100'} 
          hover:bg-gray-100 rounded-full p-0 flex items-center justify-center
        `}
            >
                <SendIcon
                    className={isMobile ? 'w-[6.1vw] h-[6.1vw] text-[#002D49]' : '!w-full !h-full'}
                />
            </IconButton>
        </Box>
    );
};

export default ChatInput;
