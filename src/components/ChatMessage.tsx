
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from '@/lib/utils';

// We'll try to import ReactMarkdown, but have a fallback if it fails
let ReactMarkdown: any;
let remarkBreaks: any;

try {
  ReactMarkdown = require('react-markdown');
  remarkBreaks = require('remark-breaks');
} catch (err) {
  console.error('Error loading markdown dependencies:', err);
}

export type MessageRole = 'user' | 'agent';

export interface ChatMessageProps {
  content: string;
  role: MessageRole;
  timestamp?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  role,
  timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}) => {
  const isUser = role === 'user';

  return (
    <div 
      className={cn(
        "flex w-full gap-4 py-4",
        isUser ? "justify-start" : "justify-start"
      )}
    >
      <Avatar className={cn(
        "h-8 w-8",
        isUser ? "bg-agent-muted" : "bg-agent-primary"
      )}>
        <AvatarImage src={isUser ? "/user-avatar.png" : "/agent-avatar.png"} />
        <AvatarFallback className={cn(
          "text-sm font-semibold",
          isUser ? "bg-agent-muted text-agent-foreground" : "bg-agent-primary text-white"
        )}>
          {isUser ? "U" : "A"}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-2">
        <div className="flex items-center">
          <span className="text-sm font-medium">
            {isUser ? "You" : "Agent"}
          </span>
          <span className="ml-2 text-xs text-gray-400">{timestamp}</span>
        </div>
        <div className={cn(
          "rounded-lg p-3 text-sm markdown-content",
          isUser ? "bg-agent-muted text-agent-foreground" : "bg-agent-primary bg-opacity-20 text-agent-foreground"
        )}>
          {ReactMarkdown ? (
            <ReactMarkdown remarkPlugins={[remarkBreaks]}>{content}</ReactMarkdown>
          ) : (
            // Fallback to basic text rendering if markdown libraries aren't available
            <div className="whitespace-pre-wrap">{content}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
