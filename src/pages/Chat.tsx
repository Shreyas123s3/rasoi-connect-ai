
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Settings, MessageCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import EnhancedNavbar from '@/components/EnhancedNavbar';
import { callGeminiApi } from '@/services/geminiApi';

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m GemBot, your AI procurement assistant. I can help you find the best suppliers, suggest alternatives, and provide market insights. What would you like to know?',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('AIzaSyDpOZ-kclqMvnXBz7PIryEhKIZz3SuIZoM');
  const [language, setLanguage] = useState('en');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickQuestions = [
    "Find the cheapest paneer near me",
    "Suggest alternatives to onions this season",
    "How to store potatoes in summer?",
    "What are today's vegetable prices?",
    "Best suppliers for spices in Mumbai",
    "Bulk buying tips for small vendors"
  ];

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const botResponse = await callGeminiApi(input);
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponse,
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Sorry, I encountered an error. Please check your connection and try again.',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question) => {
    setInput(question);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFEBF] to-[#FDFDCR]">
      <EnhancedNavbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-black text-black mb-4 font-space">
              AI <span className="text-[#59D35D]">ASSISTANT</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto font-inter">
              Get smart procurement advice, find suppliers, and discover market insights with GemBot
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Chat Interface */}
            <motion.div 
              className="lg:col-span-3"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="bg-white/90 backdrop-blur-sm border-2 border-gray-200 h-[600px] flex flex-col rounded-2xl shadow-lg">
                <CardHeader className="border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#59D35D] p-2 rounded-full">
                        <Bot className="h-6 w-6 text-black" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-black text-black font-space">GemBot Assistant</CardTitle>
                        <p className="text-sm text-gray-600 font-semibold font-inter">Powered by Gemini AI</p>
                      </div>
                    </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="border-2 border-gray-300 rounded-full">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="rounded-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-black font-space">AI Assistant Settings</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-bold font-inter">Gemini API Key</Label>
                            <Input
                              type="password"
                              value={apiKey}
                              onChange={(e) => setApiKey(e.target.value)}
                              placeholder="Enter your Gemini API key"
                              className="font-mono text-sm rounded-full"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Default key provided. You can update it for production use.
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm font-bold font-inter">Language</Label>
                            <select 
                              value={language} 
                              onChange={(e) => setLanguage(e.target.value)}
                              className="w-full p-2 border-2 border-gray-200 rounded-full font-semibold"
                            >
                              <option value="en">English</option>
                              <option value="hi">हिंदी (Hindi)</option>
                              <option value="mr">मराठी (Marathi)</option>
                              <option value="ta">தமிழ் (Tamil)</option>
                            </select>
                          </div>
                          <Button className="w-full bg-[#59D35D] hover:bg-[#4BC44F] text-black font-bold rounded-full">
                            Save Settings
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                
                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map(message => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.type === 'bot' && (
                        <div className="bg-[#59D35D] p-2 rounded-full shrink-0">
                          <Bot className="h-4 w-4 text-black" />
                        </div>
                      )}
                      
                      <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : ''}`}>
                        <div
                          className={`p-4 rounded-2xl ${
                            message.type === 'user'
                              ? 'bg-[#4C9DB0] text-white ml-4'
                              : 'bg-gray-100 text-black mr-4'
                          }`}
                        >
                          <div className="whitespace-pre-line text-sm font-medium font-inter">
                            {message.content}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 px-4">
                          {message.timestamp}
                        </div>
                      </div>
                      
                      {message.type === 'user' && (
                        <div className="bg-[#4C9DB0] p-2 rounded-full shrink-0 order-3">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  
                  {isLoading && (
                    <motion.div 
                      className="flex gap-3"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <div className="bg-[#59D35D] p-2 rounded-full">
                        <Bot className="h-4 w-4 text-black" />
                      </div>
                      <div className="bg-gray-100 p-4 rounded-2xl">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm font-medium text-gray-600">GemBot is thinking...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </CardContent>
                
                {/* Input */}
                <div className="border-t border-gray-200 p-4">
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about suppliers, prices, or procurement tips..."
                      className="font-semibold rounded-full"
                      disabled={isLoading}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!input.trim() || isLoading}
                      className="bg-[#59D35D] hover:bg-[#4BC44F] text-black font-bold px-6 rounded-full"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Sidebar */}
            <motion.div 
              className="lg:col-span-1 space-y-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {/* Quick Questions */}
              <Card className="bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg font-black text-black flex items-center font-space">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Quick Questions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {quickQuestions.map((question, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      className="w-full text-left justify-start border-2 border-gray-200 hover:bg-gray-50 text-xs font-semibold p-3 h-auto rounded-full transition-all duration-300 hover:scale-105"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {question}
                    </motion.button>
                  ))}
                </CardContent>
              </Card>

              {/* AI Features */}
              <Card className="bg-gradient-to-br from-[#59D35D] to-[#4BC44F] border-0 rounded-2xl">
                <CardContent className="p-6">
                  <h3 className="text-lg font-black text-black mb-4 font-space">AI Capabilities</h3>
                  <div className="space-y-3 text-black text-sm">
                    {[
                      'Multilingual support',
                      'Real-time market data',
                      'Smart recommendations',
                      'Procurement insights'
                    ].map((item, index) => (
                      <motion.div 
                        key={index}
                        className="flex items-center"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                        <span className="font-semibold font-inter">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Usage Stats */}
              <Card className="bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg font-black text-black font-space">Today's Usage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-600 font-inter">Queries</span>
                    <span className="font-bold text-[#59D35D]">{messages.filter(m => m.type === 'user').length}/50</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-600 font-inter">Suppliers Found</span>
                    <span className="font-bold text-[#59D35D]">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-600 font-inter">Savings Found</span>
                    <span className="font-bold text-green-600">₹2,340</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
