
import React from 'react';
import ChatMessage, { ChatMessageProps } from './ChatMessage';
import ChatInput from './ChatInput';

interface ChatContainerProps {
  messages: ChatMessageProps[];
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  onSendMessage,
  isProcessing
}) => {
  return (
    <div className="flex flex-col w-full lg:w-2/5 border-r border-agent-border">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((message, index) => (
          <ChatMessage 
            key={index}
            role={message.role}
            content={message.content}
          />
        ))}
      </div>
      
      <div className="p-4 border-t border-agent-border">
        <ChatInput 
          onSendMessage={onSendMessage}
          isProcessing={isProcessing}
        />
      </div>
    </div>
  );
};

export default ChatContainer;
