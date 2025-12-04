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

    // const rows = [
    //     {
    //         conceptId: '41414583',
    //         conceptCode: '427089005',
    //         conceptName: 'Diabetes mellitus due to cystic fibrosis',
    //         classId: 'Clinical Finding',
    //         domainId: 'Condition',
    //         vocabularyId: 'SNOMED',
    //         invalidReason: 'V',
    //         domainName: 'Condition',
    //         vocabularyName: 'SNOMED',
    //         validStartDate: '2025-01-01',
    //         validEndDate: '2025-12-31',
    //     },
    //     {
    //         conceptId: '41424584',
    //         conceptCode: '427089006',
    //         conceptName: 'Hypertension',
    //         classId: 'Clinical Finding',
    //         domainId: 'Condition',
    //         vocabularyId: 'SNOMED',
    //         invalidReason: 'כג',
    //         domainName: 'Condition',
    //         vocabularyName: 'SNOMED',
    //         validStartDate: '2025-01-01',
    //         validEndDate: '2025-12-31',
    //     },
    //     {
    //         conceptId: '41443584',
    //         conceptCode: '427089006',
    //         conceptName: 'Hypertension',
    //         classId: 'Clinical Finding',
    //         domainId: 'Condition',
    //         vocabularyId: 'SNOMED',
    //         invalidReason: 'כג',
    //         domainName: 'Condition',
    //         vocabularyName: 'SNOMED',
    //         validStartDate: '2025-01-01',
    //         validEndDate: '2025-12-31',
    //     },
    //     {
    //         conceptId: '41444584',
    //         conceptCode: '427089006',
    //         conceptName: 'Hypertension',
    //         classId: 'Clinical Finding',
    //         domainId: 'Condition',
    //         vocabularyId: 'SNOMED',
    //         invalidReason: 'כג',
    //         domainName: 'Condition',
    //         vocabularyName: 'SNOMED',
    //         validStartDate: '2025-01-01',
    //         validEndDate: '2025-12-31',
    //     },
    //     {
    //         conceptId: '41444584',
    //         conceptCode: '427089006',
    //         conceptName: 'Hypertension',
    //         classId: 'Clinical Finding',
    //         domainId: 'Condition',
    //         vocabularyId: 'SNOMED',
    //         invalidReason: 'כג',
    //         domainName: 'Condition',
    //         vocabularyName: 'SNOMED',
    //         validStartDate: '2025-01-01',
    //         validEndDate: '2025-12-31',
    //     },
    // ];

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

        dispatch(
            updateMessage({ id: userMessage.id, message: { ...userMessage, id: response.id } })
        );
        const updatedMessage: Message = createMessage(
            'agent',
            response.content,
            response.action,
            response.responseId
        );

        response.type = 'table';
        let updatedMessage: Message;

        if (response.type === 'table') {
            updatedMessage = createMessage('agent', '', 'table');
            updatedMessage.tableRows = rows;
        } else {
            updatedMessage = createMessage(
                'agent',
                response.content,
                response.action,
                loadingMessage.id
            );
        }

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
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                    }
                }}
                placeholder="Ask anything"
                className="flex-1 bg-transparent outline-none resize-none !text-[1vw] !text-[#374151] leading-[1.5] max-h-[9vw] pr-[3vw] overflow-y-auto"
            />
            <IconButton
                onClick={handleSend}
                disabled={!value.trim()}
                className={`!absolute !right-1
                    transition-transform duration-150 p-[0.208vw] w-[1.8vw] h-[1.8vw] ${isPressed ? 'scale-90' : 'scale-120'} hover:bg-gray-100 rounded-full`}
            >
                <SendIcon className="!w-full !h-full" />
            </IconButton>
        </Box>
    );
};

export default ChatInput;
