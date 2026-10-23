import React from 'react';
import { 
  FileSpreadsheet, 
  Printer, 
  Download, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  Wallet, 
  Users, 
  Clock, 
  Store 
} from 'lucide-react';
import { EventDetails, BudgetItem, TaskItem, VendorItem, GuestItem } from '../types';
import { formatCurrency, formatDate } from '../services/storage';
import { exportBudgetToCsv, exportGuestsToCsv, exportEventExecutiveSummary } from '../services/exportUtils';

interface ReportsExportProps {
  event: EventDetails;
  budgetItems: BudgetItem[];
  tasks: TaskItem[];
  vendors: VendorItem[];
  guests: GuestItem[];
}

export const ReportsExport: React.FC<ReportsExportProps> = ({
  event,
  budgetItems,
  tasks,
  vendors,
  guests
}) => {
  const totalActual = budgetItems.reduce((acc, b) => acc + (b.actualCost || 0), 0);
  const remaining = event.totalBudget - totalActual;
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const acceptedGuests = guests.filter(g => g.rsvpStatus === 'accepted');
  const totalConfirmedPax = acceptedGuests.reduce((acc, g) => acc + 1 + (g.plusOnes || 0), 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-stone-900 flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-emerald-800" />
            <span>Reports, Audits & Print Center</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Export comprehensive event dossiers, variance audits, vendor checklists, and printable run-sheets.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => exportEventExecutiveSummary(event, budgetItems, tasks, vendors, guests)}
            className="px-3.5 py-2 rounded-xl border border-stone-300 hover:bg-stone-50 text-xs font-bold text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Master Text Dossier</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Executive Dossier (PDF)</span>
          </button>
        </div>
      </div>

      {/* Quick Download Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:hidden">
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-stone-900">Financial Ledger Export</h4>
            <p className="text-xs text-stone-500 mt-0.5">All {budgetItems.length} expenses with advances and dues</p>
          </div>
          <button
            onClick={() => exportBudgetToCsv(budgetItems, event.name)}
            className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-emerald-50 hover:text-emerald-900 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
          >
            CSV Format
          </button>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-stone-900">Guest Attendance & RSVP Export</h4>
            <p className="text-xs text-stone-500 mt-0.5">Guest list, plus-ones, dietary tags and tables</p>
          </div>
          <button
            onClick={() => exportGuestsToCsv(guests, event.name)}
            className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-emerald-50 hover:text-emerald-900 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
          >
            CSV Format
          </button>
        </div>
      </div>

      {/* PRINTABLE DOSSIER SHEET */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-md space-y-8 font-sans print:border-none print:shadow-none print:p-0">
        
        {/* Dossier Header */}
        <div className="border-b-2 border-emerald-900 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest text-emerald-800 uppercase">
              Official Gatherly AI Dossier
            </span>
            <h2 className="text-3xl font-bold font-display text-stone-900 mt-1">
              {event.name}
            </h2>
            <p className="text-sm text-stone-600 mt-1">
              {formatDate(event.date)} • {event.venue ? `${event.venue}, ` : ''}{event.city}
            </p>
          </div>

          <div className="text-right text-xs text-stone-500">
            <p><strong>Generated:</strong> {new Date().toLocaleDateString()}</p>
            <p><strong>Status:</strong> <span className="capitalize">{event.status}</span></p>
          </div>
        </div>

        {/* Executive Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <span className="font-bold uppercase text-stone-400 text-[10px]">Authorized Budget</span>
            <p className="text-lg font-bold text-stone-900 mt-1">{formatCurrency(event.totalBudget, event.currency)}</p>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <span className="font-bold uppercase text-stone-400 text-[10px]">Committed Expenses</span>
            <p className="text-lg font-bold text-emerald-900 mt-1">{formatCurrency(totalActual, event.currency)}</p>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <span className="font-bold uppercase text-stone-400 text-[10px]">Remaining Net Buffer</span>
            <p className="text-lg font-bold text-teal-800 mt-1">{formatCurrency(remaining, event.currency)}</p>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <span className="font-bold uppercase text-stone-400 text-[10px]">RSVP Confirmed Pax</span>
            <p className="text-lg font-bold text-stone-900 mt-1">{totalConfirmedPax} / {event.guestCount}</p>
          </div>
        </div>

        {/* Section 1: Budget Summary */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-stone-900 font-display border-b border-stone-200 pb-2">
            1. Comprehensive Financial Breakdown
          </h3>

          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-100 text-stone-600 uppercase text-[10px]">
              <tr>
                <th className="p-2">Item Name</th>
                <th className="p-2">Category</th>
                <th className="p-2 text-right">Actual Cost</th>
                <th className="p-2 text-right">Advance Paid</th>
                <th className="p-2 text-right">Balance Due</th>
                <th className="p-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {budgetItems.map(item => (
                <tr key={item.id}>
                  <td className="p-2 font-medium">{item.name}</td>
                  <td className="p-2 capitalize text-stone-500">{item.category.replace('_', ' ')}</td>
                  <td className="p-2 text-right font-bold">{formatCurrency(item.actualCost, event.currency)}</td>
                  <td className="p-2 text-right">{formatCurrency(item.advancePaid, event.currency)}</td>
                  <td className="p-2 text-right font-semibold text-amber-700">{formatCurrency(item.actualCost - item.advancePaid, event.currency)}</td>
                  <td className="p-2 text-center capitalize">{item.paymentStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 2: Vendors List */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-stone-900 font-display border-b border-stone-200 pb-2">
            2. Confirmed & Engaged Vendor Directory
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {vendors.map(v => (
              <div key={v.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900">{v.name}</span>
                  <span className="text-[10px] font-bold uppercase bg-stone-200 px-1.5 py-0.5 rounded">{v.bookingStatus}</span>
                </div>
                <p className="text-[11px] text-stone-500 mt-0.5 capitalize">{v.category} • Contact: {v.contactPerson} ({v.phone})</p>
                <p className="font-bold text-emerald-800 text-xs mt-1">{formatCurrency(v.quotationAmount, event.currency)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Priority Pending Tasks */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-stone-900 font-display border-b border-stone-200 pb-2">
            3. Open Action Items & Deliverables ({pendingTasks.length} Pending)
          </h3>

          <div className="space-y-1.5 text-xs">
            {pendingTasks.map(t => (
              <div key={t.id} className="p-2.5 rounded-lg border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-stone-900">{t.title}</span>
                  {t.assignedTo && <span className="text-[11px] text-stone-500 ml-2">(Lead: {t.assignedTo})</span>}
                </div>
                <span className="text-stone-500 font-medium">Due: {formatDate(t.dueDate)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dossier Footer */}
        <div className="pt-6 border-t border-stone-200 text-center text-xs text-stone-400">
          Gatherly AI — Plan Smarter. Celebrate Better. Document valid for event coordinators and committee members.
        </div>

      </div>

    </div>
  );
};
