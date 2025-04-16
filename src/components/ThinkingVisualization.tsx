
import React, { useEffect, useRef } from 'react';
import { Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ThinkingVisualizationProps {
  thoughts: string[];
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
              "p-3 rounded bg-agent-muted bg-opacity-60 border border-agent-border text-sm animate-fade-in-down",
              index === thoughts.length - 1 && isThinking && "relative overflow-hidden"
            )}
          >
            {thought}
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
