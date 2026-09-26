'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useNexus } from '@/lib/store/nexusContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  HelpCircle, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2,
  Trash2,
  RotateCcw,
  Zap,
  ArrowRight
} from 'lucide-react';
import { generateAICoachResponse } from '@/lib/ai/service';
import { AICoachMessage } from '@/types/nexus';

export const AICoachView: React.FC = () => {
  const { 
    coachMessages, 
    addCoachMessage, 
    clearCoachChat, 
    activeGoal, 
    simulationResult, 
    dailyLogs,
    parameters,
    setActiveTab
  } = useNexus();

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [coachMessages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || isTyping) return;

    // Add user message
    const userMsg: AICoachMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toISOString(),
    };
    addCoachMessage(userMsg);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await generateAICoachResponse(
        query,
        dailyLogs,
        simulationResult,
        activeGoal
      );

      const assistantMsg: AICoachMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: response.content,
        timestamp: new Date().toISOString(),
        suggestedActions: response.suggestedActions,
      };
      addCoachMessage(assistantMsg);
    } catch {
      const fallbackMsg: AICoachMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: "I encountered an error analyzing your telemetry stream. Rest assured, your deterministic engine is still running. Please ask again or adjust your simulation parameters directly.",
        timestamp: new Date().toISOString(),
      };
      addCoachMessage(fallbackMsg);
    } finally {
      setIsTyping(false);
    }
  };

  const quickPrompts = [
    {
      title: "Root Cause Diagnosis",
      prompt: "Why is my projected completion date delayed and what is the exact bottleneck in my logs?",
    },
    {
      title: "Highest-Leverage Adjustment",
      prompt: "What single habit change would yield the highest days saved with the lowest burnout risk?",
    },
    {
      title: "DSA vs Project Tradeoff",
      prompt: "How does my current DSA problem solve rate impact my portfolio completion timeline?",
    },
    {
      title: "7-Day Sprint Protocol",
      prompt: "Create an exact daily schedule protocol for the next 7 days to close the 19-day delay gap.",
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="indigo" glow>
              <Bot className="w-3.5 h-3.5 mr-1" />
              NEXUS Diagnostic AI
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-100">
            Telemetry Life Coach
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Zero generic pep-talks. Quantitative diagnostic coaching driven by your empirical 28-day habits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearCoachChat}
            className="text-slate-400 hover:text-rose-400"
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            Clear Log
          </Button>
        </div>
      </div>

      {/* Telemetry Stream Status Pill */}
      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-slate-300 font-mono">
            Active Context: <strong className="text-white">{activeGoal?.title || 'Full-Stack Developer'}</strong>
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-400 font-mono">
          <span>Projected: <strong className="text-cyan-400">{simulationResult?.projectedDaysTotal}d</strong></span>
          <span>Variance: <strong className="text-amber-400">{simulationResult?.daysVariance && simulationResult.daysVariance > 0 ? `+${simulationResult.daysVariance}d` : `${simulationResult?.daysVariance}d`}</strong></span>
          <span>Consistency: <strong className="text-emerald-400">{Math.round((simulationResult?.consistencyFactor || 0.8) * 100)}%</strong></span>
        </div>
      </div>

      {/* Chat Container */}
      <Card glow className="h-[520px] flex flex-col p-0 overflow-hidden border-slate-800">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {coachMessages.map((msg) => {
            const isAI = msg.role === 'assistant';
            return (
              <div 
                key={msg.id}
                className={`flex gap-3 md:gap-4 ${isAI ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div 
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isAI 
                      ? 'bg-gradient-to-br from-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/20' 
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div 
                  className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed ${
                    isAI 
                      ? 'bg-slate-900/90 border border-slate-800 text-slate-200 shadow-md' 
                      : 'bg-gradient-to-r from-cyan-600 to-cyan-700 text-white font-medium ml-auto'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>

                  {/* Optional Suggested Actions */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                      <div className="text-[11px] font-mono text-cyan-400 font-semibold uppercase tracking-wider">
                        Recommended Direct Interventions:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {msg.suggestedActions.map((action, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              if (action.actionId === 'whatif') setActiveTab('whatif');
                              else if (action.actionId === 'tasks') setActiveTab('tasks');
                              else if (action.actionId === 'paths') setActiveTab('paths');
                            }}
                            className="text-xs px-2.5 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/70 border border-cyan-800/50 text-cyan-200 transition-colors flex items-center gap-1.5"
                          >
                            <Zap className="w-3 h-3 text-cyan-400" />
                            {action.label}
                            <ArrowRight className="w-3 h-3 text-cyan-400" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className={`text-[10px] mt-2 font-mono ${isAI ? 'text-slate-500' : 'text-cyan-200/80 text-right'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-600 to-indigo-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                </div>
                <span>Analyzing telemetry vector & recalculating delta...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Bar */}
        <div className="px-4 py-2.5 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-mono text-slate-400 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            Quick Diagnostics:
          </span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(qp.prompt)}
              className="text-xs px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 whitespace-nowrap transition-colors shrink-0"
            >
              {qp.title}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 md:p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask AI Coach about your habits, trajectory delay, or optimization options..."
            disabled={isTyping}
            className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          />
          <Button 
            type="submit" 
            variant="glow" 
            disabled={!inputMessage.trim() || isTyping}
            className="shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </Card>
    </div>
  );
};
