import React, { useState } from 'react';
import { Bot, Send, X, Minimize2, Maximize2 } from 'lucide-react';

interface GeminiAssistantProps {
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

const GeminiAssistant: React.FC<GeminiAssistantProps> = ({
  isMinimized = false,
  onToggleMinimize
}) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: 'Hello! I\'m your Gemini AI coding assistant. I can help you with code explanations, debugging, optimization suggestions, and more. What would you like to know?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response (replace with actual Gemini API call)
    setTimeout(() => {
      const assistantMessage = {
        id: messages.length + 2,
        type: 'assistant',
        content: 'I understand you\'re asking about: "' + inputMessage + '". This is a placeholder response. In the actual implementation, this would connect to the Gemini API to provide intelligent coding assistance.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  if (isMinimized) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-750 transition-colors"
        onClick={onToggleMinimize}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-medium text-white">Gemini AI</div>
            <div className="text-xs text-gray-400">Click to expand</div>
          </div>
          <Maximize2 className="w-4 h-4 text-gray-400 ml-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg flex flex-col h-96">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-medium text-white">Gemini AI Assistant</div>
            <div className="text-xs text-gray-400">Powered by Google Gemini</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onToggleMinimize}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-100'
                }`}
            >
              <div className="text-sm">{message.content}</div>
              <div className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-700 text-gray-100 rounded-lg p-3">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-700">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask me anything about your code..."
            className="flex-1 bg-gray-700 text-white placeholder-gray-400 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isTyping}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-2 rounded-md transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default GeminiAssistant;


