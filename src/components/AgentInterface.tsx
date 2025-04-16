
import React, { useState, useCallback } from 'react';
import ChatMessage, { ChatMessageProps } from './ChatMessage';
import ChatInput from './ChatInput';
import ThinkingVisualization from './ThinkingVisualization';
import ExecutionVisualization, { ExecutionStep } from './ExecutionVisualization';
import AgentHeader from './AgentHeader';
import { toast } from '../hooks/use-toast';

const AgentInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageProps[]>([
    { role: 'agent', content: 'Hello! I am your agentic AI assistant. How can I help you today?' }
  ]);
  const [thoughts, setThoughts] = useState<string[]>([]);
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isProcessingQuery, setIsProcessingQuery] = useState(false);

  const handleSendMessage = useCallback((message: string) => {
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    setIsProcessingQuery(true);
    
    // Simulate agent thinking
    setIsThinking(true);
    setThoughts([]);
    
    // Simulate thought process
    const thoughtSequence = [
      "Analyzing user query: \"" + message + "\"",
      "Identifying key components and user intent...",
      "This looks like a task that requires code execution...",
      "Planning the best approach to solve this problem...",
      "I'll need to break this down into steps..."
    ];
    
    let thoughtIndex = 0;
    const thoughtInterval = setInterval(() => {
      if (thoughtIndex < thoughtSequence.length) {
        setThoughts(prev => [...prev, thoughtSequence[thoughtIndex]]);
        thoughtIndex++;
      } else {
        clearInterval(thoughtInterval);
        
        // After thinking, start execution
        setTimeout(() => {
          setIsThinking(false);
          simulateExecution(message);
        }, 1000);
      }
    }, 1500);
  }, []);
  
  const simulateExecution = useCallback((query: string) => {
    setIsExecuting(true);
    setExecutionSteps([]);
    
    // Simulate execution steps
    setTimeout(() => {
      setExecutionSteps([
        {
          type: 'code',
          content: 'import pandas as pd\nimport numpy as np\n\n# Loading data for analysis\ndf = pd.read_csv("data.csv")\nprint(df.head())',
          status: 'running'
        }
      ]);
      
      setTimeout(() => {
        setExecutionSteps(prev => [
          {
            ...prev[0],
            status: 'completed',
            result: '   Column1  Column2  Column3\n0        1        2        3\n1        4        5        6\n2        7        8        9'
          },
          {
            type: 'terminal',
            content: 'python analyze.py --input data.csv --output results.json',
            status: 'running'
          }
        ]);
        
        setTimeout(() => {
          setExecutionSteps(prev => [
            ...prev.slice(0, 1),
            {
              ...prev[1],
              status: 'completed',
              result: 'Analysis complete. Results saved to results.json'
            },
            {
              type: 'web',
              content: 'Searching for relevant documentation...',
              status: 'running'
            }
          ]);
          
          setTimeout(() => {
            setExecutionSteps(prev => [
              ...prev.slice(0, 2),
              {
                ...prev[2],
                status: 'completed',
                result: 'Found 3 relevant resources:\n1. Documentation for pandas\n2. API reference for numpy\n3. Stack Overflow thread with similar query'
              }
            ]);
            
            // Finish the execution
            setTimeout(() => {
              setIsExecuting(false);
              
              // Add agent response
              setMessages(prev => [
                ...prev, 
                { 
                  role: 'agent', 
                  content: `I've analyzed your request: "${query}"\n\nI ran a Python script to analyze the data, processed it through a terminal command, and found relevant documentation. The analysis suggests that the data follows the pattern you were asking about. Would you like me to explain the results in more detail or proceed with a different approach?` 
                }
              ]);
              
              setIsProcessingQuery(false);
              
              toast({
                title: "Task completed",
                description: "The agent has finished processing your request",
              });
            }, 1000);
          }, 2000);
        }, 2000);
      }, 2000);
    }, 1000);
  }, []);
  
  const handleReset = useCallback(() => {
    setMessages([
      { role: 'agent', content: 'Hello! I am your agentic AI assistant. How can I help you today?' }
    ]);
    setThoughts([]);
    setExecutionSteps([]);
    setIsThinking(false);
    setIsExecuting(false);
    setIsProcessingQuery(false);
    
    toast({
      title: "Session reset",
      description: "All conversations and processes have been cleared",
    });
  }, []);

  return (
    <div className="flex flex-col h-screen bg-agent-background text-agent-foreground">
      <AgentHeader onReset={handleReset} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel: Chat */}
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
              onSendMessage={handleSendMessage}
              isProcessing={isProcessingQuery}
            />
          </div>
        </div>
        
        {/* Right panel: Agent processes */}
        <div className="hidden lg:flex flex-col w-3/5">
          <div className="flex-1 overflow-hidden">
            <div className="grid grid-rows-2 h-full">
              {/* Thinking visualization */}
              <div className="p-4">
                <ThinkingVisualization 
                  thoughts={thoughts}
                  isThinking={isThinking}
                />
              </div>
              
              {/* Execution visualization */}
              <div className="p-4 pt-0">
                <ExecutionVisualization 
                  steps={executionSteps}
                  isExecuting={isExecuting}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentInterface;
