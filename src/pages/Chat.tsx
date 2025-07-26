
import React from 'react';
import { MessageCircle, Bot, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import AuthGuard from '@/components/AuthGuard';

const Chat = () => {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-lemon to-wisteria">
        <Navbar />
        
        <div className="pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-4xl">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-5xl font-black text-black mb-4">
                AI <span className="text-[#59D35D]">ASSISTANT</span>
              </h1>
              <p className="text-xl text-gray-700">
                Get instant help with market insights, pricing, and business advice
              </p>
            </div>

            {/* Chat Interface */}
            <Card className="bg-white/95 border-2 border-white/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-black text-black flex items-center gap-2">
                  <Bot className="h-6 w-6 text-[#59D35D]" />
                  FoodMarket AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Chat Messages Area */}
                <div className="h-96 overflow-y-auto bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="space-y-4">
                    {/* AI Message */}
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-[#59D35D] rounded-full flex items-center justify-center">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                      <div className="bg-white rounded-lg p-3 max-w-xs shadow">
                        <p className="text-sm font-semibold">
                          Hello! I'm your FoodMarket AI assistant. I can help you with:
                        </p>
                        <ul className="text-sm text-gray-600 mt-2 list-disc list-inside">
                          <li>Market price insights</li>
                          <li>Supplier recommendations</li>
                          <li>Bulk order advice</li>
                          <li>Business growth tips</li>
                        </ul>
                        <p className="text-sm font-semibold mt-2">
                          How can I help you today?
                        </p>
                      </div>
                    </div>

                    {/* Placeholder for chat history */}
                    <div className="text-center text-gray-500 py-8">
                      <MessageCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">Start a conversation with the AI assistant</p>
                    </div>
                  </div>
                </div>

                {/* Input Area */}
                <div className="flex space-x-2">
                  <Input
                    placeholder="Ask me anything about the food market..."
                    className="flex-1 font-semibold"
                  />
                  <Button className="bg-[#59D35D] hover:bg-[#4BC44F] text-black font-bold px-6">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                {/* Quick Actions */}
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Quick questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "What's the best time to buy rice?",
                      "How to find reliable suppliers?",
                      "Market trends for vegetables",
                      "Bulk order tips"
                    ].map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs font-semibold border-2"
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default Chat;
