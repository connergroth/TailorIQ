import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, Bot, X, Minimize, Maximize } from "lucide-react";

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export default function ChatbotModal({ isOpen, onClose, title = "AI Resume Assistant" }: ChatbotModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'bot',
      content: "Hi there! I'm your resume assistant. I can help improve your resume content, provide insights on your experience, or answer questions about resume best practices. What would you like help with today?",
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    // Simulate AI response delay
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: "Thanks for your message. I'm currently in demo mode, but in the full version I can help you improve your resume with tailored suggestions.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };
  
  if (!isOpen) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-[425px] p-0 gap-0 shadow-xl border-gray-200"
        style={{ 
          backgroundColor: 'white',
          color: '#333',
          borderRadius: '0.5rem',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <DialogHeader 
          className="p-4 border-b border-gray-200 flex flex-row items-center justify-between"
          style={{ backgroundColor: 'white' }}
        >
          <DialogTitle className="text-gray-900">{title}</DialogTitle>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
              style={{ backgroundColor: 'white' }}
              onClick={toggleMinimize}
            >
              {isMinimized ? <Maximize className="h-4 w-4" /> : <Minimize className="h-4 w-4" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
              style={{ backgroundColor: 'white' }}
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        {!isMinimized && (
          <>
            <ScrollArea 
              className="h-[350px] px-4 py-3"
              style={{ backgroundColor: 'white' }}
            >
              <div className="space-y-4" style={{ backgroundColor: 'white' }}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                        message.role === 'user' ? 'bg-indigo-100 ml-2' : 'bg-gray-100 mr-2'
                      }`}>
                        {message.role === 'user' ? (
                          <User className="h-4 w-4 text-indigo-600" />
                        ) : (
                          <Bot className="h-4 w-4 text-gray-600" />
                        )}
                      </div>
                      <div className={`rounded-lg p-3 ${
                        message.role === 'user' 
                          ? 'bg-indigo-500 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <div className={`text-xs mt-1 ${
                          message.role === 'user' ? 'text-indigo-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3 flex items-center space-x-2 text-gray-500">
                      <div className="dot-typing"></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            <div 
              className="p-4 border-t border-gray-200"
              style={{ backgroundColor: 'white' }}
            >
              <div className="flex items-center space-x-2">
                <Input 
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message here... (e.g., 'Improve my summary' or 'How can I make my experience stand out?')"
                  className="flex-1 border-gray-200 text-gray-900"
                  style={{ backgroundColor: 'white' }}
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={inputValue.trim() === '' || isLoading}
                  size="icon"
                  className="bg-indigo-500 hover:bg-indigo-600 text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Tip: You can ask for resume improvements, insights on your experience, or resume best practices
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
} 