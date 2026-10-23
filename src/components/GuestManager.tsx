import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Download, 
  Mail, 
  Phone, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Filter, 
  Edit3, 
  Trash2, 
  X, 
  Utensils, 
  Sparkles,
  Calculator,
  UserPlus
} from 'lucide-react';
import { EventDetails, GuestItem, RsvpStatus, AttendanceStatus, DietaryOption } from '../types';
import { EventStore } from '../services/storage';
import { exportGuestsToCsv } from '../services/exportUtils';

interface GuestManagerProps {
  event: EventDetails;
  guests: GuestItem[];
  onRefreshData: () => void;
}

export const GuestManager: React.FC<GuestManagerProps> = ({
  event,
  guests,
  onRefreshData
}) => {
  const [rsvpFilter, setRsvpFilter] = useState<string>('all');
  const [groupFilter, setGroupFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [bufferPercent, setBufferPercent] = useState<number>(10); // 10% catering buffer
  
  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<GuestItem | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [invitationStatus, setInvitationStatus] = useState<'not_sent' | 'sent'>('sent');
  const [rsvpStatus, setRsvpStatus] = useState<RsvpStatus>('pending');
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>('pending');
  const [dietaryPreference, setDietaryPreference] = useState<DietaryOption>('vegetarian');
  const [groupCategory, setGroupCategory] = useState("Bride's Family");
  const [tableNumber, setTableNumber] = useState('');
  const [plusOnes, setPlusOnes] = useState<number>(0);
  const [notes, setNotes] = useState('');

  // Groups present
  const availableGroups = Array.from(new Set(guests.map(g => g.groupCategory))).filter(Boolean);

  const filteredGuests = guests.filter(g => {
    const matchesRsvp = rsvpFilter === 'all' || g.rsvpStatus === rsvpFilter;
    const matchesGroup = groupFilter === 'all' || g.groupCategory === groupFilter;
    const matchesSearch = g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (g.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (g.phone || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRsvp && matchesGroup && matchesSearch;
  });

  // RSVP Calculations
  const acceptedList = guests.filter(g => g.rsvpStatus === 'accepted');
  const pendingList = guests.filter(g => g.rsvpStatus === 'pending');
  const declinedList = guests.filter(g => g.rsvpStatus === 'declined');

  const confirmedPax = acceptedList.reduce((acc, g) => acc + 1 + (g.plusOnes || 0), 0);
  const pendingPax = pendingList.reduce((acc, g) => acc + 1 + (g.plusOnes || 0), 0);

  // Dietary split among accepted guests
  const dietaryCounts = acceptedList.reduce((acc, g) => {
    const count = 1 + (g.plusOnes || 0);
    acc[g.dietaryPreference] = (acc[g.dietaryPreference] || 0) + count;
    return acc;
  }, {} as Record<string, number>);

  // Catering Quantity Estimation (Clearly labeled transparent assumptions)
  // Estimated base attendee pax = Confirmed Pax + (Pending Pax * 0.5)
  const estimatedActualPax = Math.round(confirmedPax + (pendingPax * 0.5));
  const totalCateringEstimatePax = Math.round(estimatedActualPax * (1 + bufferPercent / 100));

  // Ingredient projections based on catering estimate
  const estimatedPaneerKg = Math.round(totalCateringEstimatePax * 0.12); // ~120g per pax
  const estimatedRiceBasmatiKg = Math.round(totalCateringEstimatePax * 0.10); // ~100g per pax
  const estimatedDalBaatiKg = Math.round(totalCateringEstimatePax * 0.18); // ~180g per pax
  const estimatedSweetsKg = Math.round(totalCateringEstimatePax * 0.09); // ~90g per pax

  const handleOpenAdd = () => {
    setEditingGuest(null);
    setName('');
    setEmail('');
    setPhone('');
    setInvitationStatus('sent');
    setRsvpStatus('pending');
    setAttendanceStatus('pending');
    setDietaryPreference('vegetarian');
    setGroupCategory("Bride's Family");
    setTableNumber('');
    setPlusOnes(0);
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (g: GuestItem) => {
    setEditingGuest(g);
    setName(g.name);
    setEmail(g.email || '');
    setPhone(g.phone || '');
    setInvitationStatus(g.invitationStatus);
    setRsvpStatus(g.rsvpStatus);
    setAttendanceStatus(g.attendanceStatus);
    setDietaryPreference(g.dietaryPreference);
    setGroupCategory(g.groupCategory);
    setTableNumber(g.tableNumber || '');
    setPlusOnes(g.plusOnes || 0);
    setNotes(g.notes || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingGuest) {
      EventStore.updateGuest(editingGuest.id, {
        name,
        email,
        phone,
        invitationStatus,
        rsvpStatus,
        attendanceStatus,
        dietaryPreference,
        groupCategory,
        tableNumber,
        plusOnes: Number(plusOnes),
        notes
      });
    } else {
      EventStore.addGuest({
        eventId: event.id,
        name,
        email,
        phone,
        invitationStatus,
        rsvpStatus,
        attendanceStatus,
        dietaryPreference,
        groupCategory,
        tableNumber,
        plusOnes: Number(plusOnes),
        notes
      });
    }

    setIsModalOpen(false);
    onRefreshData();
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this guest record?')) {
      EventStore.deleteGuest(id);
      onRefreshData();
    }
  };

  const handleQuickRsvp = (id: string, newRsvp: RsvpStatus) => {
    EventStore.updateGuest(id, { 
      rsvpStatus: newRsvp,
      attendanceStatus: newRsvp === 'accepted' ? 'confirmed' : newRsvp === 'declined' ? 'absent' : 'pending'
    });
    onRefreshData();
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-stone-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-800" />
            <span>Guest Management, RSVP & Seating</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Track confirmed RSVPs, dietary requirements, table seating, and auto-estimate catering provisions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => exportGuestsToCsv(guests, event.name)}
            className="px-3.5 py-2 rounded-xl border border-stone-300 hover:bg-stone-50 text-xs font-bold text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Guest</span>
          </button>
        </div>
      </div>

      {/* Snapshot RSVP Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Target Guest Count</span>
          <p className="text-2xl font-bold font-display text-stone-900 mt-1">{event.guestCount}</p>
          <p className="text-[11px] text-stone-400 mt-0.5">Budgeted capacity</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Confirmed Attendees</span>
          <p className="text-2xl font-bold font-display text-emerald-800 mt-1">
            {confirmedPax} Pax
          </p>
          <p className="text-[11px] text-stone-400 mt-0.5">{acceptedList.length} invitations accepted</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">RSVP Pending</span>
          <p className="text-2xl font-bold font-display text-amber-700 mt-1">
            {pendingPax} Pax
          </p>
          <p className="text-[11px] text-stone-400 mt-0.5">{pendingList.length} invitations awaiting reply</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Declined</span>
          <p className="text-2xl font-bold font-display text-stone-400 mt-1">
            {declinedList.length}
          </p>
          <p className="text-[11px] text-stone-400 mt-0.5">Warm regrets received</p>
        </div>

      </div>

      {/* Catering Quantity Estimator Tool */}
      <div className="bg-gradient-to-br from-emerald-900 to-teal-950 rounded-2xl p-6 text-white shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-stone-950 flex items-center justify-center font-bold text-xs">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display">
                Transparent Catering Batch Estimator
              </h3>
              <p className="text-xs text-emerald-200/80">
                Calculates production volume from confirmed RSVPs + configurable attendance assumptions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/20 text-xs">
            <span className="text-emerald-100 font-medium">Contingency Buffer:</span>
            <select
              value={bufferPercent}
              onChange={e => setBufferPercent(Number(e.target.value))}
              className="bg-stone-900 text-white font-bold px-2 py-0.5 rounded-md border border-white/30"
            >
              <option value="5">5% Buffer</option>
              <option value="10">10% Buffer (Standard)</option>
              <option value="15">15% Buffer (Generous)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          <div className="p-3 bg-white/10 rounded-xl border border-white/10">
            <span className="text-[10px] uppercase font-bold text-emerald-200">Total Plates Needed</span>
            <p className="text-xl font-bold text-amber-300 font-display mt-1">{totalCateringEstimatePax} Pax</p>
            <p className="text-[10px] text-emerald-200/70 mt-0.5">Estimated provision</p>
          </div>

          <div className="p-3 bg-white/10 rounded-xl border border-white/10">
            <span className="text-[10px] uppercase font-bold text-emerald-200">Fresh Paneer</span>
            <p className="text-xl font-bold text-white font-display mt-1">~{estimatedPaneerKg} kg</p>
            <p className="text-[10px] text-emerald-200/70 mt-0.5">At 120g/plate</p>
          </div>

          <div className="p-3 bg-white/10 rounded-xl border border-white/10">
            <span className="text-[10px] uppercase font-bold text-emerald-200">Basmati Rice</span>
            <p className="text-xl font-bold text-white font-display mt-1">~{estimatedRiceBasmatiKg} kg</p>
            <p className="text-[10px] text-emerald-200/70 mt-0.5">At 100g/plate</p>
          </div>

          <div className="p-3 bg-white/10 rounded-xl border border-white/10">
            <span className="text-[10px] uppercase font-bold text-emerald-200">Dal Baati / Gravy</span>
            <p className="text-xl font-bold text-white font-display mt-1">~{estimatedDalBaatiKg} kg</p>
            <p className="text-[10px] text-emerald-200/70 mt-0.5">At 180g/plate</p>
          </div>

          <div className="p-3 bg-white/10 rounded-xl border border-white/10">
            <span className="text-[10px] uppercase font-bold text-emerald-200">Desserts / Halwa</span>
            <p className="text-xl font-bold text-white font-display mt-1">~{estimatedSweetsKg} kg</p>
            <p className="text-[10px] text-emerald-200/70 mt-0.5">At 90g/plate</p>
          </div>
        </div>

        <p className="text-[11px] text-emerald-200/70 italic text-right">
          *Estimations calculated for supplier logistics. Actual consumption varies based on guest arrival timing.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search guest by name, email, or phone..."
            className="w-full sm:w-80 px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            <select
              value={rsvpFilter}
              onChange={e => setRsvpFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-semibold bg-white"
            >
              <option value="all">All RSVPs</option>
              <option value="accepted">Accepted ({acceptedList.length})</option>
              <option value="pending">Pending ({pendingList.length})</option>
              <option value="declined">Declined ({declinedList.length})</option>
            </select>

            {availableGroups.length > 0 && (
              <select
                value={groupFilter}
                onChange={e => setGroupFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-semibold bg-white"
              >
                <option value="all">All Groups</option>
                {availableGroups.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Guest Table */}
        <div className="overflow-x-auto border border-stone-200 rounded-xl">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="p-3">Guest / Family</th>
                <th className="p-3">Group Category</th>
                <th className="p-3 text-center">RSVP</th>
                <th className="p-3 text-center">Party Size</th>
                <th className="p-3">Dietary</th>
                <th className="p-3">Table Seating</th>
                <th className="p-3">Contact</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredGuests.map(g => (
                <tr key={g.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="p-3 font-semibold text-stone-900">
                    <div>
                      <span>{g.name}</span>
                      {g.notes && <span className="block text-[11px] text-stone-400 font-normal italic">{g.notes}</span>}
                    </div>
                  </td>

                  <td className="p-3">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-stone-100 text-[10px] font-semibold text-stone-700">
                      {g.groupCategory}
                    </span>
                  </td>

                  <td className="p-3 text-center">
                    <div className="inline-flex items-center gap-1">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        g.rsvpStatus === 'accepted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : g.rsvpStatus === 'declined'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                      }`}>
                        {g.rsvpStatus.toUpperCase()}
                      </span>
                    </div>
                  </td>

                  <td className="p-3 text-center font-bold text-stone-800">
                    {1 + (g.plusOnes || 0)} {g.plusOnes > 0 && <span className="text-[10px] text-stone-400 font-normal">(+{g.plusOnes})</span>}
                  </td>

                  <td className="p-3 capitalize font-medium text-stone-600">
                    {g.dietaryPreference.replace('_', ' ')}
                  </td>

                  <td className="p-3 text-stone-600 font-medium">
                    {g.tableNumber || 'Unassigned'}
                  </td>

                  <td className="p-3 text-stone-500 text-[11px]">
                    {g.phone || g.email || '—'}
                  </td>

                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleQuickRsvp(g.id, g.rsvpStatus === 'accepted' ? 'pending' : 'accepted')}
                        className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                          g.rsvpStatus === 'accepted' ? 'text-emerald-700 hover:text-emerald-900' : 'text-stone-400 hover:text-emerald-700'
                        }`}
                        title="Toggle RSVP Accept"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(g)}
                        className="p-1 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                        title="Edit Guest"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(g.id)}
                        className="p-1 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete Guest"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredGuests.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-stone-400">
                    No guests found matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Guest Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900 font-display">
                {editingGuest ? 'Edit Guest Record' : 'Add Guest to Directory'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Guest / Family Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Dr. Ashok & Meena Verma"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Group / Category</label>
                  <input
                    type="text"
                    value={groupCategory}
                    onChange={e => setGroupCategory(e.target.value)}
                    placeholder="Bride's Family, Groom's Friends..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Plus-Ones / Family Members</label>
                  <input
                    type="number"
                    min="0"
                    value={plusOnes}
                    onChange={e => setPlusOnes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">RSVP Response</label>
                  <select
                    value={rsvpStatus}
                    onChange={e => setRsvpStatus(e.target.value as RsvpStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Dietary Preference</label>
                  <select
                    value={dietaryPreference}
                    onChange={e => setDietaryPreference(e.target.value as DietaryOption)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white capitalize"
                  >
                    <option value="vegetarian">Vegetarian</option>
                    <option value="non_vegetarian">Non-Vegetarian</option>
                    <option value="jain">Pure Jain</option>
                    <option value="vegan">Vegan</option>
                    <option value="halal">Halal</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Table / Seating Assignment</label>
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={e => setTableNumber(e.target.value)}
                    placeholder="e.g. Table 1 - Royal Court"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-medium"
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
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="ashok.verma@..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Notes / Accessibility Requirements</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Wheelchair assistance, arriving on 19th Nov via SpiceJet flight."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
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
                  Save Guest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
