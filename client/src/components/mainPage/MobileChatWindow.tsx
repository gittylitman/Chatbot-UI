import Box from '@mui/material/Box';
import React, { useEffect, useMemo, useRef } from 'react';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';

import ChatInput from './ChatInput';
import MessageList from './MessageList';
import MobileChatsList from './MobileChatsList';
import { RootState } from '../../redux/store';
import { Session } from '../../interfaces/Session';

interface Props {
    showChatList: boolean;
    sessions: Array<Session>;
    onSelect: (sessionId: string) => void;
    onCloseChatList: () => void;
    onDeleteSession: (sessionId: string) => void;
}

const MobileChatWindow: React.FC<Props> = ({
    showChatList,
    sessions,
    onSelect,
    onDeleteSession,
}) => {
    const bottomRef = useRef<HTMLDivElement>(null);
    const session = useSelector((state: RootState) => state.session.session);
    const messages = useMemo(() => session?.messages || [], [session?.messages]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <Box
            className="relative w-full mt-[10vh] h-[76.4vh] p-[3vw] bg-gradient-to-t from-[#f0fffc] to-white
      rounded-tl-[7.89vw] rounded-tr-[7.89vw] rounded-bl-[6.11vw] rounded-br-[6.11vw]"
        >
            {showChatList ? (
                <MobileChatsList
                    sessions={sessions}
                    onSelect={onSelect}
                    onDelete={onDeleteSession}
                />
            ) : (
                <>
                    <MessageList messages={messages} bottomRef={bottomRef} />
                    <Box className="absolute bottom-[2.8vw] left-1/2 -translate-x-1/2 w-[94vw] max-w-[94vw] h-[2.8vw] flex justify-center items-center overflow-visible">
                        <Typography
                            variant="body"
                            className="text-[2.8vw] leading-[1] text-[#002D49] text-center whitespace-nowrap"
                        >
                            Gen AI on OMOP can make mistakes. Consider checking important
                            information.
                        </Typography>
                    </Box>
                    <Box
                        className={
                            messages.length > 0
                                ? 'absolute bottom-[7vw] left-1/2 -translate-x-1/2 flex flex-col items-center'
                                : 'absolute bottom-1/2 left-1/2 -translate-x-1/2 flex flex-col items-center'
                        }
                    >
                        <ChatInput />
                    </Box>
                </>
            )}
        </Box>
    );
};

export default MobileChatWindow;
