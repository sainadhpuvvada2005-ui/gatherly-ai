import React from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Sparkles, 
  Wallet, 
  Clock, 
  Store, 
  Users, 
  Palette, 
  Mail, 
  UtensilsCrossed, 
  FolderLock, 
  FileSpreadsheet, 
  Award, 
  Settings,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  taskCount?: number;
  unpaidBudgetCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  taskCount = 0,
  unpaidBudgetCount = 0
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'events', label: 'My Events', icon: CalendarDays },
    { id: 'ai-planner', label: 'AI Event Planner', icon: Sparkles, highlight: true },
    { id: 'budget', label: 'Smart Budget', icon: Wallet, badge: unpaidBudgetCount > 0 ? unpaidBudgetCount : undefined },
    { id: 'timeline', label: 'Timeline & Schedule', icon: Clock, badge: taskCount > 0 ? taskCount : undefined },
    { id: 'vendors', label: 'Vendors', icon: Store },
    { id: 'guests', label: 'Guests & RSVP', icon: Users },
    { id: 'decor', label: 'AI Themes & Decor', icon: Palette },
    { id: 'invitations', label: 'AI Invitations', icon: Mail },
    { id: 'menu', label: 'Menu & Catering', icon: UtensilsCrossed },
    { id: 'documents', label: 'Document Vault', icon: FolderLock },
    { id: 'reports', label: 'Reports & Export', icon: FileSpreadsheet },
    { id: 'post-event', label: 'Post-Event Analysis', icon: Award },
    { id: 'settings', label: 'Settings & Firebase', icon: Settings }
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:block bg-[#FAF8F5] border-r border-stone-200/80 p-4 min-h-[calc(100vh-4rem)]">
      <div className="space-y-1">
        <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
          Event Control Center
        </p>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-emerald-800 text-white shadow-sm font-semibold'
                  : 'text-stone-700 hover:bg-stone-200/60 hover:text-stone-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                  isActive 
                    ? 'text-amber-300' 
                    : item.highlight 
                      ? 'text-emerald-700' 
                      : 'text-stone-500'
                }`} />
                <span>{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {item.highlight && !isActive && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    AI
                  </span>
                )}
                {item.badge && !isActive && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-stone-200 text-stone-700">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <ChevronRight className="w-4 h-4 text-emerald-300" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Pro tip / Quote card */}
      <div className="mt-8 p-3.5 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/70 text-xs text-amber-950">
        <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>Planner Pro-Tip</span>
        </div>
        <p className="text-[11px] leading-relaxed text-amber-900/80">
          Digital RSVPs combined with automated reminder notifications reduce catering over-preparation by up to 18%.
        </p>
      </div>
    </aside>
  );
};
