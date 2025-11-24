import Box from '@mui/material/Box';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import React, { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

import { Message } from '../../interfaces/Message';
import TypingIndicator from './TypingIndicator';

interface MessageBubbleProps {
    msg: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ msg }) => {
    const copiedRef = useRef<HTMLDivElement>(null);

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

    return (
        <Box
            className={`relative inline-block max-w-[70%] p-[0.6vw] rounded-[1vw] self-start text-left
        ${msg.role === 'user' ? 'bg-[#F5F6F7] text-gray-900' : 'bg-white'}
      `}
        >
            {msg.action === 'typing' ? (
                <TypingIndicator />
            ) : (
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
                                            onClick={() => copyToClipboard(String(children))}
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
                            return <ol className="list-decimal pl-5">{children}</ol>;
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
            )}
        </Box>
    );
};

export default MessageBubble;
