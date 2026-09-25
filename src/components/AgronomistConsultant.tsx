import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquareText,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  HelpCircle,
  Loader2,
} from 'lucide-react';
import { DiagnosticResult, ChatMessage } from '../types';

interface AgronomistConsultantProps {
  isOpen: boolean;
  onClose: () => void;
  diagnosticContext: DiagnosticResult | null;
}

export const AgronomistConsultant: React.FC<AgronomistConsultantProps> = ({
  isOpen,
  onClose,
  diagnosticContext,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hello! I am your AI Agronomy & Extension Specialist. How can I help you manage this crop pathology? You can ask about chemical dosage, organic spray formulations, weather precautions, or soil recovery.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'What sprayer pressure and nozzle type should I use?',
    'Can I apply this organic treatment in direct sunlight?',
    'What is the pre-harvest safety interval (PHI) for this chemical?',
    'How do I sanitize pruning shears to prevent row spread?',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsSending(true);

    try {
      const response = await fetch('/api/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          diagnosisSummary: diagnosticContext
            ? {
                crop: diagnosticContext.cropIdentified,
                condition: diagnosticContext.conditionName,
                severity: diagnosticContext.severityLevel,
                causalOrganism: diagnosticContext.causalOrganism,
                immediateContainment: diagnosticContext.immediateContainmentSteps,
                chemicalTreatments: diagnosticContext.chemicalTreatments,
                organicTreatments: diagnosticContext.organicTreatments,
              }
            : null,
          question: query,
          chatHistory: messages.slice(-6),
        }),
      });

      const data = await response.json();

      if (data.success && data.answer) {
        const assistantMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error(data.error || 'Failed to retrieve response');
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Agronomic consult error: ${err.message || 'Unable to connect to agronomist service.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white h-full flex flex-col shadow-2xl border-l border-stone-200 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 bg-[#133826] text-white flex items-center justify-between border-b border-[#1b4d35]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700/80 flex items-center justify-center text-emerald-200">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold tracking-tight">
                AI Agronomist Extension Specialist
              </h3>
              <p className="text-[11px] text-emerald-200/70 font-mono">
                {diagnosticContext ? `Context: ${diagnosticContext.conditionName}` : 'General Agronomy'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-emerald-900/60 text-emerald-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-stone-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-emerald-800 text-white rounded-tr-xs'
                    : 'bg-white text-stone-800 border border-stone-200 rounded-tl-xs shadow-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <div
                  className={`text-[9px] mt-1.5 text-right font-mono ${
                    msg.role === 'user' ? 'text-emerald-200/70' : 'text-stone-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-stone-700 text-white flex items-center justify-center text-xs shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {isSending && (
            <div className="flex gap-2.5 justify-start items-center text-xs text-stone-500 bg-white p-3 rounded-xl border border-stone-200 w-fit">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-700" />
              <span>Agronomist reviewing treatment parameters...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="p-2.5 bg-white border-t border-stone-100 flex gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1 bg-stone-100 hover:bg-emerald-50 hover:text-emerald-900 border border-stone-200 rounded-full text-stone-600 whitespace-nowrap shrink-0 transition-colors cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-stone-200 flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask question regarding spray mixing, application, safety..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="flex-1 text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-stone-800 placeholder-stone-400"
          />
          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isSending}
            className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
              !inputText.trim() || isSending
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                : 'bg-emerald-800 hover:bg-emerald-700 text-white shadow-xs'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
