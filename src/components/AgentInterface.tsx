
import React, { useEffect } from 'react';
import AgentHeader from './AgentHeader';
import ChatContainer from './ChatContainer';
import AgentVisualizations from './AgentVisualizations';
import { useMessageHandler } from '@/hooks/useMessageHandler';

const AgentInterface: React.FC = () => {
  const {
    messages,
    thoughts,
    executionSteps,
    isThinking,
    isExecuting,
    isProcessingQuery,
    handleSendMessage,
    handleReset
  } = useMessageHandler();

  return (
    <div className="flex flex-col h-screen bg-agent-background text-agent-foreground">
      <AgentHeader onReset={handleReset} />
      
      <div className="flex flex-1 overflow-hidden">
        <ChatContainer 
          messages={messages}
          onSendMessage={handleSendMessage}
          isProcessing={isProcessingQuery}
        />
        
        <AgentVisualizations 
          thoughts={thoughts}
          executionSteps={executionSteps}
          isThinking={isThinking}
          isExecuting={isExecuting}
        />
      </div>
    </div>
  );
};

export default AgentInterface;
