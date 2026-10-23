import { BudgetItem, GuestItem, EventDetails, TaskItem, VendorItem } from '../types';

export function exportBudgetToCsv(budgetItems: BudgetItem[], eventName: string): void {
  const headers = ['Category', 'Item Name', 'Estimated Cost', 'Actual Cost', 'Advance Paid', 'Balance Due', 'Payment Status', 'Due Date', 'Vendor', 'Notes'];
  
  const rows = budgetItems.map(item => [
    item.category,
    `"${(item.name || '').replace(/"/g, '""')}"`,
    item.estimatedCost,
    item.actualCost,
    item.advancePaid,
    item.actualCost - item.advancePaid,
    item.paymentStatus,
    item.dueDate || '',
    `"${(item.vendorName || '').replace(/"/g, '""')}"`,
    `"${(item.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  downloadBlob(csvContent, `${eventName.replace(/\s+/g, '_')}_Budget.csv`, 'text/csv;charset=utf-8;');
}

export function exportGuestsToCsv(guests: GuestItem[], eventName: string): void {
  const headers = ['Name', 'Category / Group', 'Invitation Status', 'RSVP Status', 'Attendance', 'Dietary Preference', 'Table', 'Plus Ones', 'Phone', 'Email', 'Notes'];

  const rows = guests.map(g => [
    `"${(g.name || '').replace(/"/g, '""')}"`,
    `"${(g.groupCategory || '').replace(/"/g, '""')}"`,
    g.invitationStatus,
    g.rsvpStatus,
    g.attendanceStatus,
    g.dietaryPreference,
    `"${g.tableNumber || ''}"`,
    g.plusOnes,
    `"${g.phone || ''}"`,
    `"${g.email || ''}"`,
    `"${(g.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  downloadBlob(csvContent, `${eventName.replace(/\s+/g, '_')}_Guests.csv`, 'text/csv;charset=utf-8;');
}

export function exportEventExecutiveSummary(
  event: EventDetails, 
  budgetItems: BudgetItem[], 
  tasks: TaskItem[], 
  vendors: VendorItem[], 
  guests: GuestItem[]
): void {
  const totalActual = budgetItems.reduce((acc, b) => acc + b.actualCost, 0);
  const remaining = event.totalBudget - totalActual;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const acceptedGuests = guests.filter(g => g.rsvpStatus === 'accepted').reduce((acc, g) => acc + 1 + (g.plusOnes || 0), 0);

  const content = `
======================================================
GATHERLY AI — EXECUTIVE EVENT MASTER DOSSIER
======================================================
Event Name: ${event.name}
Event Type: ${event.type.toUpperCase()}
Date: ${event.date} (${event.startTime || '10:00'} to ${event.endTime || '22:00'})
City & Venue: ${event.city} — ${event.venue || 'TBD'}
Theme: ${event.theme || 'Custom'}
Setting: ${event.setting}

FINANCIAL SNAPSHOT:
Total Authorized Budget: ${event.currency} ${event.totalBudget.toLocaleString()}
Total Actual Expenses:   ${event.currency} ${totalActual.toLocaleString()}
Remaining Net Budget:    ${event.currency} ${remaining.toLocaleString()} (${((remaining / event.totalBudget) * 100).toFixed(1)}%)

GUEST OPERATIONS:
Target Headcount:        ${event.guestCount}
RSVP Confirmed Headcount:${acceptedGuests} (${((acceptedGuests / event.guestCount) * 100).toFixed(1)}%)

TASK VELOCITY:
Total Milestone Tasks:   ${tasks.length}
Completed Tasks:         ${completedTasks} / ${tasks.length} (${Math.round((completedTasks / (tasks.length || 1)) * 100)}%)

VENDORS ENGAGED (${vendors.length}):
${vendors.map(v => `- ${v.name} (${v.category}) [${v.bookingStatus.toUpperCase()}] - ${event.currency} ${v.quotationAmount.toLocaleString()}`).join('\n')}

======================================================
Generated via Gatherly AI — Plan Smarter. Celebrate Better.
Export Date: ${new Date().toLocaleString()}
======================================================
  `.trim();

  downloadBlob(content, `${event.name.replace(/\s+/g, '_')}_Executive_Summary.txt`, 'text/plain;charset=utf-8;');
}

function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
