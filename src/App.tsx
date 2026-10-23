import React, { useState, useEffect } from 'react';
import { 
  EventDetails, 
  CurrencyCode, 
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
  InAppNotification
} from './types';
import { EventStore, initStorage } from './services/storage';
import { AiService } from './services/aiService';

// Components
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { MyEvents } from './components/MyEvents';
import { EventWizard } from './components/EventWizard';
import { AIPlanner } from './components/AIPlanner';
import { BudgetManager } from './components/BudgetManager';
import { TimelineManager } from './components/TimelineManager';
import { VendorManager } from './components/VendorManager';
import { GuestManager } from './components/GuestManager';
import { DecorDesigner } from './components/DecorDesigner';
import { InvitationGenerator } from './components/InvitationGenerator';
import { MenuPlanner } from './components/MenuPlanner';
import { DocumentVault } from './components/DocumentVault';
import { ReportsExport } from './components/ReportsExport';
import { PostEventAnalysis } from './components/PostEventAnalysis';
import { SettingsAndFirebase } from './components/SettingsAndFirebase';
import { AuthModal } from './components/AuthModal';

export default function App() {
  // Initialize storage once on mount
  useEffect(() => {
    initStorage();
  }, []);

  const [inAppView, setInAppView] = useState<boolean>(true); // start in dashboard or landing page
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [currency, setCurrency] = useState<CurrencyCode>('INR');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Reactive state synced with EventStore
  const [events, setEvents] = useState<EventDetails[]>(() => EventStore.getEvents());
  const [activeEventId, setActiveEventId] = useState<string>(() => EventStore.getActiveEventId());
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(() => EventStore.getBudgetItems());
  const [tasks, setTasks] = useState<TaskItem[]>(() => EventStore.getTasks());
  const [vendors, setVendors] = useState<VendorItem[]>(() => EventStore.getVendors());
  const [guests, setGuests] = useState<GuestItem[]>(() => EventStore.getGuests());
  const [schedule, setSchedule] = useState<DayScheduleItem[]>(() => EventStore.getSchedule());
  const [decorIdeas, setDecorIdeas] = useState<DecorThemeIdea[]>(() => EventStore.getDecorIdeas());
  const [invitations, setInvitations] = useState<InvitationContent[]>(() => EventStore.getInvitations());
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => EventStore.getMenuItems());
  const [documents, setDocuments] = useState<DocumentItem[]>(() => EventStore.getDocuments());
  const [collaborators, setCollaborators] = useState<CollaboratorItem[]>(() => EventStore.getCollaborators());
  const [activities, setActivities] = useState<ActivityItem[]>(() => EventStore.getActivities());
  const [notifications, setNotifications] = useState<InAppNotification[]>(() => EventStore.getNotifications());

  const refreshState = () => {
    const currentEvts = EventStore.getEvents();
    const currentActiveId = EventStore.getActiveEventId();
    setEvents(currentEvts);
    setActiveEventId(currentActiveId);
    setBudgetItems(EventStore.getBudgetItems(currentActiveId));
    setTasks(EventStore.getTasks(currentActiveId));
    setVendors(EventStore.getVendors(currentActiveId));
    setGuests(EventStore.getGuests(currentActiveId));
    setSchedule(EventStore.getSchedule(currentActiveId));
    setDecorIdeas(EventStore.getDecorIdeas(currentActiveId));
    setInvitations(EventStore.getInvitations(currentActiveId));
    setMenuItems(EventStore.getMenuItems(currentActiveId));
    setDocuments(EventStore.getDocuments(currentActiveId));
    setCollaborators(EventStore.getCollaborators(currentActiveId));
    setActivities(EventStore.getActivities(currentActiveId));
    setNotifications(EventStore.getNotifications());
    setIsDemoMode(EventStore.isDemoMode());
  };

  useEffect(() => {
    const unsubscribe = EventStore.subscribe(refreshState);
    refreshState();
    return () => {
      unsubscribe();
    };
  }, []);

  const activeEvent = events.find(e => e.id === activeEventId) || events[0];

  // Sync active event's currency if available
  useEffect(() => {
    if (activeEvent && activeEvent.currency && activeEvent.currency !== currency) {
      setCurrency(activeEvent.currency);
    }
  }, [activeEvent?.id]);

  const handleSelectEvent = (id: string) => {
    EventStore.setActiveEventId(id);
    setActiveEventId(id);
    refreshState();
  };

  const handleSaveEvent = async (
    eventData: Omit<EventDetails, 'id' | 'createdAt' | 'updatedAt'>,
    shouldTriggerAi: boolean
  ) => {
    const created = EventStore.addEvent(eventData);
    refreshState();

    if (shouldTriggerAi) {
      try {
        const plan = await AiService.generatePlan(created);
        
        // Populate suggested allocations
        if (plan.suggestedAllocations) {
          plan.suggestedAllocations.forEach(alloc => {
            EventStore.addBudgetItem({
              eventId: created.id,
              category: alloc.category,
              name: `AI: ${alloc.description}`,
              estimatedCost: alloc.amount,
              actualCost: alloc.amount,
              advancePaid: 0,
              paymentStatus: 'unpaid',
              notes: 'Generated during initial event creation'
            });
          });
        }

        // Populate suggested tasks
        if (plan.tasks) {
          plan.tasks.forEach(t => {
            const targetDate = new Date(created.date);
            targetDate.setDate(targetDate.getDate() + (t.dueRelativeDays || 0));
            EventStore.addTask({
              eventId: created.id,
              title: t.title,
              category: t.category,
              dueDate: targetDate.toISOString().split('T')[0],
              priority: t.priority,
              status: 'pending',
              notes: t.notes,
              isAiGenerated: true
            });
          });
        }

        refreshState();
        setActiveTab('ai-planner');
      } catch (e) {
        console.error('AI plan error on create:', e);
        setActiveTab('dashboard');
      }
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleQuickToggleTask = (taskId: string, currentStatus: string) => {
    EventStore.updateTask(taskId, {
      status: currentStatus === 'completed' ? 'pending' : 'completed'
    });
    refreshState();
  };

  const handleToggleDemoMode = () => {
    const nextVal = !isDemoMode;
    EventStore.setDemoMode(nextVal);
    setIsDemoMode(nextVal);
  };

  if (!inAppView) {
    return (
      <LandingPage
        onStartPlanning={() => {
          setInAppView(true);
          setIsWizardOpen(true);
        }}
        onExploreDemo={() => {
          setInAppView(true);
          setActiveTab('dashboard');
        }}
        onOpenLogin={() => setIsAuthOpen(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col selection:bg-emerald-100 selection:text-emerald-950">
      
      {/* Global Navigation Bar */}
      <Navbar
        events={events}
        activeEvent={activeEvent}
        onSelectEvent={handleSelectEvent}
        onOpenWizard={() => setIsWizardOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onNavigateTab={(tab) => {
          if (tab === 'landing') {
            setInAppView(false);
          } else {
            setActiveTab(tab);
          }
        }}
        currency={currency}
        onSelectCurrency={(cur) => {
          setCurrency(cur);
          if (activeEvent) {
            EventStore.updateEvent(activeEvent.id, { currency: cur });
          }
        }}
        notifications={notifications}
        isDemoMode={isDemoMode}
        onToggleDemoMode={handleToggleDemoMode}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          taskCount={tasks.filter(t => t.status !== 'completed').length}
          unpaidBudgetCount={budgetItems.filter(b => b.paymentStatus !== 'paid').length}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full">
          {activeTab === 'dashboard' && activeEvent && (
            <Dashboard
              event={activeEvent}
              budgetItems={budgetItems}
              tasks={tasks}
              guests={guests}
              vendors={vendors}
              activities={activities}
              onNavigateTab={setActiveTab}
              onOpenWizard={() => setIsWizardOpen(true)}
              onQuickToggleTask={handleQuickToggleTask}
            />
          )}

          {activeTab === 'events' && (
            <MyEvents
              events={events}
              activeEventId={activeEventId}
              onSelectEvent={handleSelectEvent}
              onOpenWizard={() => setIsWizardOpen(true)}
              onRefreshData={refreshState}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'ai-planner' && activeEvent && (
            <AIPlanner
              event={activeEvent}
              onNavigateTab={setActiveTab}
              onRefreshData={refreshState}
            />
          )}

          {activeTab === 'budget' && activeEvent && (
            <BudgetManager
              event={activeEvent}
              budgetItems={budgetItems}
              onRefreshData={refreshState}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'timeline' && activeEvent && (
            <TimelineManager
              event={activeEvent}
              tasks={tasks}
              schedule={schedule}
              onRefreshData={refreshState}
            />
          )}

          {activeTab === 'vendors' && activeEvent && (
            <VendorManager
              event={activeEvent}
              vendors={vendors}
              onRefreshData={refreshState}
            />
          )}

          {activeTab === 'guests' && activeEvent && (
            <GuestManager
              event={activeEvent}
              guests={guests}
              onRefreshData={refreshState}
            />
          )}

          {activeTab === 'decor' && activeEvent && (
            <DecorDesigner
              event={activeEvent}
              decorIdeas={decorIdeas}
              onRefreshData={refreshState}
            />
          )}

          {activeTab === 'invitations' && activeEvent && (
            <InvitationGenerator
              event={activeEvent}
              invitations={invitations}
              onRefreshData={refreshState}
            />
          )}

          {activeTab === 'menu' && activeEvent && (
            <MenuPlanner
              event={activeEvent}
              menuItems={menuItems}
              onRefreshData={refreshState}
            />
          )}

          {activeTab === 'documents' && activeEvent && (
            <DocumentVault
              event={activeEvent}
              documents={documents}
              onRefreshData={refreshState}
            />
          )}

          {activeTab === 'reports' && activeEvent && (
            <ReportsExport
              event={activeEvent}
              budgetItems={budgetItems}
              tasks={tasks}
              vendors={vendors}
              guests={guests}
            />
          )}

          {activeTab === 'post-event' && activeEvent && (
            <PostEventAnalysis
              event={activeEvent}
              budgetItems={budgetItems}
              tasks={tasks}
              guests={guests}
            />
          )}

          {activeTab === 'settings' && activeEvent && (
            <SettingsAndFirebase
              event={activeEvent}
              collaborators={collaborators}
              onRefreshData={refreshState}
            />
          )}
        </main>
      </div>

      {/* Floating View Landing Page link */}
      <div className="fixed bottom-4 right-4 z-40 print:hidden">
        <button
          onClick={() => setInAppView(false)}
          className="px-3 py-1.5 rounded-full bg-stone-900/90 hover:bg-stone-900 text-white text-xs font-semibold shadow-lg backdrop-blur-xs border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span>View Public Landing Page</span>
        </button>
      </div>

      {/* Event Creation Wizard Modal */}
      <EventWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSaveEvent={handleSaveEvent}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(user) => {
          alert(`Signed in as ${user.name} (${user.email})`);
        }}
      />

    </div>
  );
}
