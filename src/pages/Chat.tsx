
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Settings, MessageCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';

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
      // Mock API call - Replace with actual Gemini API implementation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const botResponse = generateMockResponse(input);
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponse,
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Sorry, I encountered an error. Please check your API key settings and try again.',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockResponse = (query) => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('paneer') || lowerQuery.includes('cheese')) {
      return `Based on current market data, here are the best paneer suppliers near you:

🥛 **Fresh Dairy Co.** - ₹280/kg (2.1km away)
• FSSAI verified, 4.8⭐ rating
• Same-day delivery available
• Join bulk order to save 12%

🥛 **Mumbai Milk Center** - ₹290/kg (1.8km away)  
• Organic certified, 4.7⭐ rating
• Pickup available in 30 mins
• Fresh batch arrives daily at 6 AM

💡 **Tip**: Paneer prices typically drop by 8-10% after 6 PM. Consider evening purchases for better deals!

Would you like me to connect you with any of these suppliers?`;
    }
    
    if (lowerQuery.includes('onion') || lowerQuery.includes('alternative')) {
      return `Great question! Here are excellent onion alternatives during price spikes:

🧄 **Shallots** - ₹45/kg (vs onions at ₹65/kg)
• Similar flavor profile, slightly sweeter
• Available at Spice Garden Market

🧄 **Leeks** - ₹40/kg 
• Milder taste, works great in curries
• Green Valley Suppliers has fresh stock

🧄 **Garlic + Ginger paste** - ₹35/kg
• Cost-effective flavor base
• Multiple suppliers available nearby

💰 **Cost Saving Tip**: Mix 60% shallots + 40% regular onions to save 25% without compromising taste!

Current onion forecast: Prices expected to drop 15% in next 5 days. Consider waiting if possible.`;
    }
    
    if (lowerQuery.includes('potato') || lowerQuery.includes('storage') || lowerQuery.includes('summer')) {
      return `Here's the best way to store potatoes during Mumbai summers:

🌡️ **Temperature Control**:
• Keep between 10-15°C (use basement/coolest room)
• Avoid direct sunlight and heat sources
• Use mesh bags for air circulation

💧 **Humidity Management**:
• Store in dry, well-ventilated area
• Avoid plastic bags (causes moisture buildup)
• Check weekly and remove sprouted ones

📦 **Storage Tips**:
• Don't store with onions (both spoil faster)
• Paper bags work better than plastic
• Keep away from windows and cooking areas

⚡ **Pro Tip**: Buy in smaller quantities during summer (15-20kg max) to reduce spoilage. Current potato prices are stable at ₹18/kg - good time to buy!

Need help finding suppliers with proper cold storage facilities?`;
    }
    
    return `I understand you're asking about "${query}". Here are some helpful insights:

📊 **Current Market Overview**:
• 25+ verified suppliers in your area
• Average delivery time: 2-3 hours
• Best prices typically between 6-8 PM

🎯 **My Recommendations**:
1. Check our supplier marketplace for competitive prices
2. Join bulk orders to save 15-30%
3. Set price alerts for your frequently used items
4. Consider alternative products during price spikes

💬 **How I can help you further**:
• Find specific suppliers and compare prices
• Suggest seasonal alternatives and substitutions  
• Provide storage and procurement tips
• Alert you about market trends and opportunities

Feel free to ask more specific questions about suppliers, prices, or procurement strategies!`;
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
    <div className="min-h-screen bg-gradient-to-br from-lemon to-wisteria">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-black text-black mb-4">
              AI <span className="text-[#59D35D]">ASSISTANT</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Get smart procurement advice, find suppliers, and discover market insights with GemBot
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Chat Interface */}
            <div className="lg:col-span-3">
              <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/40 shadow-xl h-[600px] flex flex-col">
                <CardHeader className="border-b border-gray-200/50 bg-gradient-to-r from-lemon/20 to-wisteria/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#59D35D] p-2 rounded-full">
                        <Bot className="h-6 w-6 text-black" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-black text-black">GemBot Assistant</CardTitle>
                        <p className="text-sm text-gray-600 font-semibold">Powered by Gemini AI</p>
                      </div>
                    </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="border-2 border-wisteria/30 hover:bg-wisteria/10">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gradient-to-br from-lemon/30 to-wisteria/30 backdrop-blur-sm border-2 border-white/40">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-black">AI Assistant Settings</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-bold">Gemini API Key</Label>
                            <Input
                              type="password"
                              value={apiKey}
                              onChange={(e) => setApiKey(e.target.value)}
                              placeholder="Enter your Gemini API key"
                              className="font-mono text-sm border-2 border-wisteria/20 focus:border-wisteria/40"
                            />
                            <p className="text-xs text-gray-600 mt-1">
                              Default key provided. You can update it for production use.
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm font-bold">Language</Label>
                            <select 
                              value={language} 
                              onChange={(e) => setLanguage(e.target.value)}
                              className="w-full p-2 border-2 border-wisteria/20 focus:border-wisteria/40 rounded-lg font-semibold bg-white/80"
                            >
                              <option value="en">English</option>
                              <option value="hi">हिंदी (Hindi)</option>
                              <option value="mr">मराठी (Marathi)</option>
                              <option value="ta">தமிழ் (Tamil)</option>
                            </select>
                          </div>
                          <Button className="w-full bg-gradient-to-r from-wisteria to-lemon hover:from-wisteria/80 hover:to-lemon/80 text-black font-bold border-0">
                            Save Settings
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                
                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-white/50 to-lemon/10">
                  {messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.type === 'bot' && (
                        <div className="bg-[#59D35D] p-2 rounded-full shrink-0">
                          <Bot className="h-4 w-4 text-black" />
                        </div>
                      )}
                      
                      <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : ''}`}>
                        <div
                          className={`p-4 rounded-lg ${
                            message.type === 'user'
                              ? 'bg-gradient-to-r from-wisteria to-wisteria/80 text-white ml-4 shadow-lg'
                              : 'bg-gradient-to-r from-white/90 to-lemon/30 text-black mr-4 border border-wisteria/20 shadow-lg'
                          }`}
                        >
                          <div className="whitespace-pre-line text-sm font-medium">
                            {message.content}
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 mt-1 px-4">
                          {message.timestamp}
                        </div>
                      </div>
                      
                      {message.type === 'user' && (
                        <div className="bg-gradient-to-r from-wisteria to-wisteria/80 p-2 rounded-full shrink-0 order-3">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="bg-[#59D35D] p-2 rounded-full">
                        <Bot className="h-4 w-4 text-black" />
                      </div>
                      <div className="bg-gradient-to-r from-white/90 to-lemon/30 p-4 rounded-lg border border-wisteria/20 shadow-lg">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-wisteria" />
                          <span className="text-sm font-medium text-gray-700">GemBot is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </CardContent>
                
                {/* Input */}
                <div className="border-t border-wisteria/20 p-4 bg-gradient-to-r from-lemon/20 to-wisteria/20">
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about suppliers, prices, or procurement tips..."
                      className="font-semibold border-2 border-wisteria/30 focus:border-wisteria/50 bg-white/80"
                      disabled={isLoading}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!input.trim() || isLoading}
                      className="bg-[#59D35D] hover:bg-[#4BC44F] text-black font-bold px-6"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Actions Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Questions */}
              <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/40 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-lemon/30 to-wisteria/30">
                  <CardTitle className="text-lg font-black text-black flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Quick Questions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 p-4">
                  {quickQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full text-left justify-start border-2 border-wisteria/20 hover:bg-gradient-to-r hover:from-lemon/20 hover:to-wisteria/20 text-xs font-semibold p-3 h-auto bg-white/60"
                      onClick={() => handleQuickQuestion(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* AI Features */}
              <Card className="bg-gradient-to-br from-wisteria to-lemon border-0 shadow-xl">
                <CardContent className="p-6">
                  <h3 className="text-lg font-black text-black mb-4">AI Capabilities</h3>
                  <div className="space-y-3 text-black text-sm">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                      <span className="font-semibold">Multilingual support</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                      <span className="font-semibold">Real-time market data</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                      <span className="font-semibold">Smart recommendations</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                      <span className="font-semibold">Procurement insights</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Usage Stats */}
              <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/40 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-lemon/30 to-wisteria/30">
                  <CardTitle className="text-lg font-black text-black">Today's Usage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">Queries</span>
                    <span className="font-bold text-wisteria">{messages.filter(m => m.type === 'user').length}/50</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">Suppliers Found</span>
                    <span className="font-bold text-wisteria">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">Savings Found</span>
                    <span className="font-bold text-green-600">₹2,340</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
