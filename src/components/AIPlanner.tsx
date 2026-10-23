import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  RefreshCw, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  ArrowRight, 
  Wallet, 
  Calendar, 
  Users, 
  Utensils, 
  Palette, 
  ShieldAlert, 
  Plus, 
  ChevronDown, 
  ChevronUp,
  Loader2,
  DollarSign
} from 'lucide-react';
import { EventDetails, AiPlanResponse, BudgetCategory } from '../types';
import { AiService } from '../services/aiService';
import { EventStore, formatCurrency } from '../services/storage';

interface AIPlannerProps {
  event: EventDetails;
  onNavigateTab: (tab: string) => void;
  onRefreshData: () => void;
}

export const AIPlanner: React.FC<AIPlannerProps> = ({
  event,
  onNavigateTab,
  onRefreshData
}) => {
  const [loading, setLoading] = useState(false);
  const [aiPlan, setAiPlan] = useState<AiPlanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{
    sender: 'user' | 'ai';
    text: string;
    suggestedAction?: any;
    timestamp: string;
  }>>([
    {
      sender: 'ai',
      text: `Namaste & Welcome! I am your Gatherly AI co-pilot. I have analyzed "${event.name}". You can ask me to recalculate budgets, recommend dietary menus, adjust schedules, or suggest cost-saving vendor alternatives.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [appliedAllocations, setAppliedAllocations] = useState(false);
  const [appliedTasks, setAppliedTasks] = useState(false);

  // Fetch initial plan if none
  const generatePlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const plan = await AiService.generatePlan(event);
      setAiPlan(plan);
      setIsDemoMode(!!plan.isDemoMode);
    } catch (err: any) {
      console.error('Plan generation failed:', err);
      setError('Unable to contact AI planning service. Running fallback recommendations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generatePlan();
  }, [event.id]);

  const handleSendMessage = async (customMessage?: string) => {
    const textToSend = customMessage || chatInput.trim();
    if (!textToSend || chatLoading) return;

    const userMsg = {
      sender: 'user' as const,
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customMessage) setChatInput('');
    setChatLoading(true);

    try {
      const response = await AiService.sendChatMessage(
        textToSend,
        event,
        messages.map(m => ({ sender: m.sender, text: m.text }))
      );

      const aiMsg = {
        sender: 'ai' as const,
        text: response.reply,
        suggestedAction: response.suggestedAction,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: 'I could not process that request right now. Please check your connection.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleApplyAllocationsToBudget = () => {
    if (!aiPlan || !aiPlan.suggestedAllocations) return;
    
    // Add each allocation as a budget item
    aiPlan.suggestedAllocations.forEach(alloc => {
      EventStore.addBudgetItem({
        eventId: event.id,
        category: alloc.category,
        name: `AI Allocation: ${alloc.description}`,
        estimatedCost: alloc.amount,
        actualCost: alloc.amount,
        advancePaid: 0,
        paymentStatus: 'unpaid',
        notes: `Suggested by Gatherly AI (${alloc.percentage}% of total budget)`
      });
    });

    setAppliedAllocations(true);
    onRefreshData();
    alert('Suggested budget allocations applied directly to your Smart Budget!');
  };

  const handleApplyTasksToTimeline = () => {
    if (!aiPlan || !aiPlan.tasks) return;

    aiPlan.tasks.forEach(t => {
      // Calculate due date relative to event date
      const targetDate = new Date(event.date);
      targetDate.setDate(targetDate.getDate() + (t.dueRelativeDays || 0));
      const dueDateStr = targetDate.toISOString().split('T')[0];

      EventStore.addTask({
        eventId: event.id,
        title: t.title,
        category: t.category,
        dueDate: dueDateStr,
        priority: t.priority,
        status: 'pending',
        notes: t.notes,
        isAiGenerated: true
      });
    });

    setAppliedTasks(true);
    onRefreshData();
    alert('Milestone tasks imported directly to your Timeline!');
  };

  const handleExecuteAction = (action: any) => {
    if (action.type === 'modify_budget' && action.category === 'decorations') {
      const budgetItems = EventStore.getBudgetItems(event.id);
      const decorItem = budgetItems.find(b => b.category === 'decorations');
      if (decorItem) {
        const newCost = Math.max(0, decorItem.actualCost + (action.suggestedDelta || -15000));
        EventStore.updateBudgetItem(decorItem.id, {
          actualCost: newCost,
          notes: `${decorItem.notes || ''} [Reduced by ₹15,000 per AI suggestion]`
        });
        onRefreshData();
        alert('Smart Budget updated! Decoration cost reduced by ₹15,000.');
      } else {
        alert('No decoration line item found to adjust.');
      }
    } else if (action.type === 'menu_suggestion') {
      onNavigateTab('menu');
    } else if (action.type === 'modify_schedule') {
      onNavigateTab('timeline');
    }
  };

  const promptSuggestions = [
    'Reduce the decoration budget by ₹15,000',
    'Plan a traditional wedding for 200 guests within ₹5 lakh',
    'Create a vegetarian menu for 100 guests',
    'Move the event schedule to the evening'
  ];

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-display text-stone-900">
              AI Event Planner Co-Pilot
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Autonomous multi-factor event intelligence synthesizing financial splits, timelines, vendors, and risk plans.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border ${
            isDemoMode 
              ? 'bg-amber-50 text-amber-800 border-amber-200' 
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}>
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>{isDemoMode ? 'Demo Fallback Engine' : 'Gemini 3.8 Flash Connected'}</span>
          </div>

          <button
            onClick={generatePlan}
            disabled={loading}
            className="px-3 py-1.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-xs font-bold text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Regenerate</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid: Blueprint on Left, Interactive Chat on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: AI Generated Master Blueprint (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {loading ? (
            <div className="bg-white rounded-2xl p-12 border border-stone-200 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-emerald-700 animate-spin mx-auto" />
              <p className="text-sm font-bold text-stone-800">Synthesizing Customized Event Blueprint...</p>
              <p className="text-xs text-stone-500">
                Evaluating guest count, venue specs, local pricing benchmarks, and risk mitigation strategies.
              </p>
            </div>
          ) : aiPlan ? (
            <>
              {/* Overview Card */}
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    <span>Executive Overview</span>
                  </h3>
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Validated Model
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  {aiPlan.overview}
                </p>

                {/* Budget Saving Recommendations */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 space-y-2">
                  <p className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                    <Wallet className="w-4 h-4 text-amber-700" />
                    <span>AI Cost-Saving Strategies</span>
                  </p>
                  <ul className="space-y-1.5 text-xs text-amber-900/90">
                    {aiPlan.budgetSavingTips?.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Suggested Budget Allocations */}
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-stone-900">Suggested Budget Allocations</h3>
                    <p className="text-xs text-stone-500">Benchmark splits for {event.currency} {event.totalBudget?.toLocaleString()}</p>
                  </div>
                  <button
                    onClick={handleApplyAllocationsToBudget}
                    disabled={appliedAllocations}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      appliedAllocations
                        ? 'bg-stone-100 text-stone-500'
                        : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs'
                    }`}
                  >
                    {appliedAllocations ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Applied to Budget</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Apply to Smart Budget</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="divide-y divide-stone-100">
                  {aiPlan.suggestedAllocations?.map((alloc, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                      <div className="min-w-0">
                        <p className="font-bold text-stone-800 capitalize">
                          {alloc.category.replace('_', ' ')}
                        </p>
                        <p className="text-[11px] text-stone-400 truncate">{alloc.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-stone-900">{formatCurrency(alloc.amount, event.currency)}</p>
                        <p className="text-[10px] text-stone-400 font-medium">{alloc.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Tasks Checklist */}
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-stone-900">Recommended Milestone Tasks</h3>
                    <p className="text-xs text-stone-500">Action items relative to event target date</p>
                  </div>
                  <button
                    onClick={handleApplyTasksToTimeline}
                    disabled={appliedTasks}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      appliedTasks
                        ? 'bg-stone-100 text-stone-500'
                        : 'bg-teal-800 hover:bg-teal-900 text-white shadow-xs'
                    }`}
                  >
                    {appliedTasks ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-teal-600" />
                        <span>Imported to Tasks</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Import to Tasks</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-2">
                  {aiPlan.tasks?.map((t, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs flex items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-stone-800">{t.title}</p>
                        <p className="text-[11px] text-stone-500 mt-0.5">{t.notes}</p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-200 text-stone-700 shrink-0">
                        {t.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risks & Mitigation */}
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Risk Analysis & Contingency Plans</span>
                </h3>

                <div className="space-y-3">
                  {aiPlan.risksAndMitigation?.map((rm, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-rose-50/50 border border-rose-100 text-xs space-y-1">
                      <p className="font-bold text-rose-900">⚠️ Risk: {rm.risk}</p>
                      <p className="text-stone-700 leading-relaxed"><span className="font-semibold text-emerald-800">Plan:</span> {rm.mitigation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}

        </div>

        {/* Right Column: Interactive Conversational Co-Pilot (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col h-[750px] overflow-hidden sticky top-20">
            
            {/* Chat Header */}
            <div className="p-4 bg-stone-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-400 text-stone-950 flex items-center justify-center font-bold text-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold">Gatherly Concierge</h4>
                  <p className="text-[10px] text-stone-400">Context-Aware Real-Time Reasoning</p>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            {/* Quick Prompt Chips */}
            <div className="p-3 bg-stone-50 border-b border-stone-200">
              <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                Suggested Directives (Click to test)
              </p>
              <div className="flex flex-wrap gap-1.5">
                {promptSuggestions.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(prompt)}
                    className="px-2.5 py-1 rounded-full bg-white hover:bg-emerald-50 hover:text-emerald-900 border border-stone-200 text-[11px] font-medium text-stone-700 transition-colors cursor-pointer text-left shadow-2xs"
                  >
                    &ldquo;{prompt}&rdquo;
                  </button>
                ))}
              </div>
            </div>

            {/* Messages Thread */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-emerald-800 text-white rounded-br-none'
                        : 'bg-stone-100 text-stone-800 rounded-bl-none whitespace-pre-line'
                    }`}
                  >
                    {msg.text}

                    {/* Interactive Action Button inside AI message */}
                    {msg.suggestedAction && (
                      <div className="mt-3 pt-2 border-t border-stone-200">
                        <button
                          onClick={() => handleExecuteAction(msg.suggestedAction)}
                          className="w-full py-1.5 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Check className="w-3 h-3 text-amber-300" />
                          <span>Apply Recommendation Directly</span>
                        </button>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-stone-400 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {chatLoading && (
                <div className="flex items-center gap-2 p-3 bg-stone-100 rounded-2xl w-24">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce" />
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <div className="p-3 border-t border-stone-200 bg-white">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Ask follow-up e.g. Reduce decor by ₹15k..."
                  className="flex-1 px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-xs"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || chatLoading}
                  className="p-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
