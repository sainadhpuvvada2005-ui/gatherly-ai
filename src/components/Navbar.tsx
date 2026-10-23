import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  Plus, 
  Bell, 
  ChevronDown, 
  Coins, 
  User, 
  ShieldCheck, 
  CheckCircle2, 
  X,
  ExternalLink,
  Layers
} from 'lucide-react';
import { EventDetails, CurrencyCode, InAppNotification } from '../types';
import { EventStore, formatCurrency } from '../services/storage';

interface NavbarProps {
  events: EventDetails[];
  activeEvent: EventDetails | undefined;
  onSelectEvent: (id: string) => void;
  onOpenWizard: () => void;
  onOpenAuth: () => void;
  onNavigateTab: (tab: string) => void;
  currency: CurrencyCode;
  onSelectCurrency: (currency: CurrencyCode) => void;
  notifications: InAppNotification[];
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  events,
  activeEvent,
  onSelectEvent,
  onOpenWizard,
  onOpenAuth,
  onNavigateTab,
  currency,
  onSelectCurrency,
  notifications,
  isDemoMode,
  onToggleDemoMode
}) => {
  const [showEventDropdown, setShowEventDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & Active Event */}
        <div className="flex items-center gap-6 min-w-0">
          <div 
            onClick={() => onNavigateTab('dashboard')} 
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold tracking-tight text-stone-900 flex items-center gap-1 font-display">
                Gatherly <span className="text-emerald-700 text-lg">AI</span>
              </span>
              <p className="text-[11px] font-medium text-stone-500 -mt-1 tracking-wide">
                Plan Smarter. Celebrate Better.
              </p>
            </div>
          </div>

          {/* Active Event Selector */}
          {activeEvent && (
            <div className="relative">
              <button
                onClick={() => {
                  setShowEventDropdown(!showEventDropdown);
                  setShowCurrencyDropdown(false);
                  setShowNotifications(false);
                  setShowUserMenu(false);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-100/80 hover:bg-stone-200/70 border border-stone-200 text-stone-800 text-xs sm:text-sm font-medium transition-all max-w-[190px] sm:max-w-[280px]"
                title={activeEvent.name}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse shrink-0" />
                <span className="truncate text-left font-semibold">{activeEvent.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-500 shrink-0 ml-auto" />
              </button>

              {showEventDropdown && (
                <div className="absolute left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1.5 border-b border-stone-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Switch Event</span>
                    <button
                      onClick={() => {
                        setShowEventDropdown(false);
                        onOpenWizard();
                      }}
                      className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> New
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto py-1">
                    {events.map(evt => (
                      <button
                        key={evt.id}
                        onClick={() => {
                          onSelectEvent(evt.id);
                          setShowEventDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-stone-50 flex items-center justify-between gap-2 transition-colors ${
                          evt.id === activeEvent.id ? 'bg-emerald-50/70 text-emerald-900 font-medium' : 'text-stone-700'
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{evt.name}</p>
                          <p className="text-[11px] text-stone-400 capitalize">{evt.type} • {evt.city}</p>
                        </div>
                        {evt.id === activeEvent.id && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Demo Mode / AI Mode Badge */}
          <button
            onClick={onToggleDemoMode}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
              isDemoMode 
                ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100' 
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            }`}
            title="Click to toggle between Demo Mode and Live AI integration"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isDemoMode ? 'Demo Sandbox' : 'Live Mode'}</span>
          </button>

          {/* Currency Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setShowCurrencyDropdown(!showCurrencyDropdown);
                setShowEventDropdown(false);
                setShowNotifications(false);
                setShowUserMenu(false);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold"
              title="Change Currency"
            >
              <Coins className="w-3.5 h-3.5 text-stone-500" />
              <span>{currency}</span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>

            {showCurrencyDropdown && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-stone-200 py-1 z-50">
                {(['INR', 'USD', 'EUR', 'GBP', 'AED'] as CurrencyCode[]).map(cur => (
                  <button
                    key={cur}
                    onClick={() => {
                      onSelectCurrency(cur);
                      setShowCurrencyDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-stone-50 flex items-center justify-between ${
                      cur === currency ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-stone-700'
                    }`}
                  >
                    <span>{cur}</span>
                    {cur === currency && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowEventDropdown(false);
                setShowCurrencyDropdown(false);
                setShowUserMenu(false);
              }}
              className="relative p-2 rounded-lg text-stone-600 hover:bg-stone-100 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in">
                <div className="px-3 py-1.5 border-b border-stone-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800">Notifications ({unreadNotifs.length} new)</span>
                  <button
                    onClick={() => EventStore.clearNotifications()}
                    className="text-[11px] text-stone-400 hover:text-stone-600"
                  >
                    Clear All
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-stone-100">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-xs text-stone-400 text-center">No new notifications</p>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id}
                        onClick={() => {
                          EventStore.markNotificationAsRead(n.id);
                          if (n.linkTab) onNavigateTab(n.linkTab);
                          setShowNotifications(false);
                        }}
                        className={`p-3 text-xs hover:bg-stone-50 cursor-pointer transition-colors ${
                          !n.read ? 'bg-emerald-50/40' : ''
                        }`}
                      >
                        <p className="font-semibold text-stone-800 flex items-center gap-1.5">
                          {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
                          {n.title}
                        </p>
                        <p className="text-stone-600 text-[11px] mt-0.5">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Create Event Button */}
          <button
            onClick={onOpenWizard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Event</span>
          </button>

          {/* User Account Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowEventDropdown(false);
                setShowCurrencyDropdown(false);
                setShowNotifications(false);
              }}
              className="w-8 h-8 rounded-full bg-stone-200 border border-stone-300 text-stone-700 flex items-center justify-center font-bold text-xs hover:ring-2 hover:ring-emerald-700 transition-all cursor-pointer"
              title="User Account"
            >
              SP
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50">
                <div className="px-3 py-2 border-b border-stone-100">
                  <p className="text-xs font-bold text-stone-800">Sainadh Puvvada</p>
                  <p className="text-[11px] text-stone-500 truncate">sainadhpuvvada2005@gmail.com</p>
                  <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-medium">
                    Event Director
                  </span>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onNavigateTab('settings');
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                  >
                    <Layers className="w-3.5 h-3.5 text-stone-400" />
                    Firebase & System Status
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      EventStore.resetToDemo();
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-amber-700 hover:bg-amber-50 flex items-center gap-2"
                  >
                    Reset Sample Demo Data
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenAuth();
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-stone-700 hover:bg-stone-50 border-t border-stone-100 flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-stone-400" />
                    Switch User / Sign In
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
