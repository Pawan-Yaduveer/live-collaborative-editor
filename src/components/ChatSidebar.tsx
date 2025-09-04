'use client';

import { useState, useRef, useEffect } from 'react';
import { Message } from '@/types';
import { Send, Bot, User, Search, Wand2, FileText } from 'lucide-react';
// import { useChat } from 'ai/react';

interface ChatSidebarProps {
  onApplyEdit?: (text: string) => void;
  onInsertText?: (text: string) => void;
  selectedText?: string;
  hasSelection?: boolean;
  width?: number;
}

export default function ChatSidebar({ onApplyEdit, onInsertText, selectedText, hasSelection, width }: ChatSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.content || 'Sorry, I could not process your request.',
          role: 'assistant',
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, aiMessage]);

        // Check for edit/insert instructions
        if (data.content?.includes('[EDIT]')) {
          const editText = data.content.replace(/\[EDIT\]/g, '').trim();
          onApplyEdit?.(editText);
        } else if (data.content?.includes('[INSERT]')) {
          const insertText = data.content.replace(/\[INSERT\]/g, '').trim();
          onInsertText?.(insertText);
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleQuickAction = async (action: string) => {
    if (action === 'search') {
      const query = prompt('Enter your search query:');
      if (query) {
        try {
          const response = await fetch('/api/agent/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query }),
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.shouldInsert) {
              onInsertText?.(data.text);
            } else {
              setInput(data.text);
            }
          }
        } catch (error) {
          console.error('Search error:', error);
        }
      }
      return;
    }

    // Check if text is selected
    if (!hasSelection || !selectedText) {
      const userMessage: Message = {
        id: Date.now().toString(),
        content: 'Please select some text first, then try the quick action.',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
      return;
    }

    const quickActions = {
      'grammar': `Please check and fix any grammar errors in this text: "${selectedText}"`,
      'summarize': `Please provide a summary of this text: "${selectedText}"`,
      'expand': `Please expand on this text with more details: "${selectedText}"`,
    };
    
    const message = quickActions[action as keyof typeof quickActions] || action;
    setInput(message);
    
    // Auto-send the message
    setTimeout(() => {
      const form = document.querySelector('form');
      if (form) {
        form.requestSubmit();
      }
    }, 100);
  };

  const quickActions = [
    { id: 'grammar', label: 'Fix Grammar', icon: Wand2 },
    { id: 'summarize', label: 'Summarize', icon: FileText },
    { id: 'expand', label: 'Expand', icon: FileText },
    { id: 'search', label: 'Web Search', icon: Search },
  ];

  return (
    <div className="w-full bg-gray-50 border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Bot size={20} />
          AI Assistant
        </h2>
        <p className="text-sm text-gray-600">
          Chat with AI or apply edits to your document
        </p>
        {width && (
          <p className="text-xs text-gray-400 mt-1">
            Width: {width}px
          </p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Actions</h3>
        {hasSelection && selectedText && (
          <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-600 font-medium">Selected text:</p>
            <p className="text-xs text-blue-800 truncate">{selectedText}</p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleQuickAction(id)}
              disabled={!hasSelection && id !== 'search'}
              className={`flex items-center gap-2 px-3 py-2 text-sm border rounded-lg transition-colors ${
                hasSelection || id === 'search'
                  ? 'text-gray-700 bg-white hover:bg-gray-100 border-gray-200'
                  : 'text-gray-400 bg-gray-50 border-gray-100 cursor-not-allowed'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <Bot size={32} className="mx-auto mb-2 opacity-50" />
            <p>Start a conversation with the AI assistant</p>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`flex gap-3 max-w-[80%] ${
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div
                className={`px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI to help with your document..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
