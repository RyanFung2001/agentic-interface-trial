
import React, { useEffect, useRef } from 'react';
import { Brain, Database, Users, BarChart } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ThoughtType = 'general' | 'data' | 'crm' | 'analytics';

export interface Thought {
  content: string;
  type: ThoughtType;
}

interface ThinkingVisualizationProps {
  thoughts: Thought[];
  isThinking: boolean;
}

const ThinkingVisualization: React.FC<ThinkingVisualizationProps> = ({ 
  thoughts,
  isThinking
}) => {
  const thoughtsEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to the bottom when new thoughts are added
  useEffect(() => {
    if (thoughtsEndRef.current) {
      thoughtsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [thoughts]);

  // Get the appropriate icon and color based on thought type
  const getThoughtIcon = (type: ThoughtType) => {
    switch(type) {
      case 'data':
        return <Database className="h-4 w-4 text-blue-400" />;
      case 'crm':
        return <Users className="h-4 w-4 text-purple-400" />;
      case 'analytics':
        return <BarChart className="h-4 w-4 text-green-400" />;
      case 'general':
      default:
        return <Brain className="h-4 w-4 text-agent-primary" />;
    }
  };

  // Get emoji based on thought type
  const getThoughtEmoji = (type: ThoughtType) => {
    switch(type) {
      case 'data':
        return '💾';
      case 'crm':
        return '👥';
      case 'analytics':
        return '📊';
      case 'general':
      default:
        return '🧠';
    }
  };

  // Get background color class based on thought type
  const getThoughtBgClass = (type: ThoughtType) => {
    switch(type) {
      case 'data':
        return 'bg-blue-500 bg-opacity-10 border-blue-500 border-opacity-20';
      case 'crm':
        return 'bg-purple-500 bg-opacity-10 border-purple-500 border-opacity-20';
      case 'analytics':
        return 'bg-green-500 bg-opacity-10 border-green-500 border-opacity-20';
      case 'general':
      default:
        return 'bg-agent-muted bg-opacity-60 border-agent-border';
    }
  };

  return (
    <div className="w-full h-full rounded-lg bg-agent-muted border border-agent-border p-4 overflow-hidden flex flex-col">
      <div className="flex items-center space-x-2 mb-3">
        <Brain className="h-5 w-5 text-agent-primary" />
        <h3 className="font-medium">Agent Thoughts</h3>
        {isThinking && (
          <div className="flex items-center space-x-1 ml-auto">
            <span className="thinking-dot animate-thinking-dot-1"></span>
            <span className="thinking-dot animate-thinking-dot-2"></span>
            <span className="thinking-dot animate-thinking-dot-3"></span>
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {thoughts.map((thought, index) => (
          <div 
            key={index}
            className={cn(
              "p-3 rounded border text-sm animate-fade-in-down",
              getThoughtBgClass(thought.type),
              index === thoughts.length - 1 && isThinking && "relative overflow-hidden"
            )}
          >
            <div className="flex items-start">
              <span className="mr-2 mt-0.5">{getThoughtEmoji(thought.type)}</span>
              <span>{thought.content}</span>
            </div>
            {index === thoughts.length - 1 && isThinking && (
              <div className="absolute -inset-[1px] -translate-x-full bg-gradient-to-r from-transparent via-agent-primary/20 to-transparent animate-shimmer" />
            )}
          </div>
        ))}
        
        {thoughts.length === 0 && isThinking && (
          <div className="p-3 rounded bg-agent-muted bg-opacity-40 border border-agent-border text-sm flex justify-center items-center h-20">
            <span>Starting to think...</span>
          </div>
        )}
        
        {thoughts.length === 0 && !isThinking && (
          <div className="p-3 text-sm text-agent-foreground/70 flex justify-center items-center h-full">
            <span>Agent will show its thinking process here</span>
          </div>
        )}
        
        <div ref={thoughtsEndRef} />
      </div>
    </div>
  );
};

export default ThinkingVisualization;
