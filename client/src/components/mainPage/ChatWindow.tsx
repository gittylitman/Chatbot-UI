import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import ChatInput from './ChatInput';
import MessageList from './MessageList';
import { RootState } from '../../redux/store';
import { addMessage } from '../../redux/slices/sessionSlice';
import { sessionApi } from '../../services/session/session';
import { Message } from '../../interfaces/Message';
import { AppDispatch } from '../store';

const ChatWindow: React.FC = () => {
    const bottomRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch<AppDispatch>();
    const session = useSelector((state: RootState) => state.session.session);
    const messages = useMemo(() => session?.messages || [], [session?.messages]);

    const [selectedTableRows, setSelectedTableRows] = useState<any[]>([]);

    const isTableMode = messages.some(m => m.action === 'table');

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendSelectedRows = async () => {
        if (selectedTableRows.length === 0) return;

        const contentToSend = JSON.stringify(selectedTableRows);
        const userMessage: Message = {
            id: crypto.randomUUID(),
            sessionId: session.id,
            role: 'user',
            content: contentToSend,
            action: '',
            createdAt: new Date(),
        };
        dispatch(addMessage(userMessage));

        const loadingMessage: Message = {
            id: crypto.randomUUID(),
            sessionId: session.id,
            role: 'agent',
            content: '',
            action: 'typing',
            createdAt: new Date(),
        };
        dispatch(addMessage(loadingMessage));

        try {
            const response = await sessionApi.sendMessage(session.id, { message: contentToSend });
            const updatedAgentMessage: Message = {
                id: loadingMessage.id,
                sessionId: session.id,
                role: 'agent',
                content: response.content ?? '',
                action: response.type ?? response.action ?? '',
                createdAt: new Date(),
            };
            dispatch(addMessage(updatedAgentMessage));
            setSelectedTableRows([]);
        } catch (err) {
            console.error('send selected rows failed', err);
            const failedMessage: Message = {
                id: loadingMessage.id,
                sessionId: session.id,
                role: 'agent',
                content: 'Failed to send selected rows',
                action: 'end',
                createdAt: new Date(),
            };
            dispatch(addMessage(failedMessage));
        }
    };

    return (
        <Box className="relative w-full bg-gradient-to-t from-[rgba(15,118,110,0.2)] to-white p-[1.67vw]">
            <MessageList messages={messages} bottomRef={bottomRef} onTableSelectionChange={setSelectedTableRows} />

            <Box className="absolute bottom-0 left-0 w-full flex justify-center mb-2">
            
                {!isTableMode ? (
                    <Box className="flex flex-col items-center w-full">
                        <ChatInput />
                        <Typography variant="body2" className="text-xs text-gray-600 mt-1">
                            Gen AI on OMOP can make mistakes. Consider checking important information.
                        </Typography>
                    </Box>
                ) : <Box />}
            </Box>
        </Box>
    );
};

export default ChatWindow;
