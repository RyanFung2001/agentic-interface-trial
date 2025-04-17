import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';

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
          "rounded-lg p-3 text-sm",
          isUser ? "bg-agent-muted text-agent-foreground" : "bg-agent-primary bg-opacity-20 text-agent-foreground"
        )}>
          <ReactMarkdown remarkPlugins={[remarkBreaks]}>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
