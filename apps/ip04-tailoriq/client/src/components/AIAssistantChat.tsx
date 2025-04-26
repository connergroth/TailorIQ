import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Send, User, CheckCircle } from 'lucide-react';
import { Resume } from '@shared/schema';
import { getImprovement, sendChatMessage } from '@/lib/openai';
import { useToast } from "@/hooks/use-toast";

interface AIAssistantChatProps {
  resumeData: Resume;
  setResumeData: (data: Resume) => void;
  isOpen: boolean;
  onClose: () => void;
}

type MessageType = {
  id: number;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  processing?: boolean;
  actionType?: 'suggestion' | 'info';
  actionContent?: any;
};

export default function AIAssistantChat({ resumeData, setResumeData, isOpen, onClose }: AIAssistantChatProps) {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: 1,
      sender: 'assistant',
      text: 'Hi there! I\'m your resume assistant. I can help you improve sections of your resume or answer questions about resume writing. What would you like help with today?',
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom of chat on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;
    
    const userMessage: MessageType = {
      id: Date.now(),
      sender: 'user',
      text: inputText,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsProcessing(true);
    
    // Add a placeholder message for the assistant
    const placeholderId = Date.now() + 1;
    const placeholderMessage: MessageType = {
      id: placeholderId,
      sender: 'assistant',
      text: 'Thinking...',
      timestamp: new Date(),
      processing: true,
    };
    setMessages(prev => [...prev, placeholderMessage]);
    
    try {
      // Process the message to determine user intent
      const userIntent = analyzeUserIntent(inputText);
      
      if (userIntent.type === 'improve' && userIntent.section) {
        await handleImproveRequest(userIntent.section, userIntent.text || "", placeholderId);
      } else if (userIntent.type === 'question') {
        await handleQuestionRequest(inputText, placeholderId);
      } else {
        // General inquiry
        await handleGeneralRequest(inputText, placeholderId);
      }
    } catch (error) {
      console.error("Error processing message:", error);
      setMessages(prev => prev.map(msg => 
        msg.id === placeholderId 
          ? { ...msg, text: "Sorry, I encountered an error processing your request. Please try again.", processing: false } 
          : msg
      ));
      toast({
        title: "Error",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Process keystroke events (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Analyze user input to determine intent
  const analyzeUserIntent = (text: string): { 
    type: 'improve' | 'question' | 'general'; 
    section?: string; 
    text?: string; 
  } => {
    const textLower = text.toLowerCase();
    
    // Check for improvement requests
    if (textLower.includes('improve') || textLower.includes('enhance') || textLower.includes('better') || textLower.includes('update')) {
      // Check which section is mentioned
      if (textLower.includes('summary')) {
        return { type: 'improve', section: 'summary', text: resumeData.summary };
      } else if (textLower.includes('experience')) {
        // Find which experience item to improve
        for (let i = 0; i < resumeData.experience.length; i++) {
          const exp = resumeData.experience[i];
          if (textLower.includes(exp.company.toLowerCase()) || textLower.includes(exp.title.toLowerCase())) {
            return { 
              type: 'improve', 
              section: `experience[${i}]`, 
              text: resumeData.experience[i].description || resumeData.experience[i].achievements.join('\n') 
            };
          }
        }
        // Default to first experience if specific one not identified
        return { 
          type: 'improve', 
          section: 'experience[0]', 
          text: resumeData.experience[0].description || resumeData.experience[0].achievements.join('\n') 
        };
      } else if (textLower.includes('skill')) {
        return { type: 'improve', section: 'skills', text: resumeData.skills.join(', ') };
      } else if (textLower.includes('education')) {
        return { type: 'improve', section: 'education', text: resumeData.education[0].additionalInfo || '' };
      }
    }
    
    // Check for questions
    if (textLower.includes('how') || textLower.includes('what') || textLower.includes('why') || textLower.includes('when') || textLower.includes('?')) {
      return { type: 'question', text };
    }
    
    // Default to general
    return { type: 'general', text };
  };

  // Handle requests to improve resume sections
  const handleImproveRequest = async (section: string, text: string | undefined, placeholderId: number) => {
    try {
      let sectionToImprove = section;
      let context = '';
      
      // If targeting a specific experience/education entry, provide more context
      if (section.startsWith('experience[')) {
        const index = parseInt(section.match(/\d+/)?.[0] || '0');
        context = `Role: ${resumeData.experience[index].title} at ${resumeData.experience[index].company}`;
        sectionToImprove = 'experience description';
      }
      
      const response = await getImprovement(sectionToImprove, text || "", context || "");
      
      // Update the placeholder message with the response
      setMessages(prev => prev.map(msg => 
        msg.id === placeholderId 
          ? { 
              ...msg, 
              text: `I've analyzed your ${sectionToImprove} and have a suggestion:\n\n"${response.improved}"\n\n${response.explanation}`,
              processing: false,
              actionType: 'suggestion',
              actionContent: { original: text, improved: response.improved, section }
            } 
          : msg
      ));
      
    } catch (error) {
      console.error("Error improving text:", error);
      setMessages(prev => prev.map(msg => 
        msg.id === placeholderId 
          ? { ...msg, text: "Sorry, I couldn't generate an improvement at this time. Please try again later.", processing: false } 
          : msg
      ));
    }
  };

  // Handle question requests using the AI chat API
  const handleQuestionRequest = async (question: string, placeholderId: number) => {
    try {
      // Forward the question to the AI chat API, same as general requests
      await handleGeneralRequest(question, placeholderId);
    } catch (error) {
      console.error("Error responding to question:", error);
      setMessages(prev => prev.map(msg => 
        msg.id === placeholderId 
          ? { ...msg, text: "Sorry, I couldn't process your question at this time. Please try again later.", processing: false } 
          : msg
      ));
    }
  };

  // Handle general requests with the AI chat API
  const handleGeneralRequest = async (text: string, placeholderId: number) => {
    try {
      // Convert messages to the format expected by the API
      const messageHistory = messages
        .filter(msg => !msg.processing) // Filter out processing messages
        .map(msg => ({
          role: msg.sender,
          content: msg.text
        }));
        
      // Add the current user message
      messageHistory.push({
        role: 'user',
        content: text
      });
      
      // Send the chat request to the API
      const response = await sendChatMessage({
        resumeData,
        messages: messageHistory,
        instruction: "Focus on providing specific, actionable advice to improve the resume."
      });
      
      // Process the response
      if (response && response.message) {
        // Update the placeholder message with the AI response
        setMessages(prev => prev.map(msg => 
          msg.id === placeholderId 
            ? { 
                ...msg, 
                text: response.message,
                processing: false,
                actionType: response.suggestedActions && response.suggestedActions.length > 0 ? 'suggestion' : undefined,
                actionContent: response.suggestedActions && response.suggestedActions.length > 0 ? {
                  original: response.suggestedActions[0].originalContent,
                  improved: response.suggestedActions[0].suggestedContent,
                  section: response.suggestedActions[0].targetSection,
                  explanation: response.suggestedActions[0].explanation
                } : undefined
              } 
            : msg
        ));
      } else {
        throw new Error("Invalid response from AI chat service");
      }
    } catch (error) {
      console.error("Error responding to general request:", error);
      setMessages(prev => prev.map(msg => 
        msg.id === placeholderId 
          ? { ...msg, text: "Sorry, I couldn't process your request at this time. Please try again later.", processing: false } 
          : msg
      ));
    }
  };

  // Apply a suggestion to the resume data
  const applySuggestion = (messageId: number) => {
    const message = messages.find(msg => msg.id === messageId);
    if (!message || !message.actionContent) return;
    
    const { section, improved } = message.actionContent;
    
    // Create a deep copy of resumeData to avoid direct state mutation
    const updatedResumeData = JSON.parse(JSON.stringify(resumeData));
    
    // Handle different section types
    if (section === 'summary') {
      updatedResumeData.summary = improved;
    } else if (section.startsWith('experience[')) {
      const index = parseInt(section.match(/\d+/)?.[0] || '0');
      if (updatedResumeData.experience[index]) {
        // Determine if we're updating the description or achievements
        if (message.actionContent.original === updatedResumeData.experience[index].description) {
          updatedResumeData.experience[index].description = improved;
        } else {
          // Split by new lines to create separate achievements
          updatedResumeData.experience[index].achievements = improved.split('\n').filter((item: string) => item.trim() !== '');
        }
      }
    } else if (section === 'skills') {
      updatedResumeData.skills = improved.split(',').map((s: string) => s.trim()).filter((s: string) => s !== '');
    } else if (section === 'education') {
      updatedResumeData.education[0].additionalInfo = improved;
    }
    
    // Update the resume data
    setResumeData(updatedResumeData);
    
    // Update the message to show it was applied
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, actionContent: { ...msg.actionContent, applied: true } } 
        : msg
    ));
    
    // Add a confirmation message
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'assistant',
      text: 'I\'ve applied the changes to your resume. Is there anything else you\'d like help with?',
      timestamp: new Date()
    }]);
    
    toast({
      title: "Changes Applied",
      description: "The suggested improvements have been applied to your resume.",
      variant: "default"
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl h-[80vh] flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <div className="flex items-center">
            <Bot className="h-5 w-5 text-primary mr-2" />
            <h2 className="text-lg font-semibold">AI Resume Assistant</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`flex gap-3 max-w-[80%] ${
                  message.sender === 'user' 
                    ? 'flex-row-reverse' 
                    : 'flex-row'
                }`}
              >
                <div 
                  className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 ${
                    message.sender === 'user' 
                      ? 'bg-blue-100' 
                      : 'bg-green-100'
                  }`}
                >
                  {message.sender === 'user' ? (
                    <User className="h-4 w-4 text-blue-700" />
                  ) : (
                    <Bot className="h-4 w-4 text-green-700" />
                  )}
                </div>
                
                <div 
                  className={`p-3 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  } ${message.processing ? 'opacity-70' : ''}`}
                >
                  <div className="whitespace-pre-line">{message.text}</div>
                  
                  {/* Action buttons for suggestions */}
                  {message.sender === 'assistant' && message.actionType === 'suggestion' && (
                    <div className="mt-3 flex justify-end">
                      {message.actionContent?.applied ? (
                        <div className="flex items-center text-green-600 text-sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Applied
                        </div>
                      ) : (
                        <Button 
                          size="sm" 
                          onClick={() => applySuggestion(message.id)}
                          className="text-xs"
                        >
                          Apply This Suggestion
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message here... (e.g., 'Improve my summary' or 'How long should my resume be?')"
              className="resize-none"
              disabled={isProcessing}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={isProcessing || !inputText.trim()}
              size="icon"
              className="h-auto"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Tip: Try asking to improve specific sections or for resume advice
          </div>
        </div>
      </div>
    </div>
  );
}