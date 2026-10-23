import React from 'react';
import { 
  CalendarDays, 
  Plus, 
  Sparkles, 
  Trash2, 
  ArrowRight, 
  MapPin, 
  Users, 
  Wallet,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { EventDetails } from '../types';
import { EventStore, formatCurrency, formatDate, getDaysRemaining } from '../services/storage';

interface MyEventsProps {
  events: EventDetails[];
  activeEventId: string;
  onSelectEvent: (id: string) => void;
  onOpenWizard: () => void;
  onRefreshData: () => void;
  onNavigateTab: (tab: string) => void;
}

export const MyEvents: React.FC<MyEventsProps> = ({
  events,
  activeEventId,
  onSelectEvent,
  onOpenWizard,
  onRefreshData,
  onNavigateTab
}) => {
  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (events.length <= 1) {
      alert('You must keep at least one event in your dashboard.');
      return;
    }
    if (confirm('Are you sure you want to delete this event? All associated tasks, budgets, and guest records will be purged.')) {
      EventStore.deleteEvent(id);
      onRefreshData();
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-stone-900 flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-emerald-800" />
            <span>My Celebrations & Events</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Manage your portfolio of active, planned, and archived celebrations.
          </p>
        </div>

        <button
          onClick={onOpenWizard}
          className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Event</span>
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(evt => {
          const isActive = evt.id === activeEventId;
          const days = getDaysRemaining(evt.date);
          const budgetItems = EventStore.getBudgetItems(evt.id);
          const tasks = EventStore.getTasks(evt.id);
          const completedTasks = tasks.filter(t => t.status === 'completed').length;
          const totalSpent = budgetItems.reduce((acc, b) => acc + (b.actualCost || 0), 0);

          return (
            <div
              key={evt.id}
              onClick={() => {
                onSelectEvent(evt.id);
                onNavigateTab('dashboard');
              }}
              className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between cursor-pointer group shadow-2xs ${
                isActive
                  ? 'border-emerald-700 ring-2 ring-emerald-600/30 shadow-md'
                  : 'border-stone-200 hover:shadow-lg hover:-translate-y-0.5'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full capitalize">
                    {evt.type} Celebration
                  </span>

                  <div className="flex items-center gap-1.5">
                    {isActive && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Active
                      </span>
                    )}
                    <button
                      onClick={e => handleDelete(e, evt.id)}
                      className="p-1 text-stone-300 hover:text-rose-600 transition-colors"
                      title="Delete Event"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold font-display text-stone-900 mt-3 group-hover:text-emerald-900 transition-colors">
                  {evt.name}
                </h3>

                <p className="text-xs text-stone-500 mt-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="truncate">{evt.venue ? `${evt.venue}, ${evt.city}` : evt.city}</span>
                </p>

                <p className="text-xs text-stone-500 mt-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>{formatDate(evt.date)} ({days > 0 ? `${days} days away` : 'Today'})</span>
                </p>

                {/* Micro Stats */}
                <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-stone-100 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-stone-400 block">Budget</span>
                    <span className="font-bold text-stone-800">{formatCurrency(evt.totalBudget, evt.currency)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-stone-400 block">Guests</span>
                    <span className="font-bold text-stone-800">{evt.guestCount} Attendees</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-stone-400 block">Spent</span>
                    <span className="font-bold text-emerald-800">{formatCurrency(totalSpent, evt.currency)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-stone-400 block">Tasks</span>
                    <span className="font-bold text-stone-800">{completedTasks}/{tasks.length} Done</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-emerald-800 group-hover:text-emerald-950">
                <span>Open Dashboard</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          );
        })}

        {/* Create New Event Card */}
        <div
          onClick={onOpenWizard}
          className="rounded-3xl border-2 border-dashed border-stone-300 hover:border-emerald-700 bg-stone-50/50 hover:bg-emerald-50/30 p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer min-h-[300px]"
        >
          <div className="w-12 h-12 rounded-2xl bg-white text-emerald-800 flex items-center justify-center shadow-xs mb-3">
            <Plus className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-stone-800">Plan Another Celebration</h4>
          <p className="text-xs text-stone-500 max-w-xs mt-1">
            Generate an instant AI blueprint for an upcoming wedding, anniversary, birthday, or college festival.
          </p>
        </div>
      </div>

    </div>
  );
};
