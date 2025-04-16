
import { useState, useCallback } from 'react';
import { ChatMessageProps } from '@/components/ChatMessage';
import { useHairCareScenario } from './useHairCareScenario';
import { toast } from '@/hooks/use-toast';

export const useMessageHandler = () => {
  const [messages, setMessages] = useState<ChatMessageProps[]>([
    { role: 'agent', content: 'Hello! I am your agentic AI assistant. How can I help you today?' }
  ]);
  
  const hairCareScenario = useHairCareScenario();
  
  const handleSendMessage = useCallback((message: string) => {
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    hairCareScenario.setMessages(prev => [...prev, { role: 'user', content: message }]);
    
    if (message.toLowerCase().includes('classify hair care products')) {
      hairCareScenario.runHairCareScenario();
    } else if (message.toLowerCase() === 'yes' && 
              hairCareScenario.currentScenario === 'haircare' && 
              hairCareScenario.scenarioStep === 3) {
      hairCareScenario.processYesResponse();
    } else {
      hairCareScenario.setIsProcessingQuery(true);
      hairCareScenario.setIsThinking(true);
      hairCareScenario.setThoughts([]);
      
      const thoughtSequence = [
        "Analyzing user query: \"" + message + "\"",
        "Identifying key components and user intent...",
        "This looks like a general query. Let me process it...",
        "Planning the best approach to respond..."
      ];
      
      let thoughtIndex = 0;
      const thoughtInterval = setInterval(() => {
        if (thoughtIndex < thoughtSequence.length) {
          hairCareScenario.setThoughts(prev => [...prev, thoughtSequence[thoughtIndex]]);
          thoughtIndex++;
        } else {
          clearInterval(thoughtInterval);
          
          setTimeout(() => {
            hairCareScenario.setIsThinking(false);
            setMessages(prev => [
              ...prev, 
              { 
                role: 'agent', 
                content: `I've processed your request: "${message}". 
                
I can help you with various types of analyses, such as:
- Product classification and analysis
- Market research and trends
- Data pattern recognition
- Competitive insights

Would you like to try a specific type of analysis? You can try "Classify Hair Care Products based on ingredient, description, product hierarchy, and perform analysis" as an example.` 
              }
            ]);
            hairCareScenario.setIsProcessingQuery(false);
          }, 1000);
        }
      }, 1000);
    }
  }, [hairCareScenario]);
  
  const handleReset = useCallback(() => {
    setMessages([
      { role: 'agent', content: 'Hello! I am your agentic AI assistant. How can I help you today?' }
    ]);
    
    toast({
      title: "Session reset",
      description: "All conversations and processes have been cleared",
    });
  }, []);

  return {
    messages,
    handleSendMessage,
    handleReset,
    ...hairCareScenario
  };
};
