import React, { useState, useRef, useEffect } from 'react';
import { askAiAssistant } from '../lib/api';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BrainCircuit, X, MessageSquare, Loader2, Send } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Hello! I am your portfolio assistant. How can I help you analyze your investments today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      // In a real app, you would pass the full portfolio context here too
      const prompt = `You are a Brazilian financial advisor and tax specialist. Answer the following user query about their portfolio or taxes. Query: ${userMsg}`;
      const res = await askAiAssistant(prompt);
      
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: res.text }]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: 'Sorry, I encountered an error analyzing your request.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-2xl shadow-2xl shadow-emerald-500/30 flex items-center justify-center transition-transform hover:scale-105 z-50"
        >
          <BrainCircuit className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-[400px] h-[600px] max-h-[80vh] flex flex-col shadow-2xl shadow-emerald-500/10 border-white/10 bg-slate-900/80 backdrop-blur-xl z-50 rounded-3xl">
          <CardHeader className="p-4 border-b border-white/10 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
              <span className="text-xs">✨</span>
              <span className="text-[10px] font-bold uppercase text-emerald-400">AI Advisor</span>
            </CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white" onClick={() => setIsOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${msg.role === 'user' ? 'bg-emerald-500/20 text-emerald-100 border border-emerald-500/30' : 'bg-white/5 text-slate-200 border border-white/10'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl p-3 text-sm bg-white/5 text-slate-200 border border-white/10 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Analyzing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>
          <CardFooter className="p-3 border-t border-white/10 bg-white/5 rounded-b-3xl">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex w-full gap-2">
              <Input 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                placeholder="Ask about your portfolio or taxes..." 
                className="bg-white/5 border-white/10 text-white focus-visible:ring-emerald-500 rounded-xl"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 shrink-0 rounded-xl" disabled={!input.trim() || isLoading}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
