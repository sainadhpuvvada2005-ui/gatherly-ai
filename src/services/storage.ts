import { 
  EventDetails, 
  BudgetItem, 
  TaskItem, 
  VendorItem, 
  GuestItem, 
  DayScheduleItem,
  DecorThemeIdea,
  InvitationContent,
  MenuItem,
  DocumentItem,
  CollaboratorItem,
  ActivityItem,
  InAppNotification,
  CurrencyCode
} from '../types';
import {
  INITIAL_EVENTS,
  INITIAL_BUDGET_ITEMS,
  INITIAL_TASKS,
  INITIAL_VENDORS,
  INITIAL_GUESTS,
  INITIAL_DAY_SCHEDULE,
  INITIAL_DECOR_IDEAS,
  INITIAL_INVITATIONS,
  INITIAL_MENU_ITEMS,
  INITIAL_COLLABORATORS,
  INITIAL_DOCUMENTS,
  INITIAL_ACTIVITIES
} from '../data/initialData';
import { FirestoreSyncService } from './firebase';

const STORAGE_KEYS = {
  EVENTS: 'gatherly_events',
  ACTIVE_EVENT_ID: 'gatherly_active_event_id',
  BUDGET_ITEMS: 'gatherly_budget_items',
  TASKS: 'gatherly_tasks',
  VENDORS: 'gatherly_vendors',
  GUESTS: 'gatherly_guests',
  SCHEDULE: 'gatherly_schedule',
  DECOR: 'gatherly_decor',
  INVITATIONS: 'gatherly_invitations',
  MENU: 'gatherly_menu',
  COLLABORATORS: 'gatherly_collaborators',
  DOCUMENTS: 'gatherly_documents',
  ACTIVITIES: 'gatherly_activities',
  NOTIFICATIONS: 'gatherly_notifications',
  IS_DEMO_MODE: 'gatherly_is_demo_mode'
};

type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach(l => {
    try {
      l();
    } catch (e) {
      console.error('Listener notification error:', e);
    }
  });
}

function getItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notify();
  } catch (e) {
    console.error(`Failed to save ${key} to localStorage:`, e);
  }
}

// Initialize storage with demo data if empty
export function initStorage(): void {
  if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
    setItem(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    setItem(STORAGE_KEYS.ACTIVE_EVENT_ID, INITIAL_EVENTS[0].id);
    setItem(STORAGE_KEYS.BUDGET_ITEMS, INITIAL_BUDGET_ITEMS);
    setItem(STORAGE_KEYS.TASKS, INITIAL_TASKS);
    setItem(STORAGE_KEYS.VENDORS, INITIAL_VENDORS);
    setItem(STORAGE_KEYS.GUESTS, INITIAL_GUESTS);
    setItem(STORAGE_KEYS.SCHEDULE, INITIAL_DAY_SCHEDULE);
    setItem(STORAGE_KEYS.DECOR, INITIAL_DECOR_IDEAS);
    setItem(STORAGE_KEYS.INVITATIONS, INITIAL_INVITATIONS);
    setItem(STORAGE_KEYS.MENU, INITIAL_MENU_ITEMS);
    setItem(STORAGE_KEYS.COLLABORATORS, INITIAL_COLLABORATORS);
    setItem(STORAGE_KEYS.DOCUMENTS, INITIAL_DOCUMENTS);
    setItem(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
    
    // Seed initial notifications
    const seedNotifs: InAppNotification[] = [
      {
        id: 'notif-1',
        title: 'RSVP Deadline Approaching',
        message: 'Outstation guests RSVP reminder should be sent this week.',
        type: 'warning',
        timestamp: new Date().toISOString(),
        read: false,
        linkTab: 'guests'
      },
      {
        id: 'notif-2',
        title: 'Upcoming Vendor Payment Due',
        message: 'Palace Courtyard second installment due on 5th Nov.',
        type: 'alert',
        timestamp: new Date().toISOString(),
        read: false,
        linkTab: 'budget'
      },
      {
        id: 'notif-3',
        title: 'AI Assistant Ready',
        message: 'Gatherly AI generated smart budget allocation and timeline.',
        type: 'info',
        timestamp: new Date().toISOString(),
        read: true,
        linkTab: 'ai'
      }
    ];
    setItem(STORAGE_KEYS.NOTIFICATIONS, seedNotifs);
    setItem(STORAGE_KEYS.IS_DEMO_MODE, true);
  }
}

export const EventStore = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  isDemoMode(): boolean {
    return getItem<boolean>(STORAGE_KEYS.IS_DEMO_MODE, true);
  },

  setDemoMode(val: boolean) {
    setItem(STORAGE_KEYS.IS_DEMO_MODE, val);
  },

  // Events
  getEvents(): EventDetails[] {
    return getItem<EventDetails[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
  },

  getActiveEventId(): string {
    const events = this.getEvents();
    const stored = getItem<string>(STORAGE_KEYS.ACTIVE_EVENT_ID, events[0]?.id || '');
    if (events.some(e => e.id === stored)) return stored;
    return events[0]?.id || '';
  },

  setActiveEventId(id: string) {
    setItem(STORAGE_KEYS.ACTIVE_EVENT_ID, id);
  },

  getActiveEvent(): EventDetails | undefined {
    const id = this.getActiveEventId();
    return this.getEvents().find(e => e.id === id);
  },

  addEvent(event: Omit<EventDetails, 'id' | 'createdAt' | 'updatedAt'>): EventDetails {
    const events = this.getEvents();
    const newEvent: EventDetails = {
      ...event,
      id: `evt-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setItem(STORAGE_KEYS.EVENTS, [newEvent, ...events]);
    this.setActiveEventId(newEvent.id);
    this.addActivity(newEvent.id, `Created new event: "${newEvent.name}"`, 'User', 'event');
    FirestoreSyncService.saveEventDoc(newEvent.id, newEvent);
    return newEvent;
  },

  updateEvent(id: string, updates: Partial<EventDetails>): EventDetails | undefined {
    const events = this.getEvents();
    const index = events.findIndex(e => e.id === id);
    if (index === -1) return undefined;
    const updated = {
      ...events[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    events[index] = updated;
    setItem(STORAGE_KEYS.EVENTS, [...events]);
    this.addActivity(id, `Updated event details for "${updated.name}"`, 'User', 'event');
    FirestoreSyncService.saveEventDoc(id, updated);
    return updated;
  },

  deleteEvent(id: string): boolean {
    const events = this.getEvents();
    const remaining = events.filter(e => e.id !== id);
    if (remaining.length === 0) return false;
    setItem(STORAGE_KEYS.EVENTS, remaining);
    if (this.getActiveEventId() === id) {
      this.setActiveEventId(remaining[0].id);
    }
    return true;
  },

  // Budget
  getBudgetItems(eventId?: string): BudgetItem[] {
    const all = getItem<BudgetItem[]>(STORAGE_KEYS.BUDGET_ITEMS, INITIAL_BUDGET_ITEMS);
    const targetId = eventId || this.getActiveEventId();
    return all.filter(b => b.eventId === targetId);
  },

  addBudgetItem(item: Omit<BudgetItem, 'id' | 'createdAt'>): BudgetItem {
    const all = getItem<BudgetItem[]>(STORAGE_KEYS.BUDGET_ITEMS, INITIAL_BUDGET_ITEMS);
    const newItem: BudgetItem = {
      ...item,
      id: `b-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setItem(STORAGE_KEYS.BUDGET_ITEMS, [...all, newItem]);
    this.addActivity(item.eventId, `Added budget item: "${item.name}" (${formatCurrency(item.actualCost || item.estimatedCost)})`, 'User', 'budget');
    FirestoreSyncService.saveBudgetItemDoc(item.eventId, newItem.id, newItem);
    return newItem;
  },

  updateBudgetItem(id: string, updates: Partial<BudgetItem>): void {
    const all = getItem<BudgetItem[]>(STORAGE_KEYS.BUDGET_ITEMS, INITIAL_BUDGET_ITEMS);
    const index = all.findIndex(b => b.id === id);
    if (index !== -1) {
      all[index] = { ...all[index], ...updates };
      setItem(STORAGE_KEYS.BUDGET_ITEMS, [...all]);
      this.addActivity(all[index].eventId, `Updated expense: "${all[index].name}"`, 'User', 'budget');
      FirestoreSyncService.saveBudgetItemDoc(all[index].eventId, all[index].id, all[index]);
    }
  },

  deleteBudgetItem(id: string): void {
    const all = getItem<BudgetItem[]>(STORAGE_KEYS.BUDGET_ITEMS, INITIAL_BUDGET_ITEMS);
    const item = all.find(b => b.id === id);
    if (item) {
      setItem(STORAGE_KEYS.BUDGET_ITEMS, all.filter(b => b.id !== id));
      this.addActivity(item.eventId, `Deleted expense: "${item.name}"`, 'User', 'budget');
    }
  },

  // Tasks
  getTasks(eventId?: string): TaskItem[] {
    const all = getItem<TaskItem[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS);
    const targetId = eventId || this.getActiveEventId();
    return all.filter(t => t.eventId === targetId);
  },

  addTask(task: Omit<TaskItem, 'id'>): TaskItem {
    const all = getItem<TaskItem[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS);
    const newTask: TaskItem = {
      ...task,
      id: `t-${Date.now()}`
    };
    setItem(STORAGE_KEYS.TASKS, [...all, newTask]);
    this.addActivity(task.eventId, `Added task: "${task.title}"`, 'User', 'task');
    FirestoreSyncService.saveTaskDoc(task.eventId, newTask.id, newTask);
    return newTask;
  },

  updateTask(id: string, updates: Partial<TaskItem>): void {
    const all = getItem<TaskItem[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS);
    const index = all.findIndex(t => t.id === id);
    if (index !== -1) {
      const prevStatus = all[index].status;
      all[index] = { ...all[index], ...updates };
      setItem(STORAGE_KEYS.TASKS, [...all]);
      if (updates.status && updates.status !== prevStatus) {
        this.addActivity(
          all[index].eventId, 
          `Changed task "${all[index].title}" status to ${updates.status.toUpperCase()}`, 
          'User', 
          'task'
        );
      }
      FirestoreSyncService.saveTaskDoc(all[index].eventId, all[index].id, all[index]);
    }
  },

  deleteTask(id: string): void {
    const all = getItem<TaskItem[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS);
    const task = all.find(t => t.id === id);
    if (task) {
      setItem(STORAGE_KEYS.TASKS, all.filter(t => t.id !== id));
      this.addActivity(task.eventId, `Deleted task: "${task.title}"`, 'User', 'task');
    }
  },

  // Vendors
  getVendors(eventId?: string): VendorItem[] {
    const all = getItem<VendorItem[]>(STORAGE_KEYS.VENDORS, INITIAL_VENDORS);
    const targetId = eventId || this.getActiveEventId();
    return all.filter(v => v.eventId === targetId);
  },

  addVendor(vendor: Omit<VendorItem, 'id'>): VendorItem {
    const all = getItem<VendorItem[]>(STORAGE_KEYS.VENDORS, INITIAL_VENDORS);
    const newVendor: VendorItem = {
      ...vendor,
      id: `v-${Date.now()}`
    };
    setItem(STORAGE_KEYS.VENDORS, [...all, newVendor]);
    this.addActivity(vendor.eventId, `Added vendor: "${vendor.name}" (${vendor.category})`, 'User', 'vendor');
    FirestoreSyncService.saveVendorDoc(vendor.eventId, newVendor.id, newVendor);
    return newVendor;
  },

  updateVendor(id: string, updates: Partial<VendorItem>): void {
    const all = getItem<VendorItem[]>(STORAGE_KEYS.VENDORS, INITIAL_VENDORS);
    const index = all.findIndex(v => v.id === id);
    if (index !== -1) {
      all[index] = { ...all[index], ...updates };
      setItem(STORAGE_KEYS.VENDORS, [...all]);
      this.addActivity(all[index].eventId, `Updated vendor: "${all[index].name}"`, 'User', 'vendor');
      FirestoreSyncService.saveVendorDoc(all[index].eventId, all[index].id, all[index]);
    }
  },

  deleteVendor(id: string): void {
    const all = getItem<VendorItem[]>(STORAGE_KEYS.VENDORS, INITIAL_VENDORS);
    const vendor = all.find(v => v.id === id);
    if (vendor) {
      setItem(STORAGE_KEYS.VENDORS, all.filter(v => v.id !== id));
      this.addActivity(vendor.eventId, `Removed vendor: "${vendor.name}"`, 'User', 'vendor');
    }
  },

  // Guests
  getGuests(eventId?: string): GuestItem[] {
    const all = getItem<GuestItem[]>(STORAGE_KEYS.GUESTS, INITIAL_GUESTS);
    const targetId = eventId || this.getActiveEventId();
    return all.filter(g => g.eventId === targetId);
  },

  addGuest(guest: Omit<GuestItem, 'id'>): GuestItem {
    const all = getItem<GuestItem[]>(STORAGE_KEYS.GUESTS, INITIAL_GUESTS);
    const newGuest: GuestItem = {
      ...guest,
      id: `g-${Date.now()}`
    };
    setItem(STORAGE_KEYS.GUESTS, [...all, newGuest]);
    this.addActivity(guest.eventId, `Added guest: "${guest.name}" (${guest.groupCategory})`, 'User', 'guest');
    FirestoreSyncService.saveGuestDoc(guest.eventId, newGuest.id, newGuest);
    return newGuest;
  },

  updateGuest(id: string, updates: Partial<GuestItem>): void {
    const all = getItem<GuestItem[]>(STORAGE_KEYS.GUESTS, INITIAL_GUESTS);
    const index = all.findIndex(g => g.id === id);
    if (index !== -1) {
      all[index] = { ...all[index], ...updates };
      setItem(STORAGE_KEYS.GUESTS, [...all]);
      FirestoreSyncService.saveGuestDoc(all[index].eventId, all[index].id, all[index]);
    }
  },

  deleteGuest(id: string): void {
    const all = getItem<GuestItem[]>(STORAGE_KEYS.GUESTS, INITIAL_GUESTS);
    const guest = all.find(g => g.id === id);
    if (guest) {
      setItem(STORAGE_KEYS.GUESTS, all.filter(g => g.id !== id));
      this.addActivity(guest.eventId, `Removed guest: "${guest.name}"`, 'User', 'guest');
    }
  },

  // Day Schedule
  getSchedule(eventId?: string): DayScheduleItem[] {
    const all = getItem<DayScheduleItem[]>(STORAGE_KEYS.SCHEDULE, INITIAL_DAY_SCHEDULE);
    const targetId = eventId || this.getActiveEventId();
    return all.filter(s => s.eventId === targetId);
  },

  addScheduleItem(item: Omit<DayScheduleItem, 'id'>): DayScheduleItem {
    const all = getItem<DayScheduleItem[]>(STORAGE_KEYS.SCHEDULE, INITIAL_DAY_SCHEDULE);
    const newItem: DayScheduleItem = {
      ...item,
      id: `s-${Date.now()}`
    };
    setItem(STORAGE_KEYS.SCHEDULE, [...all, newItem]);
    return newItem;
  },

  updateScheduleItem(id: string, updates: Partial<DayScheduleItem>): void {
    const all = getItem<DayScheduleItem[]>(STORAGE_KEYS.SCHEDULE, INITIAL_DAY_SCHEDULE);
    const index = all.findIndex(s => s.id === id);
    if (index !== -1) {
      all[index] = { ...all[index], ...updates };
      setItem(STORAGE_KEYS.SCHEDULE, [...all]);
    }
  },

  deleteScheduleItem(id: string): void {
    const all = getItem<DayScheduleItem[]>(STORAGE_KEYS.SCHEDULE, INITIAL_DAY_SCHEDULE);
    setItem(STORAGE_KEYS.SCHEDULE, all.filter(s => s.id !== id));
  },

  // Decor Ideas
  getDecorIdeas(eventId?: string): DecorThemeIdea[] {
    const all = getItem<DecorThemeIdea[]>(STORAGE_KEYS.DECOR, INITIAL_DECOR_IDEAS);
    const targetId = eventId || this.getActiveEventId();
    return all.filter(d => d.eventId === targetId);
  },

  addDecorIdea(idea: Omit<DecorThemeIdea, 'id'>): DecorThemeIdea {
    const all = getItem<DecorThemeIdea[]>(STORAGE_KEYS.DECOR, INITIAL_DECOR_IDEAS);
    const newIdea: DecorThemeIdea = {
      ...idea,
      id: `dec-${Date.now()}`
    };
    setItem(STORAGE_KEYS.DECOR, [...all, newIdea]);
    return newIdea;
  },

  toggleFavoriteDecor(id: string): void {
    const all = getItem<DecorThemeIdea[]>(STORAGE_KEYS.DECOR, INITIAL_DECOR_IDEAS);
    const index = all.findIndex(d => d.id === id);
    if (index !== -1) {
      all[index].isFavorite = !all[index].isFavorite;
      setItem(STORAGE_KEYS.DECOR, [...all]);
    }
  },

  // Invitations
  getInvitations(eventId?: string): InvitationContent[] {
    const all = getItem<InvitationContent[]>(STORAGE_KEYS.INVITATIONS, INITIAL_INVITATIONS);
    const targetId = eventId || this.getActiveEventId();
    return all.filter(i => i.eventId === targetId);
  },

  addInvitation(invitation: Omit<InvitationContent, 'id' | 'createdAt'>): InvitationContent {
    const all = getItem<InvitationContent[]>(STORAGE_KEYS.INVITATIONS, INITIAL_INVITATIONS);
    const newInv: InvitationContent = {
      ...invitation,
      id: `inv-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setItem(STORAGE_KEYS.INVITATIONS, [newInv, ...all]);
    return newInv;
  },

  // Menu items
  getMenuItems(eventId?: string): MenuItem[] {
    const all = getItem<MenuItem[]>(STORAGE_KEYS.MENU, INITIAL_MENU_ITEMS);
    const targetId = eventId || this.getActiveEventId();
    return all.filter(m => m.eventId === targetId);
  },

  addMenuItem(item: Omit<MenuItem, 'id'>): MenuItem {
    const all = getItem<MenuItem[]>(STORAGE_KEYS.MENU, INITIAL_MENU_ITEMS);
    const newItem: MenuItem = {
      ...item,
      id: `m-${Date.now()}`
    };
    setItem(STORAGE_KEYS.MENU, [...all, newItem]);
    return newItem;
  },

  deleteMenuItem(id: string): void {
    const all = getItem<MenuItem[]>(STORAGE_KEYS.MENU, INITIAL_MENU_ITEMS);
    setItem(STORAGE_KEYS.MENU, all.filter(m => m.id !== id));
  },

  // Documents
  getDocuments(eventId?: string): DocumentItem[] {
    const all = getItem<DocumentItem[]>(STORAGE_KEYS.DOCUMENTS, INITIAL_DOCUMENTS);
    const targetId = eventId || this.getActiveEventId();
    return all.filter(d => d.eventId === targetId);
  },

  addDocument(doc: Omit<DocumentItem, 'id' | 'uploadedAt'>): DocumentItem {
    const all = getItem<DocumentItem[]>(STORAGE_KEYS.DOCUMENTS, INITIAL_DOCUMENTS);
    const newDoc: DocumentItem = {
      ...doc,
      id: `doc-${Date.now()}`,
      uploadedAt: new Date().toISOString().split('T')[0]
    };
    setItem(STORAGE_KEYS.DOCUMENTS, [newDoc, ...all]);
    this.addActivity(doc.eventId, `Uploaded document: "${doc.title}"`, 'User', 'event');
    return newDoc;
  },

  deleteDocument(id: string): void {
    const all = getItem<DocumentItem[]>(STORAGE_KEYS.DOCUMENTS, INITIAL_DOCUMENTS);
    setItem(STORAGE_KEYS.DOCUMENTS, all.filter(d => d.id !== id));
  },

  // Collaborators
  getCollaborators(eventId?: string): CollaboratorItem[] {
    const all = getItem<CollaboratorItem[]>(STORAGE_KEYS.COLLABORATORS, INITIAL_COLLABORATORS);
    const targetId = eventId || this.getActiveEventId();
    return all.filter(c => c.eventId === targetId);
  },

  addCollaborator(item: Omit<CollaboratorItem, 'id'>): CollaboratorItem {
    const all = getItem<CollaboratorItem[]>(STORAGE_KEYS.COLLABORATORS, INITIAL_COLLABORATORS);
    const newCol: CollaboratorItem = {
      ...item,
      id: `col-${Date.now()}`
    };
    setItem(STORAGE_KEYS.COLLABORATORS, [...all, newCol]);
    this.addActivity(item.eventId, `Invited collaborator: ${item.email} as ${item.role}`, 'User', 'event');
    return newCol;
  },

  deleteCollaborator(id: string): void {
    const all = getItem<CollaboratorItem[]>(STORAGE_KEYS.COLLABORATORS, INITIAL_COLLABORATORS);
    setItem(STORAGE_KEYS.COLLABORATORS, all.filter(c => c.id !== id));
  },

  // Activities
  getActivities(eventId?: string): ActivityItem[] {
    const all = getItem<ActivityItem[]>(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
    const targetId = eventId || this.getActiveEventId();
    return all.filter(a => a.eventId === targetId).slice(0, 30);
  },

  addActivity(eventId: string, action: string, user: string = 'User', type: ActivityItem['type'] = 'event'): void {
    const all = getItem<ActivityItem[]>(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
    const newAct: ActivityItem = {
      id: `act-${Date.now()}`,
      eventId,
      timestamp: new Date().toISOString(),
      action,
      user,
      type
    };
    setItem(STORAGE_KEYS.ACTIVITIES, [newAct, ...all]);
  },

  // Notifications
  getNotifications(): InAppNotification[] {
    return getItem<InAppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
  },

  markNotificationAsRead(id: string): void {
    const notifs = this.getNotifications();
    const updated = notifs.map(n => n.id === id ? { ...n, read: true } : n);
    setItem(STORAGE_KEYS.NOTIFICATIONS, updated);
  },

  clearNotifications(): void {
    setItem(STORAGE_KEYS.NOTIFICATIONS, []);
  },

  // Reset to initial demo data
  resetToDemo(): void {
    localStorage.clear();
    initStorage();
    notify();
  }
};

// Currency Formatter supporting INR, USD, EUR, GBP, AED
export function formatCurrency(amount: number, currency: CurrencyCode = 'INR'): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '0';
  
  if (currency === 'INR') {
    // Standard Indian numbering formatting: ₹ 25,00,000
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(amount);
}

// Format short date
export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
}

// Calculate days remaining
export function getDaysRemaining(eventDate: string): number {
  if (!eventDate) return 0;
  const target = new Date(eventDate);
  const now = new Date();
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
