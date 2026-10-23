import React, { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Plus, 
  AlertTriangle, 
  Filter, 
  Edit3, 
  Trash2, 
  X, 
  Layers, 
  ArrowRight,
  ListOrdered,
  Sparkles,
  MapPin,
  UserCheck
} from 'lucide-react';
import { EventDetails, TaskItem, DayScheduleItem, TaskPriority, TaskStatus } from '../types';
import { EventStore, formatDate, getDaysRemaining } from '../services/storage';

interface TimelineManagerProps {
  event: EventDetails;
  tasks: TaskItem[];
  schedule: DayScheduleItem[];
  onRefreshData: () => void;
}

export const TimelineManager: React.FC<TimelineManagerProps> = ({
  event,
  tasks,
  schedule,
  onRefreshData
}) => {
  const [activeView, setActiveView] = useState<'tasks' | 'run-sheet'>('tasks');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  
  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<DayScheduleItem | null>(null);

  // Form states for Task
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState('General');
  const [taskDueDate, setTaskDueDate] = useState('2026-11-10');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('medium');
  const [taskStatus, setTaskStatus] = useState<TaskStatus>('pending');
  const [taskAssignedTo, setTaskAssignedTo] = useState('');
  const [taskNotes, setTaskNotes] = useState('');

  // Form states for Schedule
  const [schedTime, setSchedTime] = useState('10:00 AM');
  const [schedTitle, setSchedTitle] = useState('');
  const [schedLocation, setSchedLocation] = useState('');
  const [schedLead, setSchedLead] = useState('');
  const [schedNotes, setSchedNotes] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const daysRemaining = getDaysRemaining(event.date);

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const overdueCount = tasks.filter(t => t.status !== 'completed' && t.dueDate && t.dueDate < today).length;

  const handleToggleTask = (taskId: string, currentStatus: TaskStatus) => {
    const nextStatus: TaskStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    EventStore.updateTask(taskId, { status: nextStatus });
    onRefreshData();
  };

  const handleOpenAddTask = () => {
    setEditingTask(null);
    setTaskTitle('');
    setTaskCategory('Logistics');
    setTaskDueDate(event.date);
    setTaskPriority('medium');
    setTaskStatus('pending');
    setTaskAssignedTo('');
    setTaskNotes('');
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (task: TaskItem) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskCategory(task.category);
    setTaskDueDate(task.dueDate);
    setTaskPriority(task.priority);
    setTaskStatus(task.status);
    setTaskAssignedTo(task.assignedTo || '');
    setTaskNotes(task.notes || '');
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    if (editingTask) {
      EventStore.updateTask(editingTask.id, {
        title: taskTitle,
        category: taskCategory,
        dueDate: taskDueDate,
        priority: taskPriority,
        status: taskStatus,
        assignedTo: taskAssignedTo,
        notes: taskNotes
      });
    } else {
      EventStore.addTask({
        eventId: event.id,
        title: taskTitle,
        category: taskCategory,
        dueDate: taskDueDate,
        priority: taskPriority,
        status: taskStatus,
        assignedTo: taskAssignedTo,
        notes: taskNotes
      });
    }

    setIsTaskModalOpen(false);
    onRefreshData();
  };

  const handleDeleteTask = (id: string) => {
    if (confirm('Delete this milestone task?')) {
      EventStore.deleteTask(id);
      onRefreshData();
    }
  };

  const handleOpenAddSchedule = () => {
    setEditingSchedule(null);
    setSchedTime('12:00 PM');
    setSchedTitle('');
    setSchedLocation(event.venue || 'Main Stage');
    setSchedLead('');
    setSchedNotes('');
    setIsScheduleModalOpen(true);
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedTitle.trim()) return;

    if (editingSchedule) {
      EventStore.updateScheduleItem(editingSchedule.id, {
        time: schedTime,
        title: schedTitle,
        location: schedLocation,
        leadPerson: schedLead,
        notes: schedNotes
      });
    } else {
      EventStore.addScheduleItem({
        eventId: event.id,
        time: schedTime,
        title: schedTitle,
        location: schedLocation,
        leadPerson: schedLead,
        notes: schedNotes,
        completed: false
      });
    }

    setIsScheduleModalOpen(false);
    onRefreshData();
  };

  const handleToggleSchedule = (id: string, completed: boolean = false) => {
    EventStore.updateScheduleItem(id, { completed: !completed });
    onRefreshData();
  };

  const handleDeleteSchedule = (id: string) => {
    if (confirm('Remove this schedule milestone?')) {
      EventStore.deleteScheduleItem(id);
      onRefreshData();
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-stone-900 flex items-center gap-2">
            <Clock className="w-6 h-6 text-emerald-800" />
            <span>Timeline, Milestones & Day Run-Sheet</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Keep every vendor, coordinator, and family lead perfectly aligned before and on the celebration day.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 p-1 bg-stone-100 rounded-xl">
          <button
            onClick={() => setActiveView('tasks')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeView === 'tasks' 
                ? 'bg-white text-stone-900 shadow-xs' 
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Milestone Checklist ({tasks.length})
          </button>
          <button
            onClick={() => setActiveView('run-sheet')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeView === 'run-sheet' 
                ? 'bg-white text-stone-900 shadow-xs' 
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Day-Of Run-Sheet ({schedule.length})
          </button>
        </div>
      </div>

      {/* Countdown & Velocity Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Event Countdown</span>
          <p className="text-2xl font-bold font-display text-stone-900 mt-1">
            {daysRemaining > 0 ? `${daysRemaining} Days Left` : daysRemaining === 0 ? 'Today!' : 'Completed'}
          </p>
          <p className="text-[11px] text-stone-400 mt-0.5">{formatDate(event.date)}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Tasks Completed</span>
          <p className="text-2xl font-bold font-display text-emerald-900 mt-1">
            {completedCount} / {tasks.length}
          </p>
          <div className="w-full bg-stone-100 rounded-full h-1.5 mt-2">
            <div 
              className="bg-emerald-600 h-1.5 rounded-full" 
              style={{ width: `${tasks.length ? (completedCount / tasks.length) * 100 : 0}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Overdue Tasks</span>
          <p className={`text-2xl font-bold font-display mt-1 ${overdueCount > 0 ? 'text-rose-600' : 'text-stone-900'}`}>
            {overdueCount}
          </p>
          <p className="text-[11px] text-stone-400 mt-0.5">Need immediate attention</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Run-Sheet Milestones</span>
          <p className="text-2xl font-bold font-display text-teal-900 mt-1">
            {schedule.length} Cue Points
          </p>
          <p className="text-[11px] text-stone-400 mt-0.5">Hour-by-hour protocol</p>
        </div>

      </div>

      {/* VIEW 1: MILESTONE TASKS */}
      {activeView === 'tasks' && (
        <div className="space-y-4">
          
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              <span className="text-xs font-bold text-stone-500 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Filter:
              </span>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <select
                value={priorityFilter}
                onChange={e => setPriorityFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold bg-white"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            <button
              onClick={handleOpenAddTask}
              className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer w-full sm:w-auto justify-center"
            >
              <Plus className="w-4 h-4" />
              <span>Add Milestone Task</span>
            </button>
          </div>

          {/* Task Cards List */}
          <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100 shadow-xs overflow-hidden">
            {filteredTasks.map(task => {
              const isOver = task.status !== 'completed' && task.dueDate && task.dueDate < today;
              const isDone = task.status === 'completed';

              return (
                <div 
                  key={task.id}
                  className={`p-4 flex items-center justify-between gap-4 transition-colors hover:bg-stone-50 ${
                    isDone ? 'bg-stone-50/50 opacity-70' : ''
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <button
                      onClick={() => handleToggleTask(task.id, task.status)}
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 cursor-pointer transition-all ${
                        isDone 
                          ? 'bg-emerald-600 border-emerald-600 text-white' 
                          : 'border-stone-300 hover:border-emerald-600'
                      }`}
                    >
                      {isDone && <CheckCircle2 className="w-4 h-4" />}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`text-sm font-bold text-stone-900 ${isDone ? 'line-through text-stone-400' : ''}`}>
                          {task.title}
                        </p>
                        {task.isAiGenerated && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" /> AI
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-stone-400 mt-1 flex-wrap">
                        <span className="font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md">
                          {task.category}
                        </span>
                        {task.assignedTo && <span>Lead: <strong className="text-stone-700">{task.assignedTo}</strong></span>}
                        {task.notes && <span className="text-stone-500 italic truncate max-w-sm">{task.notes}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      task.priority === 'high'
                        ? 'bg-rose-100 text-rose-800'
                        : task.priority === 'medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-100 text-stone-700'
                    }`}>
                      {task.priority.toUpperCase()}
                    </span>

                    <span className={`text-xs font-semibold whitespace-nowrap ${isOver ? 'text-rose-600 font-bold' : 'text-stone-500'}`}>
                      {isOver ? `⚠️ ${formatDate(task.dueDate)}` : formatDate(task.dueDate)}
                    </span>

                    <div className="flex items-center gap-1 border-l border-stone-200 pl-2">
                      <button
                        onClick={() => handleOpenEditTask(task)}
                        className="p-1 text-stone-400 hover:text-stone-700"
                        title="Edit"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1 text-stone-400 hover:text-rose-600"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredTasks.length === 0 && (
              <div className="p-10 text-center text-xs text-stone-400">
                No tasks found matching your filter criteria.
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: DAY-OF RUN-SHEET */}
      {activeView === 'run-sheet' && (
        <div className="space-y-4">
          
          <div className="bg-gradient-to-r from-emerald-900 to-teal-900 rounded-2xl p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div>
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Event-Day Master Protocol
              </span>
              <h3 className="text-xl font-bold font-display mt-1">
                Minute-by-Minute Run-Sheet for {event.date}
              </h3>
              <p className="text-xs text-emerald-100/80 mt-1">
                Keep the bridal party, caterers, stage crew, and photographers synced to this timeline.
              </p>
            </div>

            <button
              onClick={handleOpenAddSchedule}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Schedule Milestone</span>
            </button>
          </div>

          {/* Schedule Timeline Track */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
            <div className="relative pl-6 border-l-2 border-emerald-700 space-y-6">
              {schedule.map(item => (
                <div key={item.id} className="relative group">
                  {/* Timeline dot */}
                  <div 
                    onClick={() => handleToggleSchedule(item.id, item.completed)}
                    className={`absolute -left-[31px] top-1 w-5 h-5 rounded-full border-2 border-white shadow-xs flex items-center justify-center cursor-pointer transition-colors ${
                      item.completed ? 'bg-emerald-600' : 'bg-emerald-800 group-hover:scale-110'
                    }`}
                  >
                    {item.completed && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </div>

                  <div className="bg-stone-50 hover:bg-emerald-50/40 p-4 rounded-xl border border-stone-200/80 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-md bg-stone-900 text-white font-mono text-xs font-bold">
                          {item.time}
                        </span>
                        <h4 className={`text-sm font-bold text-stone-900 ${item.completed ? 'line-through text-stone-400' : ''}`}>
                          {item.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingSchedule(item);
                            setSchedTime(item.time);
                            setSchedTitle(item.title);
                            setSchedLocation(item.location);
                            setSchedLead(item.leadPerson || '');
                            setSchedNotes(item.notes || '');
                            setIsScheduleModalOpen(true);
                          }}
                          className="p-1 text-stone-400 hover:text-stone-700 text-xs flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSchedule(item.id)}
                          className="p-1 text-stone-400 hover:text-rose-600 text-xs flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center gap-4 text-xs text-stone-600 flex-wrap">
                      <span className="flex items-center gap-1 font-medium text-emerald-800">
                        <MapPin className="w-3.5 h-3.5" /> {item.location}
                      </span>
                      {item.leadPerson && (
                        <span className="flex items-center gap-1 text-stone-600">
                          <UserCheck className="w-3.5 h-3.5 text-amber-700" /> Lead: {item.leadPerson}
                        </span>
                      )}
                    </div>

                    {item.notes && (
                      <p className="mt-1.5 text-xs text-stone-500 italic bg-white/70 p-2 rounded-lg border border-stone-100">
                        {item.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {schedule.length === 0 && (
                <div className="py-8 text-center text-xs text-stone-400">
                  No day-of schedule cues logged yet. Click &ldquo;Add Schedule Milestone&rdquo; to build the run-sheet.
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900 font-display">
                {editingTask ? 'Edit Milestone Task' : 'New Milestone Task'}
              </h3>
              <button onClick={() => setIsTaskModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  placeholder="e.g. Confirm Sangeet choreographer track list"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={taskCategory}
                    onChange={e => setTaskCategory(e.target.value)}
                    placeholder="Venue, Decor, Catering..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={e => setTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={e => setTaskPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Status</label>
                  <select
                    value={taskStatus}
                    onChange={e => setTaskStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Assigned Lead / Person</label>
                <input
                  type="text"
                  value={taskAssignedTo}
                  onChange={e => setTaskAssignedTo(e.target.value)}
                  placeholder="e.g. Vikram (Lead Planner)"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Notes & Details</label>
                <textarea
                  rows={2}
                  value={taskNotes}
                  onChange={e => setTaskNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 text-white font-bold hover:bg-emerald-900"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900 font-display">
                {editingSchedule ? 'Edit Schedule Cue' : 'Add Run-Sheet Milestone'}
              </h3>
              <button onClick={() => setIsScheduleModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSchedule} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Time *</label>
                  <input
                    type="text"
                    required
                    value={schedTime}
                    onChange={e => setSchedTime(e.target.value)}
                    placeholder="e.g. 06:00 PM"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={schedLocation}
                    onChange={e => setSchedLocation(e.target.value)}
                    placeholder="e.g. Lakeside Lawn"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Ceremony / Cue Title *</label>
                <input
                  type="text"
                  required
                  value={schedTitle}
                  onChange={e => setSchedTitle(e.target.value)}
                  placeholder="e.g. Sunset Jaimala & Phere by the Lake"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Lead Coordinator</label>
                <input
                  type="text"
                  value={schedLead}
                  onChange={e => setSchedLead(e.target.value)}
                  placeholder="e.g. Head Pandit & DJ Kabir"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Special Cues / Sound Notes</label>
                <textarea
                  rows={2}
                  value={schedNotes}
                  onChange={e => setSchedNotes(e.target.value)}
                  placeholder="e.g. Trigger drone camera and rose petal shower."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 text-white font-bold hover:bg-emerald-900"
                >
                  Save Cue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
