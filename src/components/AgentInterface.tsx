
import React, { useState, useCallback, useEffect, useRef } from 'react';
import ChatMessage, { ChatMessageProps } from './ChatMessage';
import ChatInput from './ChatInput';
import ThinkingVisualization from './ThinkingVisualization';
import ExecutionVisualization, { ExecutionStep } from './ExecutionVisualization';
import AgentHeader from './AgentHeader';
import { toast } from '../hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AgentInterface: React.FC = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null); // Moved inside component
  
  const [messages, setMessages] = useState<ChatMessageProps[]>([
    { role: 'agent', content: 'Hello! I am your agentic AI assistant. How can I help you today?' }
  ]);
  const [thoughts, setThoughts] = useState<string[]>([]);
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isProcessingQuery, setIsProcessingQuery] = useState(false);
  const [currentScenario, setCurrentScenario] = useState<string | null>(null);
  const [scenarioStep, setScenarioStep] = useState(0);
  const thoughtTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const executionTimeoutRef = useRef<NodeJS.Timeout | null>(null);


   useEffect(() => {
     // Auto-scroll to the latest message when messages array changes
     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messages]);

  const runHairCareScenario = useCallback(() => {
    setCurrentScenario('haircare');
    setScenarioStep(1);
    setIsProcessingQuery(true);
    setIsThinking(true);
    setThoughts([]);
    
    const initialThoughts = [
      "Analyzing user request about hair care product classification...",
      "This requires data analysis based on ingredients, descriptions, product hierarchy...",
      "I need to check if we have relevant data available in our system.",
      "Let me execute a data agent to search for relevant datasets."
    ];
    
    let thoughtIndex = 0;
    const thoughtInterval = setInterval(() => {
      if (thoughtIndex < initialThoughts.length) {
        setThoughts(prev => [...prev, initialThoughts[thoughtIndex]]);
        thoughtIndex++;
      } else {
        clearInterval(thoughtInterval);
        
        setTimeout(() => {
          executeDataQuery();
        }, 1000);
      }
    }, 1500);
  }, []);

  const executeDataQuery = useCallback(() => {
    setIsExecuting(true);
    setExecutionSteps([]);
    
    setTimeout(() => {
      setExecutionSteps([
        {
          type: 'code',
          content: 'import pandas as pd\n\n# Connect to product database\nfrom db_connector import DBConnector\n\ndb = DBConnector()\nquery = """\n  SELECT product_name, ingredients, description, category \n  FROM products \n  WHERE category LIKE \'%hair%\' \n  LIMIT 100\n"""\n\nresults = db.execute_query(query)\ndf = pd.DataFrame(results)\nprint(df.head())',
          status: 'running'
        }
      ]);
      
      setTimeout(() => {
        setExecutionSteps(prev => [
          {
            ...prev[0],
            status: 'completed',
            result: 'Database query executed. No relevant hair care product data found in primary database.'
          }
        ]);
        
        thoughtTimeoutRef.current = setTimeout(() => {
          setIsExecuting(false);
          setIsThinking(true);
          setScenarioStep(2);
          
          const noDataThoughts = [
            "No direct hair care product data found in our primary database.",
            "Let me check the AI team's insight bank which might contain previous analyses.",
            "Querying the AI team blob storage for any relevant classification or tagging results."
          ];
          
          let thoughtIndex = 0;
          const thoughtInterval = setInterval(() => {
            if (thoughtIndex < noDataThoughts.length) {
              setThoughts(prev => [...prev, noDataThoughts[thoughtIndex]]);
              thoughtIndex++;
            } else {
              clearInterval(thoughtInterval);
              
              executionTimeoutRef.current = setTimeout(() => {
                setIsThinking(false);
                queryBlobStorage();
              }, 1000);
            }
          }, 1500);
        }, 2000);
      }, 2500);
    }, 1000);
  }, []);

  const queryBlobStorage = useCallback(() => {
    setIsExecuting(true);
    setExecutionSteps([]);
    
    setTimeout(() => {
      setExecutionSteps([
        {
          type: 'terminal',
          content: 'az storage blob list --container-name ai-team-insights --account-name aiteamstore --prefix "haircare/" --query "[].name" -o tsv | grep "classification"',
          status: 'running'
        }
      ]);
      
      setTimeout(() => {
        setExecutionSteps(prev => [
          {
            ...prev[0],
            status: 'completed',
            result: 'haircare/2024-03-15_hair_product_classification.parquet\nhaircare/2024-01-20_ingredient_classification.parquet'
          },
          {
            type: 'code',
            content: 'import pandas as pd\n\n# Load the found classification data\ndf_hair = pd.read_parquet("haircare/2024-03-15_hair_product_classification.parquet")\nprint(df_hair.head())',
            status: 'running'
          }
        ]);
        
        setTimeout(() => {
          setExecutionSteps(prev => [
            ...prev.slice(0, 1),
            {
              ...prev[1],
              status: 'completed',
              result: '   product_id              product_name  \\\n0   HAR0012       Moisture Shampoo   \n1   HAR0013    Volume Boost Conditioner   \n2   HAR0014       Repair Hair Mask   \n3   HAR0015     Anti-Frizz Serum   \n4   HAR0016     Curl Defining Cream   \n\n                                        ingredients                            tags  \n0  Water, Sodium Lauryl Sulfate, Cocamidopropyl...  [moisturizing, gentle, sulfate-free]  \n1  Water, Cetearyl Alcohol, Behentrimonium Chlo...  [volumizing, strengthening, protein-rich]  \n2  Water, Cetearyl Alcohol, Cetyl Esters, Glycerin  [repairing, deep conditioning, damaged hair]  \n3  Cyclopentasiloxane, Dimethiconol, Argan Oil,...  [smoothing, anti-humidity, silicone-based]  \n4  Water, Glycerin, Polyquaternium-11, Jojoba O...  [curl enhancing, defining, medium hold]'
            }
          ]);
          
          setTimeout(() => {
            setIsExecuting(false);
            setIsThinking(true);
            setScenarioStep(3);
            
            const dataFoundThoughts = [
              "I found a previous hair care product classification dataset in the AI team's storage.",
              "The dataset contains product names, ingredients, and tags that categorize each product.",
              "This looks exactly like what we need for the analysis.",
              "Would you like to use these results for the analysis you requested?"
            ];
            
            let thoughtIndex = 0;
            const thoughtInterval = setInterval(() => {
              if (thoughtIndex < dataFoundThoughts.length) {
                setThoughts(prev => [...prev, dataFoundThoughts[thoughtIndex]]);
                thoughtIndex++;
              } else {
                clearInterval(thoughtInterval);
                
                setIsThinking(false);
                setMessages(prev => [
                  ...prev,
                  { 
                    role: 'agent', 
                    content: `I found an existing hair care product classification dataset in our AI team's storage. It contains product IDs, names, ingredients, and tags that categorize each product based on their properties and functions. Would you like me to use this dataset for further analysis?`
                  }
                ]);
                setIsProcessingQuery(false);
              }
            }, 1500);
          }, 2000);
        }, 2500);
      }, 2500);
    }, 1000);
  }, []);

  const processYesResponse = useCallback(() => {
    setIsProcessingQuery(true);
    setIsThinking(true);
    setThoughts([]);
    setScenarioStep(4);
    
    const analyticsThoughts = [
      "Great, I'll use the existing classification data for analysis.",
      "Let me query our analytics agent and CRM agent to gather additional insights.",
      "The analytics agent can provide usage patterns and performance metrics.",
      "The CRM agent can provide customer feedback and satisfaction data.",
      "Combining these insights with the classification data will provide actionable recommendations."
    ];
    
    let thoughtIndex = 0;
    const thoughtInterval = setInterval(() => {
      if (thoughtIndex < analyticsThoughts.length) {
        setThoughts(prev => [...prev, analyticsThoughts[thoughtIndex]]);
        thoughtIndex++;
      } else {
        clearInterval(thoughtInterval);
        
        setIsThinking(false);
        runComplexAnalysis();
      }
    }, 1500);
  }, []);

  const runComplexAnalysis = useCallback(() => {
    setIsExecuting(true);
    setExecutionSteps([]);
    
    setTimeout(() => {
      setExecutionSteps([
        {
          type: 'code',
          content: '# Query Analytics Agent\nfrom agents import AnalyticsAgent\n\nanalytics = AnalyticsAgent()\nusage_data = analytics.get_product_usage_metrics(product_ids=list(df_hair["product_id"]))\n\n# Merge with classification data\nmerged_df = pd.merge(df_hair, usage_data, on="product_id")\nprint("Data merged with analytics successfully")',
          status: 'running'
        }
      ]);
      
      setTimeout(() => {
        setExecutionSteps(prev => [
          {
            ...prev[0],
            status: 'completed',
            result: 'Data merged with analytics successfully\nProcessing 243 products with usage metrics...'
          },
          {
            type: 'terminal',
            content: 'crm-agent fetch --customer-feedback --product-ids HAR0012,HAR0013,HAR0014,HAR0015,HAR0016 --sentiment-analysis',
            status: 'running'
          }
        ]);
        
        setTimeout(() => {
          setExecutionSteps(prev => [
            ...prev.slice(0, 1),
            {
              ...prev[1],
              status: 'completed',
              result: 'Customer feedback retrieved.\nSentiment analysis complete.\nGenerating cross-correlation matrix between ingredients and customer satisfaction...'
            },
            {
              type: 'code',
              content: 'import matplotlib.pyplot as plt\nimport seaborn as sns\n\n# Analyzing ingredient correlations\ningredient_corr = data_processor.analyze_ingredient_correlations(merged_df)\n\n# Generating market segmentation\nsegments = market_analyzer.generate_segments(merged_df, n_clusters=5)\n\n# Preparing visualization\nplt.figure(figsize=(12, 8))\nsns.heatmap(ingredient_corr, annot=True, cmap="coolwarm")\nplt.title("Ingredient to Performance Correlation")\nplt.tight_layout()\nplt.savefig("ingredient_correlation.png")\n\nprint("Analysis complete.")',
              status: 'running'
            }
          ]);
          
          setTimeout(() => {
            const chartData = [
              { name: 'Moisturizing', satisfaction: 4.2, repurchase: 68, review_count: 1245 },
              { name: 'Volumizing', satisfaction: 3.8, repurchase: 52, review_count: 876 },
              { name: 'Repairing', satisfaction: 4.5, repurchase: 72, review_count: 1542 },
              { name: 'Anti-Frizz', satisfaction: 4.0, repurchase: 65, review_count: 1120 },
              { name: 'Curl Define', satisfaction: 4.3, repurchase: 70, review_count: 980 },
            ];
            
            setExecutionSteps(prev => [
              ...prev.slice(0, 2),
              {
                ...prev[2],
                status: 'completed',
                result: 'Analysis complete.\nGenerated 3 key visualizations and insight report.\n\nProduct Category Performance Metrics:'
              }
            ]);
            
            setTimeout(() => {
              setIsExecuting(false);
              setMessages(prev => [
                ...prev,
                { 
                  role: 'agent', 
                  content: `# Hair Care Product Analysis Report

## Executive Summary
Based on our analysis of the hair care product classification dataset, combined with analytics and customer feedback, we've identified key trends and opportunities.

## Key Findings

1. **Product Category Performance**
   - **Highest Satisfaction**: Repairing products (4.5/5)
   - **Highest Repurchase Rate**: Repairing products (72%)
   - **Most Reviewed**: Repairing products (1,542 reviews)

2. **Ingredient Analysis**
   - Products containing natural oils showed 23% higher satisfaction scores
   - Sulfate-free formulations had 18% higher repurchase rates
   - Protein-rich products performed best in the volumizing category

3. **Market Gaps & Opportunities**
   - Underserved segment: Products for combination hair types
   - Ingredient opportunity: Plant-based protein alternatives
   - Format gap: Waterless formulations

## Recommendations

1. **Product Development Focus Areas**
   - Develop repairing products with natural oils and protein
   - Expand sulfate-free options across all categories
   - Create hybrid products addressing multiple hair concerns

2. **Marketing Strategies**
   - Highlight natural ingredients in product packaging and promotion
   - Target customers with combination hair types
   - Emphasize sustainability for waterless formulations

Would you like a deeper analysis of any specific area from this report?` 
                }
              ]);
              
              setTimeout(() => {
                setMessages(prev => [
                  ...prev,
                  { 
                    role: 'agent', 
                    content: "**Demo End**: This concludes the demo of the AI agent interface. You can reset the conversation using the button in the header, or continue asking questions." 
                  }
                ]);
              }, 2000);
              
              setIsProcessingQuery(false);
              setCurrentScenario(null);
              setScenarioStep(0);
              
              toast({
                title: "Analysis complete",
                description: "Hair care product analysis report generated",
              });
            }, 3000);
          }, 2500);
        }, 2500);
      }, 2500);
    }, 1000);
  }, []);

  const handleSendMessage = useCallback((message: string) => {
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    
    if (message.toLowerCase().includes('classify hair care products')) {
      runHairCareScenario();
    } else if (message.toLowerCase() === 'yes' && currentScenario === 'haircare' && scenarioStep === 3) {
      processYesResponse();
    } else {
      setIsProcessingQuery(true);
      setIsThinking(true);
      setThoughts([]);
      
      const thoughtSequence = [
        "Analyzing user query: \"" + message + "\"",
        "Identifying key components and user intent...",
        "This looks like a general query. Let me process it...",
        "Planning the best approach to respond..."
      ];
      
      let thoughtIndex = 0;
      const thoughtInterval = setInterval(() => {
        if (thoughtIndex < thoughtSequence.length) {
          setThoughts(prev => [...prev, thoughtSequence[thoughtIndex]]);
          thoughtIndex++;
        } else {
          clearInterval(thoughtInterval);
          
          setTimeout(() => {
            setIsThinking(false);
            setMessages(prev => [
              ...prev, 
              { 
                role: 'agent', 
                content: `I've processed your request: "${message}".

**I can help you with various types of analyses, such as:**

- Product classification and analysis
- Market research and trends
- Data pattern recognition
- Competitive insights

**Would you like to try a specific type of analysis?**

You can try "Classify Hair Care Products based on ingredient, description, product hierarchy, and perform analysis" as an example.`
              }
            ]);
            setIsProcessingQuery(false);
          }, 1000);
        }
      }, 1000);
    }
  }, [runHairCareScenario, processYesResponse, currentScenario, scenarioStep]);
  
  const handleReset = useCallback(() => {
    setMessages([
      { role: 'agent', content: 'Hello! I am your agentic AI assistant. How can I help you today?' }
    ]);
    setThoughts([]);
    setExecutionSteps([]);
    setIsThinking(false);
    setIsExecuting(false);
    setIsProcessingQuery(false);
    setCurrentScenario(null);
    setScenarioStep(0);
    
    toast({
      title: "Session reset",
      description: "All conversations and processes have been cleared",
    });
  }, []);

  return (
    <div className="flex flex-col h-screen bg-agent-background text-agent-foreground">
      <AgentHeader onReset={handleReset} />
      
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col w-full lg:w-2/5 border-r border-agent-border">
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map((message, index) => (
              <ChatMessage 
                key={index}
                role={message.role}
                content={message.content}
              />
            ))}
            <div ref={messagesEndRef} /> {/* Placeholder for scroll target */}
          </div>
          
          <div className="p-4 border-t border-agent-border">
            <ChatInput 
              onSendMessage={handleSendMessage}
              isProcessing={isProcessingQuery}
            />
          </div>
        </div>
        
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
      </div>
    </div>
  );
};

export default AgentInterface;
