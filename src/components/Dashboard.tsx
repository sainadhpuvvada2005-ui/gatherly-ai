import React from 'react';
import { 
  Wallet, 
  CheckCircle2, 
  Clock, 
  Users, 
  Calendar, 
  Sparkles, 
  AlertTriangle, 
  Plus, 
  ArrowUpRight, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown, 
  Store,
  FileSpreadsheet
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  Legend
} from 'recharts';
import { EventDetails, BudgetItem, TaskItem, GuestItem, VendorItem, ActivityItem } from '../types';
import { formatCurrency, formatDate, getDaysRemaining } from '../services/storage';

interface DashboardProps {
  event: EventDetails;
  budgetItems: BudgetItem[];
  tasks: TaskItem[];
  guests: GuestItem[];
  vendors: VendorItem[];
  activities: ActivityItem[];
  onNavigateTab: (tab: string) => void;
  onOpenWizard: () => void;
  onQuickToggleTask: (taskId: string, currentStatus: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  venue: '#1b4332',
  catering: '#d97706',
  decorations: '#b45309',
  photography: '#2563eb',
  entertainment: '#7c3aed',
  clothing_makeup: '#db2777',
  invitations: '#059669',
  transportation: '#475569',
  accommodation: '#0891b2',
  equipment: '#4f46e5',
  miscellaneous: '#64748b',
  emergency_reserve: '#e11d48'
};

export const Dashboard: React.FC<DashboardProps> = ({
  event,
  budgetItems,
  tasks,
  guests,
  vendors,
  activities,
  onNavigateTab,
  onOpenWizard,
  onQuickToggleTask
}) => {
  // Calculations
  const totalPlannedBudget = event.totalBudget || 0;
  const totalActualExpenses = budgetItems.reduce((acc, b) => acc + (b.actualCost || 0), 0);
  const totalEstimatedExpenses = budgetItems.reduce((acc, b) => acc + (b.estimatedCost || 0), 0);
  const remainingBudget = totalPlannedBudget - totalActualExpenses;
  const isOverBudget = remainingBudget < 0;
  const advancePaidTotal = budgetItems.reduce((acc, b) => acc + (b.advancePaid || 0), 0);
  const outstandingBalance = totalActualExpenses - advancePaidTotal;

  // Task Stats
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const taskProgress = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
  
  // Overdue tasks
  const today = new Date().toISOString().split('T')[0];
  const overdueTasks = tasks.filter(t => t.status !== 'completed' && t.dueDate && t.dueDate < today);

  // Guest Stats
  const acceptedGuests = guests.filter(g => g.rsvpStatus === 'accepted');
  const totalConfirmedPax = acceptedGuests.reduce((acc, g) => acc + 1 + (g.plusOnes || 0), 0);
  const pendingRsvpGuests = guests.filter(g => g.rsvpStatus === 'pending');

  // Days remaining
  const daysRemaining = getDaysRemaining(event.date);

  // Chart data: Budget by category
  const categoryMap: Record<string, number> = {};
  budgetItems.forEach(b => {
    categoryMap[b.category] = (categoryMap[b.category] || 0) + (b.actualCost || b.estimatedCost);
  });

  const pieData = Object.entries(categoryMap).map(([cat, val]) => ({
    name: cat.replace('_', ' ').toUpperCase(),
    value: val,
    color: CATEGORY_COLORS[cat] || '#8884d8'
  }));

  // Bar chart: Planned vs Actual by category
  const barCategories = Array.from(new Set(budgetItems.map(b => b.category)));
  const barData = barCategories.slice(0, 6).map(cat => {
    const items = budgetItems.filter(b => b.category === cat);
    return {
      category: cat.replace('_', ' ').slice(0, 10),
      Estimated: items.reduce((acc, i) => acc + i.estimatedCost, 0),
      Actual: items.reduce((acc, i) => acc + i.actualCost, 0)
    };
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Event Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-2xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="capitalize">{event.type} Blueprint</span>
              <span>•</span>
              <span>{event.setting === 'both' ? 'Indoor & Outdoor' : `${event.setting} setting`}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display tracking-tight text-white">
              {event.name}
            </h1>
            <p className="text-emerald-100/80 text-xs sm:text-sm flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>📅 {formatDate(event.date)}</span>
              {event.startTime && <span>⏰ {event.startTime} - {event.endTime || 'Late'}</span>}
              <span>📍 {event.venue ? `${event.venue}, ${event.city}` : event.city}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('ai-planner')}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-900" />
              <span>AI Planner Co-Pilot</span>
            </button>
            <button
              onClick={onOpenWizard}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm backdrop-blur-xs border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Edit Details</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overdue Warning Alert if any */}
      {overdueTasks.length > 0 && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <p>
              <span className="font-bold">{overdueTasks.length} task(s) overdue!</span> Please check task deadlines to keep the event schedule on track.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('timeline')}
            className="font-bold text-rose-700 hover:underline shrink-0 text-xs"
          >
            View Overdue →
          </button>
        </div>
      )}

      {/* Over-budget Warning Alert */}
      {isOverBudget && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 flex items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <p>
              <span className="font-bold">Budget Exceeded by {formatCurrency(Math.abs(remainingBudget), event.currency)}!</span> Actual expenses have exceeded your allocated total.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('budget')}
            className="font-bold text-amber-800 hover:underline shrink-0 text-xs"
          >
            Review Budget Tips →
          </button>
        </div>
      )}

      {/* High-Level Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Metric 1: Remaining Budget */}
        <div 
          onClick={() => onNavigateTab('budget')}
          className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Remaining Budget</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isOverBudget ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'
            }`}>
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl font-bold font-display mt-3 ${
            isOverBudget ? 'text-rose-600' : 'text-stone-900'
          }`}>
            {formatCurrency(remainingBudget, event.currency)}
          </p>
          <div className="flex items-center justify-between text-xs text-stone-500 mt-2">
            <span>Spent: {formatCurrency(totalActualExpenses, event.currency)}</span>
            <span>Total: {formatCurrency(totalPlannedBudget, event.currency)}</span>
          </div>
        </div>

        {/* Metric 2: Task Completion */}
        <div 
          onClick={() => onNavigateTab('timeline')}
          className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Task Velocity</span>
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <p className="text-2xl font-bold font-display text-stone-900">{taskProgress}%</p>
            <span className="text-xs text-stone-500 font-medium">({completedTasks.length}/{tasks.length} Done)</span>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-2 mt-3 overflow-hidden">
            <div 
              className="bg-emerald-600 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${taskProgress}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Confirmed Guests */}
        <div 
          onClick={() => onNavigateTab('guests')}
          className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Confirmed Guests</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <p className="text-2xl font-bold font-display text-stone-900">{totalConfirmedPax}</p>
            <span className="text-xs text-stone-500 font-medium">/ {event.guestCount} target</span>
          </div>
          <p className="text-xs text-stone-500 mt-2">
            {pendingRsvpGuests.length} RSVP invitations pending reply
          </p>
        </div>

        {/* Metric 4: Days Remaining Countdown */}
        <div 
          onClick={() => onNavigateTab('timeline')}
          className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Countdown</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-display text-stone-900 mt-3">
            {daysRemaining > 0 ? `${daysRemaining} Days` : daysRemaining === 0 ? 'Today!' : 'Completed'}
          </p>
          <p className="text-xs text-stone-500 mt-2">
            Target Date: {formatDate(event.date)}
          </p>
        </div>

      </div>

      {/* Visual Analytics Row: Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Expense Distribution by Category */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-stone-900">Expense Allocation Breakdown</h3>
              <p className="text-xs text-stone-500">Distribution of planned & actual allocations</p>
            </div>
            <button
              onClick={() => onNavigateTab('budget')}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1"
            >
              Full Budget <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            {pieData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-stone-400">
                No budget items recorded yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={45}
                    paddingAngle={3}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(val: any) => formatCurrency(Number(val), event.currency)}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Chart 2: Estimated vs Actual Comparison */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-stone-900">Planned vs. Actual Expenses</h3>
              <p className="text-xs text-stone-500">Track variance across top expenditure categories</p>
            </div>
            <button
              onClick={() => onNavigateTab('budget')}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1"
            >
              Details <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            {barData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-stone-400">
                No expenses logged yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={val => `${val / 1000}k`} />
                  <RechartsTooltip 
                    formatter={(val: any) => formatCurrency(Number(val), event.currency)}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="Estimated" fill="#9ca3af" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Actual" fill="#047857" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

      {/* Two Column Layout: Upcoming Deadlines & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Priority Tasks & Upcoming Deadlines */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-stone-900">Upcoming Planning Deadlines</h3>
              <p className="text-xs text-stone-500">Check off tasks as you complete them</p>
            </div>
            <button
              onClick={() => onNavigateTab('timeline')}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1"
            >
              All Tasks ({tasks.length}) <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-stone-100">
            {pendingTasks.slice(0, 5).map(task => {
              const isOver = task.dueDate && task.dueDate < today;
              return (
                <div 
                  key={task.id} 
                  className="py-3 flex items-center justify-between gap-3 hover:bg-stone-50/80 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => onQuickToggleTask(task.id, task.status)}
                      className="w-5 h-5 rounded-md border-2 border-stone-300 hover:border-emerald-600 flex items-center justify-center shrink-0 cursor-pointer transition-colors"
                    >
                      {task.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </button>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-stone-800 truncate">
                        {task.title}
                      </p>
                      <p className="text-[11px] text-stone-400 flex items-center gap-2 mt-0.5">
                        <span className="font-medium text-stone-500">{task.category}</span>
                        {task.assignedTo && <span>• Assigned: {task.assignedTo}</span>}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      task.priority === 'high' 
                        ? 'bg-rose-100 text-rose-800' 
                        : task.priority === 'medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-100 text-stone-700'
                    }`}>
                      {task.priority.toUpperCase()}
                    </span>
                    <span className={`text-xs font-semibold ${isOver ? 'text-rose-600 font-bold' : 'text-stone-500'}`}>
                      {formatDate(task.dueDate)}
                    </span>
                  </div>
                </div>
              );
            })}

            {pendingTasks.length === 0 && (
              <div className="py-8 text-center text-xs text-stone-400">
                🎉 All pending tasks completed! You are well prepared for the celebration.
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigateTab('timeline')}
              className="w-full py-2.5 rounded-xl border border-dashed border-stone-300 hover:border-emerald-700 hover:bg-emerald-50/50 text-xs font-semibold text-stone-700 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Milestone Task</span>
            </button>
          </div>
        </div>

        {/* Right 1 Col: Recent Activity & Quick Shortcuts */}
        <div className="space-y-6">
          
          {/* Quick Action Hub */}
          <div className="bg-gradient-to-br from-[#F5F2EB] to-[#FAF8F5] rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600">Quick Actions</h3>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onNavigateTab('ai-planner')}
                className="p-3 rounded-xl bg-white hover:bg-emerald-50 border border-stone-200/80 text-left text-xs font-semibold text-stone-800 hover:text-emerald-900 transition-colors shadow-2xs flex flex-col gap-1"
              >
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>Ask AI Planner</span>
              </button>

              <button
                onClick={() => onNavigateTab('budget')}
                className="p-3 rounded-xl bg-white hover:bg-emerald-50 border border-stone-200/80 text-left text-xs font-semibold text-stone-800 hover:text-emerald-900 transition-colors shadow-2xs flex flex-col gap-1"
              >
                <Wallet className="w-4 h-4 text-amber-700" />
                <span>Log Expense</span>
              </button>

              <button
                onClick={() => onNavigateTab('guests')}
                className="p-3 rounded-xl bg-white hover:bg-emerald-50 border border-stone-200/80 text-left text-xs font-semibold text-stone-800 hover:text-emerald-900 transition-colors shadow-2xs flex flex-col gap-1"
              >
                <Users className="w-4 h-4 text-indigo-700" />
                <span>Add Guest</span>
              </button>

              <button
                onClick={() => onNavigateTab('reports')}
                className="p-3 rounded-xl bg-white hover:bg-emerald-50 border border-stone-200/80 text-left text-xs font-semibold text-stone-800 hover:text-emerald-900 transition-colors shadow-2xs flex flex-col gap-1"
              >
                <FileSpreadsheet className="w-4 h-4 text-stone-700" />
                <span>Print Dossier</span>
              </button>
            </div>
          </div>

          {/* Recent Activity Log */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">Live Activity Feed</h3>
            
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {activities.length === 0 ? (
                <p className="text-xs text-stone-400">No activity yet recorded</p>
              ) : (
                activities.slice(0, 6).map(act => (
                  <div key={act.id} className="text-xs border-l-2 border-emerald-600 pl-3 py-1 space-y-0.5">
                    <p className="text-stone-800 font-medium leading-snug">{act.action}</p>
                    <p className="text-[10px] text-stone-400">
                      {act.user} • {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
