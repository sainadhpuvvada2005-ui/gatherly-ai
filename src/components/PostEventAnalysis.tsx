import React, { useState } from 'react';
import { 
  Award, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Star, 
  TrendingUp, 
  Plus, 
  Save, 
  FileCheck 
} from 'lucide-react';
import { EventDetails, BudgetItem, TaskItem, GuestItem } from '../types';
import { formatCurrency } from '../services/storage';

interface PostEventAnalysisProps {
  event: EventDetails;
  budgetItems: BudgetItem[];
  tasks: TaskItem[];
  guests: GuestItem[];
}

export const PostEventAnalysis: React.FC<PostEventAnalysisProps> = ({
  event,
  budgetItems,
  tasks,
  guests
}) => {
  const [rating, setRating] = useState<number>(5);
  const [highlights, setHighlights] = useState(
    'The lakefront sunset Phere and Rajasthani live Manganiyar music created an unforgettable, regal atmosphere.'
  );
  const [challenges, setChallenges] = useState(
    'Airport shuttle arrivals faced a 25-minute delay due to morning flight rescheduling; resolved by coordinating directly with driver leads.'
  );
  const [lessons, setLessons] = useState<string[]>([
    'Lock catering headcount 12 days prior to prevent over-purchasing.',
    'Keep dedicated backup batteries for live wireless mics on stage.',
    'Digital WhatsApp RSVP reminders yielded a 94% response rate compared to 60% for email.'
  ]);
  const [newLesson, setNewLesson] = useState('');
  const [saved, setSaved] = useState(false);

  const totalActual = budgetItems.reduce((acc, b) => acc + (b.actualCost || 0), 0);
  const totalBudget = event.totalBudget || 0;
  const variance = totalBudget - totalActual;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const missedTasks = tasks.length - completedTasks;
  const attendedPax = guests.filter(g => g.rsvpStatus === 'accepted').reduce((acc, g) => acc + 1 + (g.plusOnes || 0), 0);

  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLesson.trim()) return;
    setLessons([...lessons, newLesson.trim()]);
    setNewLesson('');
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-stone-900 flex items-center gap-2">
            <Award className="w-6 h-6 text-emerald-800" />
            <span>Post-Event Debrief & Retrospective</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Reconcile final expenditures, evaluate completed versus missed deliverables, and document key lessons for future celebrations.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{saved ? 'Saved Retrospective!' : 'Save Debrief'}</span>
        </button>
      </div>

      {/* High-Level Scorecard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Final Expense Total</span>
          <p className="text-xl sm:text-2xl font-bold font-display text-stone-900 mt-1">
            {formatCurrency(totalActual, event.currency)}
          </p>
          <p className={`text-[11px] font-bold mt-0.5 ${variance >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
            {variance >= 0 ? `Under budget by ${formatCurrency(variance, event.currency)}` : `Over budget by ${formatCurrency(Math.abs(variance), event.currency)}`}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Task Velocity</span>
          <p className="text-xl sm:text-2xl font-bold font-display text-emerald-900 mt-1">
            {completedTasks} / {tasks.length}
          </p>
          <p className="text-[11px] text-stone-400 mt-0.5">{missedTasks} missed / deferred</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Total Turnout</span>
          <p className="text-xl sm:text-2xl font-bold font-display text-teal-800 mt-1">
            {attendedPax} Pax
          </p>
          <p className="text-[11px] text-stone-400 mt-0.5">Vs {event.guestCount} planned</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Host Satisfaction</span>
          <div className="flex items-center gap-1 mt-1.5">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`transition-colors ${star <= rating ? 'text-amber-400' : 'text-stone-300'}`}
              >
                <Star className="w-5 h-5 fill-current" />
              </button>
            ))}
          </div>
          <p className="text-[11px] text-stone-400 mt-1">Rating: {rating}/5</p>
        </div>

      </div>

      {/* Retrospective Form Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-stone-900 font-display">
            Celebration Highlights & Signature Moments
          </h3>
          <textarea
            rows={4}
            value={highlights}
            onChange={e => setHighlights(e.target.value)}
            className="w-full p-3 rounded-xl border border-stone-300 text-xs text-stone-700 leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-700"
            placeholder="What went brilliantly well?"
          />

          <h3 className="text-base font-bold text-stone-900 font-display pt-2">
            Logistical Bottlenecks & Challenges Encountered
          </h3>
          <textarea
            rows={4}
            value={challenges}
            onChange={e => setChallenges(e.target.value)}
            className="w-full p-3 rounded-xl border border-stone-300 text-xs text-stone-700 leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-700"
            placeholder="What could have been planned better?"
          />
        </div>

        {/* Lessons Learned */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-900 font-display flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>Lessons Learned & Best Practices</span>
            </h3>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
              Knowledge Base
            </span>
          </div>

          <div className="space-y-2">
            {lessons.map((lesson, idx) => (
              <div key={idx} className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>{lesson}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddLesson} className="pt-2 flex items-center gap-2">
            <input
              type="text"
              value={newLesson}
              onChange={e => setNewLesson(e.target.value)}
              placeholder="Add key takeaway for your next event..."
              className="flex-1 px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-900 transition-colors"
            >
              Add
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
