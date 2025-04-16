
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUp, Mic, MicOff } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isProcessing?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isProcessing = false }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isProcessing) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Here you would implement actual voice recording logic
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex w-full items-center space-x-2">
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="text-agent-foreground hover:bg-agent-muted"
        onClick={toggleRecording}
      >
        {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      </Button>
      
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask anything..."
        className="flex-1 bg-agent-muted text-agent-foreground border-agent-border focus-visible:ring-agent-primary"
        disabled={isProcessing}
      />
      
      <Button 
        type="submit"
        size="icon"
        disabled={!message.trim() || isProcessing}
        className="bg-agent-primary hover:bg-agent-primary/90 text-white"
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </form>
  );
};

export default ChatInput;
