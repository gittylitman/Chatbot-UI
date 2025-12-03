import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import IconButton from '@mui/material/IconButton';
import React, { useRef, useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { useDispatch, useSelector } from 'react-redux';

import { Message } from '../../interfaces/Message';
import { RootState } from '../../redux/store';
import TypingIndicator from './TypingIndicator';
import { addMessage } from '../../redux/slices/sessionSlice';
import { messageApi } from '../../services/message/message';

interface MessageBubbleProps {
    msg: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ msg }) => {
    const copiedRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();
    const sessionId = useSelector((state: RootState) => state.currentSession.sessionId);
    const messages = useSelector((state: RootState) => state.session.session.messages);

    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState(msg.content);
    const [editWidth, setEditWidth] = useState<number | null>(null);

    const [showPrevious, setShowPrevious] = useState(false);
    const [showNext, setShowNext] = useState(false);

    useEffect(() => {
        if (msg.role !== 'user') {
            setShowPrevious(false);
            setShowNext(false);
            return;
        }

        const parent = messages.find((m: Message) => m.id === msg.parentMessageId && m.role === 'user');
        setShowPrevious(Boolean(parent));

        const child = messages.find((m: Message) => m.parentMessageId === msg.id && m.role === 'user');
        setShowNext(Boolean(child));
    }, [msg, messages]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        if (copiedRef.current) {
            const el = copiedRef.current;
            el.style.opacity = '1';
            el.style.transform = 'translateY(-0.26vw)';
            setTimeout(() => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(0)';
            }, 1000);
        }
    };

    const saveEdit = async () => {
        const updated = await messageApi.editMessage('456', msg.id, draft);

        const newUserMessage: Message = {
            id: updated.id,
            sessionId: sessionId!,
            role: 'user',
            content: draft,
            action: '',
            createdAt: new Date(),
            editedAt: new Date(),
            parentMessageId: msg.id,
        };

        dispatch(addMessage(newUserMessage));

        setIsEditing(false);
        setDraft(msg.content);
    };

    const highlightElement = (el: HTMLElement | null) => {
        if (!el) return;
        el.classList.add('ring-2', 'ring-gray-600', 'ring-offset-2');
        setTimeout(() => {
            el.classList.remove('ring-2', 'ring-gray-600', 'ring-offset-2');
        }, 1400);
    };

    const navigateToPrevious = () => {
        const parent = messages.find((m: Message) => m.id === msg.parentMessageId && m.role === 'user');
        if (!parent) return;

        const el = document.getElementById(`message-${parent.id}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            highlightElement(el);
        }
    };

    const navigateToNext = () => {
        const children = messages
            .filter((m: Message) => m.parentMessageId === msg.id && m.role === 'user')
            .sort((a: Message, b: Message) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        const child = children[0];
        if (!child) return;

        const el = document.getElementById(`message-${child.id}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            highlightElement(el);
        }
    };

    const startEditing = () => {
        if (contentRef.current) {
            const rect = contentRef.current.getBoundingClientRect();
            setEditWidth(rect.width);
        }
        setIsEditing(true);
        setDraft(msg.content);
    };

    return (
        <Box
            id={`message-${msg.id}`}
            ref={el => {
                (contentRef as any).current = el;
            }}
            className={`group relative inline-block max-w-[70%] p-[0.6vw] rounded-[1vw] self-start text-left break-words
                ${msg.role === 'user' ? 'bg-[#F5F6F7] text-gray-900' : 'bg-white'}
            `}
        >
            {msg.role === 'user' && isEditing ? (
                <Box className="flex flex-col gap-2">
                    <TextareaAutosize
                        value={draft}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDraft(e.target.value)}
                        className="rounded-md p-2 text-sm bg-white resize-none"
                        style={{
                            minWidth: editWidth ? `${editWidth+100}px` : undefined,
                        }}
                        autoFocus
                        onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                saveEdit();
                            }
                        }}
                    />

                    <Box className="flex gap-2 justify-end">
                        <Button
                            size="small"
                            onClick={() => {
                                setIsEditing(false);
                                setDraft(msg.content);
                            }}
                            className="!bg-white !text-black !text-[0.521vw] border border-gray-300 hover:!bg-gray-100 !rounded-[1.042vw] h-[1.563vw] w-[3.125vw]"
                        >
                            Cancel
                        </Button>

                        <Button
                            size="small"
                            onClick={saveEdit}
                            className="!bg-black !text-white !text-[0.521vw] border border-gray-400 hover:!bg-gray-900 !rounded-[1.042vw] h-[1.563vw] w-[3.125vw]">
                            Save
                        </Button>
                    </Box>
                </Box>
            ) : (
                <>
                    {msg.action === 'typing' ? (
                        <TypingIndicator />
                    ) : (
                        <>
                            <Box>
                                <ReactMarkdown
                                    remarkPlugins={[remarkBreaks, remarkGfm]}
                                    components={{
                                        code({ inline, children, ...props }) {
                                            if (!inline) {
                                                return (
                                                    <Box className="relative bg-gray-100 p-3 rounded-lg my-2 font-mono text-sm overflow-x-auto">
                                                        <IconButton
                                                            size="small"
                                                            className="!absolute top-2 right-2 p-1"
                                                            onClick={() =>
                                                                copyToClipboard(String(children))
                                                            }
                                                        >
                                                            <ContentCopyIcon fontSize="small" />
                                                        </IconButton>
                                                        <Box
                                                            ref={copiedRef}
                                                            className="absolute text-xs top-[2.08vw] right-[0.68vw] opacity-0 transition duration-300 ease-in-out"
                                                        >
                                                            copied!
                                                        </Box>
                                                        <code {...props}>{children}</code>
                                                    </Box>
                                                );
                                            }
                                            return (
                                                <code
                                                    className="bg-gray-200 px-1 rounded text-sm font-mono"
                                                    {...props}
                                                >
                                                    {children}
                                                </code>
                                            );
                                        },
                                        table({ children }) {
                                            return (
                                                <table className="table-auto border-collapse border border-gray-300 rounded-md my-2 w-full text-sm">
                                                    {children}
                                                </table>
                                            );
                                        },
                                        th({ children }) {
                                            return (
                                                <th className="border border-gray-300 px-3 py-1 bg-gray-100 font-medium text-left">
                                                    {children}
                                                </th>
                                            );
                                        },
                                        td({ children }) {
                                            return (
                                                <td className="border border-gray-300 px-3 py-1 text-left align-top">
                                                    {children}
                                                </td>
                                            );
                                        },
                                        a({ children, href }) {
                                            return (
                                                <a
                                                    href={href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 underline"
                                                >
                                                    {children}
                                                </a>
                                            );
                                        },
                                        ul({ children }) {
                                            return <ul className="list-disc pl-5">{children}</ul>;
                                        },
                                        ol({ children }) {
                                            return (
                                                <ol className="list-decimal pl-5">{children}</ol>
                                            );
                                        },
                                        li({ children }) {
                                            return <li className="mb-1">{children}</li>;
                                        },
                                        strong({ children }) {
                                            return <strong>{children}</strong>;
                                        },
                                        em({ children }) {
                                            return <em>{children}</em>;
                                        },
                                    }}
                                >
                                    {msg.content}
                                </ReactMarkdown>

                                {msg.parentMessageId && msg.role === 'user' && (
                                    <Box className="text-[0.65rem] text-gray-400 mt-1 italic">
                                        edited
                                    </Box>
                                )}
                            </Box>

                            {msg.role === 'user' && (
                                <Box className="flex flex-row-reverse justify-דstart  mt-1 gap-1 items-center">
                                    <IconButton
                                        size="small"
                                        onClick={() => startEditing()}
                                        className="!bg-[#F5F6F7] hover:!bg-gray-300 hover:shadow-sm !text-gray-700 !rounded-md">
                                        <EditOutlinedIcon fontSize="inherit" />
                                    </IconButton>

                                    {(showPrevious || showNext) && (
                                        <Box>
                                            <IconButton
                                                size="small"
                                                onClick={navigateToPrevious}
                                                disabled={!showPrevious}
                                                className={`!bg-[#F5F6F7] disabled:!opacity-40 hover:!bg-gray-300 hover:shadow-sm !text-gray-700 !rounded-md !p-0`}>
                                                <ChevronLeft fontSize="inherit" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={navigateToNext}
                                                disabled={!showNext}
                                                className={`!bg-[#F5F6F7] disabled:!opacity-40 hover:!bg-gray-300 hover:shadow-sm !text-gray-700 !rounded-md !p-0`}>
                                                <ChevronRight fontSize="inherit" />
                                            </IconButton>
                                        </Box>
                                    )}
                                </Box>
                            )}
                        </>
                    )}
                </>
            )}
        </Box>
    );
};

export default MessageBubble;
