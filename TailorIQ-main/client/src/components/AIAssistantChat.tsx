import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Send, User, CheckCircle, Loader2, LineChart, FileText } from 'lucide-react';
import { Resume } from '@shared/schema';
import { sendChatMessage } from "../lib/openaiService";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

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
  actionType?: 'suggestion' | 'info' | 'insight';
  actionContent?: any;
};

export default function AIAssistantChat({ resumeData, setResumeData, isOpen, onClose }: AIAssistantChatProps) {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: 1,
      sender: 'assistant',
      text: 'Hi there! I\'m your AI resume assistant. I can help improve your resume content, provide insights on your experience, or answer questions about resume best practices. What would you like help with today?',
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
      } else if (userIntent.type === 'insight') {
        await handleInsightRequest(inputText, placeholderId);
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
    type: 'improve' | 'question' | 'insight' | 'general'; 
    section?: string; 
    text?: string; 
  } => {
    const textLower = text.toLowerCase();
    
    // Check for improvement requests
    if (textLower.includes('improve') || textLower.includes('enhance') || textLower.includes('better') || textLower.includes('update') || textLower.includes('fix') || textLower.includes('optimize') || textLower.includes('rewrite')) {
      // Check which section is mentioned
      if (textLower.includes('summary') || textLower.includes('profile') || textLower.includes('objective')) {
        return { type: 'improve', section: 'summary', text: resumeData.summary };
      } else if (textLower.includes('experience') || textLower.includes('job') || textLower.includes('work')) {
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
        if (resumeData.experience.length > 0) {
          return { 
            type: 'improve', 
            section: 'experience[0]', 
            text: resumeData.experience[0].description || resumeData.experience[0].achievements.join('\n') 
          };
        }
      } else if (textLower.includes('skill')) {
        return { type: 'improve', section: 'skills', text: resumeData.skills.join(', ') };
      } else if (textLower.includes('education') || textLower.includes('degree') || textLower.includes('school')) {
        if (resumeData.education.length > 0) {
          return { type: 'improve', section: 'education', text: resumeData.education[0].additionalInfo || '' };
        }
      }
    }
    
    // Check for insight requests
    if (textLower.includes('analyze') || textLower.includes('insight') || textLower.includes('review') || textLower.includes('evaluate') || textLower.includes('assess') || textLower.includes('feedback')) {
      return { type: 'insight' };
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
        if (resumeData.experience[index]) {
          context = `Role: ${resumeData.experience[index].title} at ${resumeData.experience[index].company}`;
          sectionToImprove = 'experience description';
        }
      }
      
      if (!text || text.trim() === '') {
        throw new Error("No content to improve");
      }
      
      const messageHistory = messages
        .filter(msg => !msg.processing)
        .map(msg => ({
          role: msg.sender,
          content: msg.text
        }));
      
      // Use the client-side sendChatMessage function with improved prompting
      const response = await sendChatMessage(
        resumeData,
        [...messageHistory, {
          role: 'user',
          content: `Please improve this ${sectionToImprove} content: "${text}" ${context ? `Context: ${context}` : ''}`
        }],
        `Improve the ${sectionToImprove} content. For each improvement:
        1. Explain why the change makes the content more impactful
        2. Describe how it better highlights the candidate's achievements
        3. Explain how it improves ATS compatibility
        4. Provide specific examples of how the improved version is better
        Also provide a brief insight summary of how this improvement fits into the overall resume strategy.
        Return the improved version with detailed explanations for each change.`
      );
      
      // Update the placeholder message with the response
      setMessages(prev => prev.map(msg => 
        msg.id === placeholderId 
          ? { 
              ...msg, 
              text: `I've analyzed your ${sectionToImprove} and have a suggestion:\n\n"${response.suggestedActions?.[0]?.suggestedContent || response.message}"\n\n${response.suggestedActions?.[0]?.explanation || "This improvement helps make your content more impactful and professional."}`,
              processing: false,
              actionType: 'suggestion',
              actionContent: { 
                original: text, 
                improved: response.suggestedActions?.[0]?.suggestedContent || response.message, 
                section, 
                explanation: response.suggestedActions?.[0]?.explanation,
                insights: [{
                  title: "Strategic Impact",
                  content: response.suggestedActions?.[0]?.explanation || "This improvement aligns with industry best practices and enhances your resume's overall effectiveness."
                }]
              }
            } 
          : msg
      ));
      
    } catch (error) {
      console.error("Error improving text:", error);
      setMessages(prev => prev.map(msg => 
        msg.id === placeholderId 
          ? { ...msg, text: "I couldn't generate an improvement for this section. Could you provide more details about what you'd like to improve?", processing: false } 
          : msg
      ));
    }
  };

  // Handle insight generation requests
  const handleInsightRequest = async (text: string, placeholderId: number) => {
    try {
      const messageHistory = messages
        .filter(msg => !msg.processing)
        .map(msg => ({
          role: msg.sender,
          content: msg.text
        }));
      
      // Specific instruction for insights with improved prompting
      const response = await sendChatMessage(
        resumeData,
        [...messageHistory, {
          role: 'user',
          content: text
        }],
        `Analyze the resume and provide specific, actionable insights. For each insight:
        1. Explain why it's important for the candidate's target role
        2. Provide specific examples of how to implement the improvement
        3. Explain how it will impact the candidate's chances of getting interviews
        4. Include industry-specific best practices
        5. Explain how it improves ATS compatibility
        Focus on the overall impact, content gaps, and ATS optimization.`
      );
      
      // Update placeholder with insight message
      setMessages(prev => prev.map(msg => 
        msg.id === placeholderId 
          ? { 
              ...msg, 
              text: response.message,
              processing: false,
              actionType: 'insight',
              actionContent: { 
                insights: response.suggestedActions?.map(action => ({
                  title: action.targetSection || "Resume Insight",
                  content: action.suggestedContent || action.explanation || ""
                })) || []
              }
            } 
          : msg
      ));
    } catch (error) {
      console.error("Error generating insights:", error);
      setMessages(prev => prev.map(msg => 
        msg.id === placeholderId 
          ? { ...msg, text: "I couldn't generate insights at the moment. Please try a different question.", processing: false } 
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
          ? { ...msg, text: "I couldn't find an answer to your question. Could you try rephrasing it?", processing: false } 
          : msg
      ));
    }
  };

  // Handle general requests with improved prompting
  const handleGeneralRequest = async (text: string, placeholderId: number) => {
    try {
      const messageHistory = messages
        .filter(msg => !msg.processing)
        .map(msg => ({
          role: msg.sender,
          content: msg.text
        }));
        
      // Add the current user message
      messageHistory.push({
        role: 'user',
        content: text
      });
      
      // Use the client-side sendChatMessage function with improved prompting
      const response = await sendChatMessage(
        resumeData,
        messageHistory,
        `Provide concise, specific advice to improve the resume. For each suggestion:
        1. Explain why the change is important
        2. Provide specific examples of how to implement it
        3. Explain how it will impact the candidate's chances
        4. Include industry-specific best practices
        5. Explain how it improves ATS compatibility
        ${resumeData.targetJob ? `Consider the target job: ${resumeData.targetJob.title}${resumeData.targetJob.company ? ` at ${resumeData.targetJob.company}` : ''}. 
        Job Description: ${resumeData.targetJob.description}
        Make sure suggestions align with the job requirements and highlight relevant experience.` : ''}
        Also provide a brief insight summary of how these suggestions fit into the overall resume strategy.
        When suggesting improvements, explain why they matter and provide concrete examples.`
      );
      
      // Process the response
      if (response?.message) {
        // Check if the response contains actual suggestions or improvements
        const hasSuggestions = response.suggestedActions?.length > 0;
        const isGreetingOrPrompt = response.message.toLowerCase().includes('please provide') || 
                                  response.message.toLowerCase().includes('could you') ||
                                  response.message.toLowerCase().includes('what would you like');
        
        // Update the placeholder message with the AI response
        setMessages(prev => prev.map(msg => 
          msg.id === placeholderId 
            ? { 
                ...msg, 
                text: response.message,
                processing: false,
                actionType: hasSuggestions ? 'suggestion' : (isGreetingOrPrompt ? undefined : 'insight'),
                actionContent: hasSuggestions && response.suggestedActions ? {
                  original: response.suggestedActions[0].originalContent || "",
                  improved: response.suggestedActions[0].suggestedContent || "",
                  section: response.suggestedActions[0].targetSection || "",
                  explanation: response.suggestedActions[0].explanation || "",
                  insights: [{
                    title: "Strategic Impact",
                    content: response.suggestedActions[0].explanation || "These improvements align with industry best practices and enhance your resume's overall effectiveness."
                  }]
                } : (isGreetingOrPrompt ? undefined : {
                  insights: [{
                    title: "Strategic Impact",
                    content: response.message
                  }]
                })
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
          ? { ...msg, text: "I'm having trouble processing your request right now. Please try again later or ask a different question.", processing: false } 
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
      if (updatedResumeData.education.length > 0) {
        updatedResumeData.education[0].additionalInfo = improved;
      }
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

  // Generate resume insights
  const generateInsights = async () => {
    // Add a placeholder message for the assistant
    const placeholderId = Date.now();
    const placeholderMessage: MessageType = {
      id: placeholderId,
      sender: 'assistant',
      text: 'Analyzing your resume to provide insights...',
      timestamp: new Date(),
      processing: true,
    };
    setMessages(prev => [...prev, placeholderMessage]);
    setIsProcessing(true);
    
    try {
      await handleInsightRequest("Please provide a comprehensive analysis of my resume with insights on strengths, weaknesses, and areas for improvement", placeholderId);
    } catch (error) {
      console.error("Error generating insights:", error);
      setMessages(prev => prev.map(msg => 
        msg.id === placeholderId 
          ? { ...msg, text: "I couldn't generate insights at the moment. Please try again later.", processing: false } 
          : msg
      ));
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center">
            <Bot className="h-5 w-5 mr-2 text-primary" />
            AI Resume Assistant
          </DialogTitle>
          <DialogDescription>
            Get help improving your resume content and answering your questions
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
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
                    className={`p-4 rounded-lg ${
                      message.sender === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    } ${message.processing ? 'opacity-70' : ''}`}
                  >
                    {message.processing ? (
                      <div className="flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span>{message.text}</span>
                      </div>
                    ) : (
                      <div className="whitespace-pre-line">{message.text}</div>
                    )}
                    
                    {/* Action buttons for suggestions */}
                    {message.sender === 'assistant' && message.actionType === 'suggestion' && !message.processing && (
                      <div className="mt-4 flex justify-end">
                        {message.actionContent?.applied ? (
                          <div className="flex items-center text-green-600 text-sm">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Applied
                          </div>
                        ) : (
                          <Button 
                            size="sm" 
                            onClick={() => applySuggestion(message.id)}
                            className="text-xs bg-green-600 hover:bg-green-700"
                          >
                            Apply This Suggestion
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Special formatting for insight messages */}
                    {message.sender === 'assistant' && message.actionType === 'insight' && !message.processing && (
                      <div className="mt-4 space-y-3">
                        {message.actionContent.insights.length > 0 && (
                          <div className="border-t border-gray-200 pt-3 mt-3">
                            <div className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                              <LineChart className="h-4 w-4 mr-1" />
                              Insights Summary
                            </div>
                            {message.actionContent.insights.map((insight: any, idx: number) => (
                              <div key={idx} className="text-sm mt-3">
                                <span className="font-medium">{insight.title}: </span>
                                {insight.content}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message here... (e.g., 'Improve my summary' or 'How can I make my experience stand out?')"
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
            Tip: You can ask for resume improvements, insights on your experience, or resume best practices
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}