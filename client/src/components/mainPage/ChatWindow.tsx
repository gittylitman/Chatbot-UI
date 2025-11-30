import Box from '@mui/material/Box';
import React, { useEffect, useMemo, useRef } from 'react';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';

import ChatInput from './ChatInput';
import MessageList from './MessageList';
import { RootState } from '../../redux/store';
import { resetSession } from '../../redux/slices/sessionSlice';

const ChatWindow: React.FC = () => {
    const dispatch = useDispatch();
    const bottomRef = useRef<HTMLDivElement>(null);

    const session = useSelector((state: RootState) => state.session.session);
    const messages = useMemo(() => session?.messages || [], [session?.messages]);

    useEffect(() => {
        dispatch(resetSession());
    }, [dispatch]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <Box className="relative w-full max-w-[46vw] h-[99vh] mx-auto rounded-[1vw]">
            <MessageList messages={messages} bottomRef={bottomRef} />
            <Box
                className={
                    messages.length > 0
                        ? 'absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center'
                        : 'absolute bottom-1/2 left-1/2 -translate-x-1/2 flex flex-col items-center'
                }
            >
                <ChatInput />
                <Typography variant="body" className="text-xs !mt-1 text-gray-600">
                    Gen AI on OMOP can make mistakes. Consider checking important information.
                </Typography>
            </Box>
        </Box>
    );
};

export default ChatWindow;
