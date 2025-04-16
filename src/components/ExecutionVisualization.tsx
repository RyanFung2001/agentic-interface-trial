
import React, { useEffect, useRef } from 'react';
import { Code, Terminal, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ExecutionType = 'code' | 'terminal' | 'web' | 'none';

export interface ExecutionStep {
  type: ExecutionType;
  content: string;
  status: 'running' | 'completed' | 'error';
  result?: string;
}

interface ExecutionVisualizationProps {
  steps: ExecutionStep[];
  isExecuting: boolean;
}

const ExecutionVisualization: React.FC<ExecutionVisualizationProps> = ({ 
  steps,
  isExecuting 
}) => {
  const executionEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to the bottom when new execution steps are added
  useEffect(() => {
    if (executionEndRef.current) {
      executionEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [steps]);
  
  const getIconByType = (type: ExecutionType) => {
    switch(type) {
      case 'code': return <Code className="h-4 w-4" />;
      case 'terminal': return <Terminal className="h-4 w-4" />;
      case 'web': return <Globe className="h-4 w-4" />;
      default: return null;
    }
  };
  
  const getStatusColor = (status: ExecutionStep['status']) => {
    switch(status) {
      case 'running': return 'text-yellow-400';
      case 'completed': return 'text-green-400';
      case 'error': return 'text-red-400';
      default: return '';
    }
  };

  const getStatusText = (status: ExecutionStep['status']) => {
    switch(status) {
      case 'running': return 'Running...';
      case 'completed': return 'Completed';
      case 'error': return 'Error';
      default: return '';
    }
  };

  return (
    <div className="w-full h-full rounded-lg bg-agent-execution-bg border border-agent-border p-4 overflow-hidden flex flex-col">
      <div className="flex items-center space-x-2 mb-3">
        <Terminal className="h-5 w-5 text-agent-secondary" />
        <h3 className="font-medium">Task Execution</h3>
        {isExecuting && (
          <div className="ml-auto px-2 py-1 bg-agent-muted bg-opacity-70 rounded text-xs flex items-center">
            <span className="animate-pulse-soft">Executing</span>
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {steps.map((step, index) => (
          <div 
            key={index}
            className={cn(
              "rounded bg-agent-muted bg-opacity-60 border border-agent-border text-sm animate-fade-in-down overflow-hidden"
            )}
          >
            <div className="flex items-center justify-between p-2 border-b border-agent-border">
              <div className="flex items-center space-x-2">
                <span className="p-1 rounded bg-agent-muted">{getIconByType(step.type)}</span>
                <span className="text-xs uppercase font-semibold">{step.type}</span>
              </div>
              <span className={cn("text-xs", getStatusColor(step.status))}>
                {getStatusText(step.status)}
              </span>
            </div>
            
            <div className="p-3 font-mono text-xs whitespace-pre-wrap">
              {step.content}
            </div>
            
            {step.result && (
              <div className="border-t border-agent-border p-3 font-mono text-xs bg-black bg-opacity-30 whitespace-pre-wrap">
                <div className="text-xs text-agent-foreground/60 mb-1">Result:</div>
                {step.result}
              </div>
            )}
          </div>
        ))}
        
        {steps.length === 0 && isExecuting && (
          <div className="p-3 rounded bg-agent-muted bg-opacity-40 border border-agent-border text-sm flex justify-center items-center h-20">
            <span>Preparing execution...</span>
          </div>
        )}
        
        {steps.length === 0 && !isExecuting && (
          <div className="p-3 text-sm text-agent-foreground/70 flex justify-center items-center h-full">
            <span>Agent will show task execution here</span>
          </div>
        )}
        
        <div ref={executionEndRef} />
      </div>
    </div>
  );
};

export default ExecutionVisualization;
