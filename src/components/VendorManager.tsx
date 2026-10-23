import React, { useState } from 'react';
import { 
  Store, 
  Plus, 
  Phone, 
  Mail, 
  FileText, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Filter, 
  Edit3, 
  Trash2, 
  X, 
  Coins, 
  Scale, 
  Sparkles,
  Paperclip,
  Check
} from 'lucide-react';
import { EventDetails, VendorItem, VendorCategory, BookingStatus } from '../types';
import { EventStore, formatCurrency } from '../services/storage';

interface VendorManagerProps {
  event: EventDetails;
  vendors: VendorItem[];
  onRefreshData: () => void;
}

const VENDOR_CATEGORIES: { id: VendorCategory; label: string }[] = [
  { id: 'venues', label: 'Venues & Banquets' },
  { id: 'caterers', label: 'Caterers & Food' },
  { id: 'decorators', label: 'Decorators & Florals' },
  { id: 'photographers', label: 'Photographers' },
  { id: 'videographers', label: 'Videographers' },
  { id: 'makeup_artists', label: 'Makeup & Hair Artists' },
  { id: 'entertainment', label: 'Entertainment & DJ' },
  { id: 'transport', label: 'Transport & Cabs' },
  { id: 'equipment', label: 'Equipment & AV' },
  { id: 'invitation_designers', label: 'Invitation Designers' }
];

export const VendorManager: React.FC<VendorManagerProps> = ({
  event,
  vendors,
  onRefreshData
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<VendorItem | null>(null);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<VendorCategory>('caterers');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [quotationAmount, setQuotationAmount] = useState<number>(100000);
  const [servicesOffered, setServicesOffered] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'unpaid' | 'partial' | 'paid'>('unpaid');
  const [bookingStatus, setBookingStatus] = useState<BookingStatus>('shortlisted');
  const [notes, setNotes] = useState('');
  const [attachmentName, setAttachmentName] = useState('');

  const filteredVendors = vendors.filter(v => {
    const matchesCat = categoryFilter === 'all' || v.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || v.bookingStatus === statusFilter;
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.servicesOffered.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesStatus && matchesSearch;
  });

  const bookedVendors = vendors.filter(v => v.bookingStatus === 'booked');
  const shortlistedVendors = vendors.filter(v => v.bookingStatus === 'shortlisted');
  const totalBookedCommitment = bookedVendors.reduce((acc, v) => acc + (v.quotationAmount || 0), 0);

  const handleOpenAdd = () => {
    setEditingVendor(null);
    setName('');
    setCategory('caterers');
    setContactPerson('');
    setPhone('');
    setEmail('');
    setQuotationAmount(75000);
    setServicesOffered('');
    setPaymentStatus('unpaid');
    setBookingStatus('contacted');
    setNotes('');
    setAttachmentName('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (v: VendorItem) => {
    setEditingVendor(v);
    setName(v.name);
    setCategory(v.category);
    setContactPerson(v.contactPerson);
    setPhone(v.phone);
    setEmail(v.email);
    setQuotationAmount(v.quotationAmount);
    setServicesOffered(v.servicesOffered);
    setPaymentStatus(v.paymentStatus);
    setBookingStatus(v.bookingStatus);
    setNotes(v.notes || '');
    setAttachmentName(v.attachmentName || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingVendor) {
      EventStore.updateVendor(editingVendor.id, {
        name,
        category,
        contactPerson,
        phone,
        email,
        quotationAmount: Number(quotationAmount),
        servicesOffered,
        paymentStatus,
        bookingStatus,
        notes,
        attachmentName
      });
    } else {
      EventStore.addVendor({
        eventId: event.id,
        name,
        category,
        contactPerson,
        phone,
        email,
        quotationAmount: Number(quotationAmount),
        servicesOffered,
        paymentStatus,
        bookingStatus,
        notes,
        attachmentName
      });
    }

    setIsModalOpen(false);
    onRefreshData();
  };

  const handleDelete = (id: string) => {
    if (confirm('Remove this vendor from the event directory?')) {
      EventStore.deleteVendor(id);
      onRefreshData();
    }
  };

  const toggleCompare = (id: string) => {
    if (selectedForCompare.includes(id)) {
      setSelectedForCompare(selectedForCompare.filter(i => i !== id));
    } else {
      if (selectedForCompare.length >= 3) {
        alert('You can compare up to 3 vendors simultaneously.');
        return;
      }
      setSelectedForCompare([...selectedForCompare, id]);
    }
  };

  const comparedVendors = vendors.filter(v => selectedForCompare.includes(v.id));

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-stone-900 flex items-center gap-2">
            <Store className="w-6 h-6 text-emerald-800" />
            <span>Vendor Management & Directory</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Compare vendor proposals, track contract attachments, manage bookings, and coordinate point contacts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {selectedForCompare.length > 1 && (
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Scale className="w-4 h-4" />
              <span>Compare ({selectedForCompare.length})</span>
            </button>
          )}

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vendor</span>
          </button>
        </div>
      </div>

      {/* Snapshot metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Total Vendors</span>
          <p className="text-2xl font-bold font-display text-stone-900 mt-1">{vendors.length}</p>
          <p className="text-[11px] text-stone-400 mt-0.5">In master directory</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Booked & Locked</span>
          <p className="text-2xl font-bold font-display text-emerald-800 mt-1">{bookedVendors.length}</p>
          <p className="text-[11px] text-stone-400 mt-0.5">Contracts finalized</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Shortlisted</span>
          <p className="text-2xl font-bold font-display text-amber-700 mt-1">{shortlistedVendors.length}</p>
          <p className="text-[11px] text-stone-400 mt-0.5">Evaluating quotations</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Booked Commitment</span>
          <p className="text-2xl font-bold font-display text-teal-900 mt-1">
            {formatCurrency(totalBookedCommitment, event.currency)}
          </p>
          <p className="text-[11px] text-stone-400 mt-0.5">Across confirmed partners</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search vendor name, contact person, or services..."
            className="w-full sm:w-80 px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-semibold bg-white"
            >
              <option value="all">All Categories</option>
              {VENDOR_CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-semibold bg-white"
            >
              <option value="all">All Booking Statuses</option>
              <option value="contacted">Contacted</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="booked">Booked</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Vendors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {filteredVendors.map(vendor => {
            const isSelected = selectedForCompare.includes(vendor.id);
            return (
              <div 
                key={vendor.id}
                className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between shadow-2xs ${
                  isSelected ? 'border-amber-400 ring-2 ring-amber-300' : 'border-stone-200 hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {vendor.category.replace('_', ' ')}
                      </span>
                      <h3 className="text-base font-bold text-stone-900 mt-1.5">
                        {vendor.name}
                      </h3>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      vendor.bookingStatus === 'booked'
                        ? 'bg-emerald-100 text-emerald-800'
                        : vendor.bookingStatus === 'shortlisted'
                          ? 'bg-amber-100 text-amber-800'
                          : vendor.bookingStatus === 'rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-stone-100 text-stone-700'
                    }`}>
                      {vendor.bookingStatus.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 mt-2 line-clamp-2">
                    {vendor.servicesOffered || 'No specific services description listed.'}
                  </p>

                  <div className="mt-4 pt-3 border-t border-stone-100 space-y-1.5 text-xs text-stone-600">
                    <p className="font-semibold text-stone-800 flex items-center gap-1.5">
                      Contact: <span>{vendor.contactPerson}</span>
                    </p>
                    <p className="flex items-center gap-1.5 text-stone-500">
                      <Phone className="w-3.5 h-3.5 text-stone-400" />
                      <span>{vendor.phone || 'Phone not provided'}</span>
                    </p>
                    <p className="flex items-center gap-1.5 text-stone-500 truncate">
                      <Mail className="w-3.5 h-3.5 text-stone-400" />
                      <span>{vendor.email || 'Email not provided'}</span>
                    </p>
                  </div>

                  {vendor.attachmentName && (
                    <div className="mt-3 p-2 bg-stone-50 rounded-xl border border-stone-200/80 text-[11px] text-stone-600 flex items-center gap-1.5 truncate">
                      <Paperclip className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="truncate">{vendor.attachmentName}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400">Quote</span>
                    <p className="text-base font-bold text-stone-900 font-display">
                      {formatCurrency(vendor.quotationAmount, event.currency)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleCompare(vendor.id)}
                      className={`p-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                        isSelected 
                          ? 'bg-amber-100 text-amber-900 border-amber-300' 
                          : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                      title="Compare Quotation"
                    >
                      <Scale className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(vendor)}
                      className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer"
                      title="Edit Vendor"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(vendor.id)}
                      className="p-1.5 rounded-lg border border-stone-200 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Delete Vendor"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredVendors.length === 0 && (
            <div className="col-span-full py-12 text-center text-xs text-stone-400">
              No vendors found matching your filter selection.
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Vendor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900 font-display">
                {editingVendor ? 'Edit Vendor Dossier' : 'Add New Vendor'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Vendor / Business Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Maharaja Royal Caterers"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as VendorCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white capitalize"
                  >
                    {VENDOR_CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Quotation Amount</label>
                  <input
                    type="number"
                    min="0"
                    value={quotationAmount}
                    onChange={e => setQuotationAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={e => setContactPerson(e.target.value)}
                    placeholder="e.g. Chef Lalit"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="contact@..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Booking Status</label>
                  <select
                    value={bookingStatus}
                    onChange={e => setBookingStatus(e.target.value as BookingStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="contacted">Contacted</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="booked">Booked (Confirmed)</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Payment Status</label>
                  <select
                    value={paymentStatus}
                    onChange={e => setPaymentStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="partial">Partial</option>
                    <option value="paid">Fully Paid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Services Offered & Deliverables</label>
                <textarea
                  rows={2}
                  value={servicesOffered}
                  onChange={e => setServicesOffered(e.target.value)}
                  placeholder="e.g. Multi-cuisine Rajasthani buffet, 4 live chaat counters, copper chaffing ware."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Contract / Quotation File Name</label>
                  <input
                    type="text"
                    value={attachmentName}
                    onChange={e => setAttachmentName(e.target.value)}
                    placeholder="e.g. Maharaja_Contract_Signed.pdf"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Internal Notes</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Special negotiated rates, curfew terms..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 font-bold text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 text-white font-bold hover:bg-emerald-900 shadow-xs"
                >
                  Save Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-stone-900 font-display">
                  Side-by-Side Vendor Quotation Comparison
                </h3>
              </div>
              <button onClick={() => setIsCompareModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {comparedVendors.map(v => (
                <div key={v.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      {v.category}
                    </span>
                    <h4 className="text-base font-bold text-stone-900 mt-1">{v.name}</h4>
                    <p className="text-lg font-bold font-display text-emerald-900 mt-2">
                      {formatCurrency(v.quotationAmount, event.currency)}
                    </p>
                  </div>

                  <div className="text-xs space-y-1.5 border-t border-stone-200 pt-2">
                    <p><strong>Booking Status:</strong> <span className="capitalize">{v.bookingStatus}</span></p>
                    <p><strong>Contact:</strong> {v.contactPerson} ({v.phone})</p>
                    <p className="text-stone-600"><strong>Scope:</strong> {v.servicesOffered}</p>
                    {v.notes && <p className="text-stone-500 italic"><strong>Notes:</strong> {v.notes}</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-stone-900 text-white font-bold text-xs"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
