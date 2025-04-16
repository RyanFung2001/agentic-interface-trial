
import React from 'react';
import { Button } from "@/components/ui/button";
import { Settings, Info, X } from "lucide-react";

interface AgentHeaderProps {
  onReset: () => void;
}

const AgentHeader: React.FC<AgentHeaderProps> = ({ onReset }) => {
  return (
    <header className="flex items-center justify-between w-full p-4 border-b border-agent-border">
      <div className="flex items-center space-x-2">
        <div className="h-3 w-3 rounded-full bg-agent-primary animate-pulse-soft" />
        <h1 className="text-xl font-semibold">Agentic AI</h1>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button size="sm" variant="ghost" className="text-agent-foreground hover:bg-agent-muted">
          <Info className="h-4 w-4 mr-1" />
          Help
        </Button>
        <Button size="sm" variant="ghost" className="text-agent-foreground hover:bg-agent-muted">
          <Settings className="h-4 w-4 mr-1" />
          Settings
        </Button>
        <Button size="sm" variant="destructive" onClick={onReset}>
          <X className="h-4 w-4 mr-1" />
          Reset
        </Button>
      </div>
    </header>
  );
};

export default AgentHeader;
