
import React from 'react';
import ThinkingVisualization from './ThinkingVisualization';
import ExecutionVisualization from './ExecutionVisualization';

interface AgentVisualizationsProps {
  thoughts: string[];
  executionSteps: any[];
  isThinking: boolean;
  isExecuting: boolean;
}

const AgentVisualizations: React.FC<AgentVisualizationsProps> = ({
  thoughts,
  executionSteps,
  isThinking,
  isExecuting
}) => {
  return (
    <div className="hidden lg:flex flex-col w-3/5">
      <div className="flex-1 overflow-hidden">
        <div className="grid grid-rows-2 h-full">
          <div className="p-4">
            <ThinkingVisualization 
              thoughts={thoughts}
              isThinking={isThinking}
            />
          </div>
          
          <div className="p-4 pt-0">
            <ExecutionVisualization 
              steps={executionSteps}
              isExecuting={isExecuting}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentVisualizations;
