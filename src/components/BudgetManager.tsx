import React, { useState } from 'react';
import { 
  Wallet, 
  Plus, 
  Download, 
  Trash2, 
  Edit3, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Filter, 
  X,
  PieChart as PieIcon,
  BarChart3,
  TrendingDown,
  ArrowUpDown
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
import { EventDetails, BudgetItem, BudgetCategory } from '../types';
import { EventStore, formatCurrency, formatDate } from '../services/storage';
import { exportBudgetToCsv } from '../services/exportUtils';

interface BudgetManagerProps {
  event: EventDetails;
  budgetItems: BudgetItem[];
  onRefreshData: () => void;
  onNavigateTab: (tab: string) => void;
}

const CATEGORIES: { id: BudgetCategory; label: string; color: string }[] = [
  { id: 'venue', label: 'Venue & Banquets', color: '#1b4332' },
  { id: 'catering', label: 'Catering & Food Service', color: '#d97706' },
  { id: 'decorations', label: 'Decorations & Florals', color: '#b45309' },
  { id: 'photography', label: 'Photo & Videography', color: '#2563eb' },
  { id: 'entertainment', label: 'Entertainment & DJ', color: '#7c3aed' },
  { id: 'clothing_makeup', label: 'Clothing & Makeup', color: '#db2777' },
  { id: 'invitations', label: 'Invitations & Stationery', color: '#059669' },
  { id: 'transportation', label: 'Transportation & Logistics', color: '#475569' },
  { id: 'accommodation', label: 'Guest Accommodation', color: '#0891b2' },
  { id: 'equipment', label: 'Sound & Audio Visual', color: '#4f46e5' },
  { id: 'miscellaneous', label: 'Miscellaneous', color: '#64748b' },
  { id: 'emergency_reserve', label: 'Emergency Reserve', color: '#e11d48' }
];

export const BudgetManager: React.FC<BudgetManagerProps> = ({
  event,
  budgetItems,
  onRefreshData,
  onNavigateTab
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);

  // Form states
  const [formCategory, setFormCategory] = useState<BudgetCategory>('catering');
  const [formName, setFormName] = useState('');
  const [formEstimated, setFormEstimated] = useState<number>(50000);
  const [formActual, setFormActual] = useState<number>(50000);
  const [formAdvance, setFormAdvance] = useState<number>(0);
  const [formStatus, setFormStatus] = useState<'unpaid' | 'partial' | 'paid'>('unpaid');
  const [formDueDate, setFormDueDate] = useState('2026-11-10');
  const [formVendor, setFormVendor] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Calculations
  const totalBudget = event.totalBudget || 0;
  const totalActual = budgetItems.reduce((acc, b) => acc + (b.actualCost || 0), 0);
  const totalEstimated = budgetItems.reduce((acc, b) => acc + (b.estimatedCost || 0), 0);
  const totalAdvancePaid = budgetItems.reduce((acc, b) => acc + (b.advancePaid || 0), 0);
  const totalBalanceDue = totalActual - totalAdvancePaid;
  const remainingBudget = totalBudget - totalActual;
  const isOverBudget = remainingBudget < 0;
  const variance = totalEstimated - totalActual;

  const filteredItems = budgetItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.vendorName || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormCategory('catering');
    setFormName('');
    setFormEstimated(25000);
    setFormActual(25000);
    setFormAdvance(0);
    setFormStatus('unpaid');
    setFormDueDate('2026-11-15');
    setFormVendor('');
    setFormNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: BudgetItem) => {
    setEditingItem(item);
    setFormCategory(item.category);
    setFormName(item.name);
    setFormEstimated(item.estimatedCost);
    setFormActual(item.actualCost);
    setFormAdvance(item.advancePaid);
    setFormStatus(item.paymentStatus);
    setFormDueDate(item.dueDate || '');
    setFormVendor(item.vendorName || '');
    setFormNotes(item.notes || '');
    setIsModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingItem) {
      EventStore.updateBudgetItem(editingItem.id, {
        category: formCategory,
        name: formName,
        estimatedCost: Number(formEstimated),
        actualCost: Number(formActual),
        advancePaid: Number(formAdvance),
        paymentStatus: formStatus,
        dueDate: formDueDate,
        vendorName: formVendor,
        notes: formNotes
      });
    } else {
      EventStore.addBudgetItem({
        eventId: event.id,
        category: formCategory,
        name: formName,
        estimatedCost: Number(formEstimated),
        actualCost: Number(formActual),
        advancePaid: Number(formAdvance),
        paymentStatus: formStatus,
        dueDate: formDueDate,
        vendorName: formVendor,
        notes: formNotes
      });
    }

    setIsModalOpen(false);
    onRefreshData();
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Are you sure you want to delete this expense entry?')) {
      EventStore.deleteBudgetItem(id);
      onRefreshData();
    }
  };

  // Chart preparation
  const categorySummary = CATEGORIES.map(cat => {
    const items = budgetItems.filter(b => b.category === cat.id);
    const cost = items.reduce((acc, b) => acc + (b.actualCost || b.estimatedCost), 0);
    return {
      name: cat.label.split(' ')[0],
      fullName: cat.label,
      cost,
      color: cat.color
    };
  }).filter(c => c.cost > 0);

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Banner / Controls */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-stone-900 flex items-center gap-2">
            <Wallet className="w-6 h-6 text-emerald-800" />
            <span>Smart Budget Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Real-time ledger tracking estimated vs actual costs, advances, vendor commitments, and cost optimization tips.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => exportBudgetToCsv(budgetItems, event.name)}
            className="px-3.5 py-2 rounded-xl border border-stone-300 hover:bg-stone-50 text-xs font-bold text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Warning Banner if over budget */}
      {isOverBudget && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs sm:text-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <p className="font-bold">
                Budget Deficit Warning: Exceeded by {formatCurrency(Math.abs(remainingBudget), event.currency)}!
              </p>
              <p className="text-[11px] text-rose-800">
                Consider re-allocating emergency reserves or shifting to seasonal decor to balance accounts.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('ai-planner')}
            className="px-3 py-1.5 rounded-lg bg-rose-700 text-white text-xs font-bold hover:bg-rose-800 transition-colors shrink-0"
          >
            Ask AI to Trim ₹15k →
          </button>
        </div>
      )}

      {/* Financial Health Snapshot Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Total Planned</span>
          <p className="text-xl sm:text-2xl font-bold font-display text-stone-900 mt-1">
            {formatCurrency(totalBudget, event.currency)}
          </p>
          <p className="text-[11px] text-stone-400 mt-1">Authorized event limit</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Actual Committed</span>
          <p className="text-xl sm:text-2xl font-bold font-display text-emerald-900 mt-1">
            {formatCurrency(totalActual, event.currency)}
          </p>
          <p className="text-[11px] text-stone-400 mt-1">Across {budgetItems.length} line items</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Advance Paid</span>
          <p className="text-xl sm:text-2xl font-bold font-display text-teal-800 mt-1">
            {formatCurrency(totalAdvancePaid, event.currency)}
          </p>
          <p className="text-[11px] text-stone-400 mt-1">Token payments logged</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Outstanding Balance</span>
          <p className="text-xl sm:text-2xl font-bold font-display text-amber-700 mt-1">
            {formatCurrency(totalBalanceDue, event.currency)}
          </p>
          <p className="text-[11px] text-stone-400 mt-1">Due before event day</p>
        </div>

      </div>

      {/* Visual Chart and Category Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Column */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-emerald-700" />
            <span>Category Allocation</span>
          </h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categorySummary}
                  dataKey="cost"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  innerRadius={40}
                  paddingAngle={2}
                >
                  {categorySummary.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(val: any) => formatCurrency(Number(val), event.currency)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] text-stone-500 text-center">
            Remaining Net Buffer: <span className="font-bold text-emerald-800">{formatCurrency(remainingBudget, event.currency)}</span>
          </div>
        </div>

        {/* Cost Reduction Recommendations Column */}
        <div className="lg:col-span-2 bg-gradient-to-br from-amber-50/60 to-orange-50/40 rounded-2xl p-6 border border-amber-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-amber-950 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>AI Cost Reduction Strategies for {event.name}</span>
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              Smart Tips
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-amber-950/90">
            <div className="p-3 bg-white/80 rounded-xl border border-amber-200/70 space-y-1">
              <p className="font-bold text-amber-900">🌸 Floral & Stage Decor</p>
              <p className="text-[11px] leading-relaxed">
                Replace imported exotic flowers with fragrant local marigolds and tuberose to save approximately ₹15,000–₹25,000 without reducing visual grandeur.
              </p>
            </div>

            <div className="p-3 bg-white/80 rounded-xl border border-amber-200/70 space-y-1">
              <p className="font-bold text-amber-900">🍽️ Catering Quantity Optimization</p>
              <p className="text-[11px] leading-relaxed">
                Firm up your digital RSVPs 10 days before the wedding. Cutting 25 unconfirmed headcount buffers saves ₹35,000+ in wasted catering prep.
              </p>
            </div>

            <div className="p-3 bg-white/80 rounded-xl border border-amber-200/70 space-y-1">
              <p className="font-bold text-amber-900">📸 Vendor Packaging</p>
              <p className="text-[11px] leading-relaxed">
                Bundle Candid Photography, Drone Videography, and Pre-wedding Reels under a single studio team to negotiate a 12–15% package rebate.
              </p>
            </div>

            <div className="p-3 bg-white/80 rounded-xl border border-amber-200/70 space-y-1">
              <p className="font-bold text-amber-900">✉️ Digital Invites & Itineraries</p>
              <p className="text-[11px] leading-relaxed">
                Use Gatherly AI WhatsApp interactive itinerary cards for extended circles, keeping heavy printed box invites exclusively for close elders.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search expense item or vendor name..."
            className="w-full sm:w-72 px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-emerald-800 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              All Categories ({budgetItems.length})
            </button>
            {CATEGORIES.slice(0, 5).map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-800 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat.label.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Budget Items Table */}
        <div className="overflow-x-auto border border-stone-200 rounded-xl">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="p-3">Expense Item</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-right">Estimated</th>
                <th className="p-3 text-right">Actual Cost</th>
                <th className="p-3 text-right">Advance Paid</th>
                <th className="p-3 text-right">Balance Due</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3">Due Date</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredItems.map(item => {
                const balance = item.actualCost - item.advancePaid;
                return (
                  <tr key={item.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="p-3 font-semibold text-stone-900">
                      <div>
                        <span>{item.name}</span>
                        {item.vendorName && (
                          <span className="block text-[11px] text-stone-400 font-normal">
                            Vendor: {item.vendorName}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-3">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-stone-100 text-[10px] font-semibold text-stone-700 capitalize">
                        {item.category.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="p-3 text-right text-stone-500">
                      {formatCurrency(item.estimatedCost, event.currency)}
                    </td>

                    <td className="p-3 text-right font-bold text-stone-900">
                      {formatCurrency(item.actualCost, event.currency)}
                    </td>

                    <td className="p-3 text-right text-teal-700 font-semibold">
                      {formatCurrency(item.advancePaid, event.currency)}
                    </td>

                    <td className="p-3 text-right font-semibold text-amber-700">
                      {formatCurrency(balance, event.currency)}
                    </td>

                    <td className="p-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.paymentStatus === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.paymentStatus === 'partial'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                      }`}>
                        {item.paymentStatus.toUpperCase()}
                      </span>
                    </td>

                    <td className="p-3 text-stone-500 whitespace-nowrap">
                      {item.dueDate ? formatDate(item.dueDate) : '—'}
                    </td>

                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                          title="Edit Expense"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete Expense"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-stone-400">
                    No expense line items matching your query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900 font-display">
                {editingItem ? 'Edit Budget Expense' : 'Add New Budget Expense'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Expense Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="e.g. Royal Marigold Mandap Setup"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value as BudgetCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white capitalize"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Vendor Name</label>
                  <input
                    type="text"
                    value={formVendor}
                    onChange={e => setFormVendor(e.target.value)}
                    placeholder="e.g. Vedic Blooms Co."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Estimated Cost</label>
                  <input
                    type="number"
                    min="0"
                    value={formEstimated}
                    onChange={e => setFormEstimated(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Actual Cost</label>
                  <input
                    type="number"
                    min="0"
                    value={formActual}
                    onChange={e => setFormActual(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Advance Paid</label>
                  <input
                    type="number"
                    min="0"
                    value={formAdvance}
                    onChange={e => setFormAdvance(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Payment Status</label>
                  <select
                    value={formStatus}
                    onChange={e => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="partial">Partial Payment</option>
                    <option value="paid">Fully Paid</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={formDueDate}
                    onChange={e => setFormDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Notes / Scope details</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  placeholder="Terms, deliverables, GST details..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 hover:bg-stone-50 font-bold text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold transition-all shadow-xs"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
