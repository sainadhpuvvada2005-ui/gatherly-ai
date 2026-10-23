import React, { useState } from 'react';
import { 
  UtensilsCrossed, 
  Sparkles, 
  Plus, 
  Trash2, 
  Check, 
  Coffee, 
  Flame, 
  IceCream, 
  Pizza, 
  PartyPopper, 
  Music, 
  Gamepad2, 
  Scale,
  X
} from 'lucide-react';
import { EventDetails, MenuItem } from '../types';
import { EventStore } from '../services/storage';

interface MenuPlannerProps {
  event: EventDetails;
  menuItems: MenuItem[];
  onRefreshData: () => void;
}

export const MenuPlanner: React.FC<MenuPlannerProps> = ({
  event,
  menuItems,
  onRefreshData
}) => {
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [course, setCourse] = useState<MenuItem['course']>('starters');
  const [dietary, setDietary] = useState<MenuItem['dietary']>('veg');
  const [estimatedGrams, setEstimatedGrams] = useState<number>(150);
  const [notes, setNotes] = useState('');

  const courses = [
    { id: 'welcome_drinks', label: 'Welcome Drinks', icon: Coffee },
    { id: 'starters', label: 'Appetizers & Live Counters', icon: Flame },
    { id: 'main_course', label: 'Main Course & Breads', icon: Pizza },
    { id: 'desserts', label: 'Desserts & Sweets', icon: IceCream },
    { id: 'late_night', label: 'Late Night Bites', icon: UtensilsCrossed }
  ];

  const filteredItems = menuItems.filter(item => {
    return courseFilter === 'all' || item.course === courseFilter;
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    EventStore.addMenuItem({
      eventId: event.id,
      name,
      course,
      dietary,
      estimatedPerPersonGrams: Number(estimatedGrams),
      notes
    });

    setIsAddModalOpen(false);
    onRefreshData();
  };

  const handleDeleteItem = (id: string) => {
    EventStore.deleteMenuItem(id);
    onRefreshData();
  };

  // Entertainment Suggestions by Event Type
  const entertainmentIdeas = event.type === 'wedding' ? [
    { title: 'Rajasthani Manganiyar Folk Troup', desc: 'Live Morchang and Kamaicha acoustic welcome during guest arrival' },
    { title: 'Sangeet Choreography Battle', desc: 'Groom squad vs Bride squad coordinated dance performances with DJ' },
    { title: 'Rose Petal & Cold Pyro Entry', desc: 'Safe low-smoke cold spark pyrotechnics during bride and groom grand walk-in' }
  ] : event.type === 'birthday' ? [
    { title: 'Illusionist Magic & Mindreading Show', desc: '45-minute interactive comedy magic tailored for children & families' },
    { title: 'Superhero Obstacle Course & Games', desc: 'Avengers laser maze, tug-of-war, and musical party games with prizes' },
    { title: 'Live Waffle & Cotton Candy Station', desc: 'Interactive live dessert creation cart with sprinkles and chocolate dips' }
  ] : [
    { title: 'Inter-College Battle of the Bands', desc: 'Acoustic and rock line-up featuring campus musicians' },
    { title: 'Neon Laser Light Showcase & DJ Night', desc: 'Line array sound with synced LED stage visuals' },
    { title: 'Food Truck Carnival Court', desc: '8 curated local street food trucks with cashless coupon system' }
  ];

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-stone-900 flex items-center gap-2">
            <UtensilsCrossed className="w-6 h-6 text-emerald-800" />
            <span>Menu & Entertainment Logistics</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Build course-by-course banquet menus, compute raw material weights, and plan ceremony entertainment.
          </p>
        </div>

        <button
          onClick={() => {
            setName('');
            setNotes('');
            setIsAddModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Menu Item</span>
        </button>
      </div>

      {/* Course Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setCourseFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            courseFilter === 'all'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          Full Banquet ({menuItems.length})
        </button>
        {courses.map(c => {
          const count = menuItems.filter(m => m.course === c.id).length;
          return (
            <button
              key={c.id}
              onClick={() => setCourseFilter(c.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                courseFilter === c.id
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              {c.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Menu Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(item => {
          const totalEstimatedKg = ((item.estimatedPerPersonGrams || 150) * event.guestCount) / 1000;

          return (
            <div 
              key={item.id}
              className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {item.course.replace('_', ' ')}
                  </span>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    item.dietary === 'veg' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : item.dietary === 'jain'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                  }`}>
                    {item.dietary.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-base font-bold text-stone-900 mt-2">
                  {item.name}
                </h3>

                {item.notes && (
                  <p className="text-xs text-stone-500 mt-1 italic">
                    {item.notes}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <div className="text-stone-600">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Total Prep</span>
                  <span className="font-bold text-stone-900">~{totalEstimatedKg.toFixed(1)} kg</span>
                  <span className="text-[10px] text-stone-400 ml-1">({item.estimatedPerPersonGrams}g/pax)</span>
                </div>

                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
                  title="Remove dish"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="col-span-full py-12 text-center text-xs text-stone-400 bg-white rounded-2xl border border-stone-200">
            No dishes listed for this course. Click &ldquo;Add Menu Item&rdquo; to expand the catering spread.
          </div>
        )}
      </div>

      {/* Entertainment & Ceremony Activities */}
      <div className="bg-gradient-to-br from-stone-900 to-emerald-950 text-white rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex items-center gap-2">
          <PartyPopper className="w-5 h-5 text-amber-300" />
          <h3 className="text-base font-bold font-display">
            Curated Entertainment & Activity Lineup for {event.name}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {entertainmentIdeas.map((ent, idx) => (
            <div key={idx} className="p-4 bg-white/10 rounded-xl border border-white/10 space-y-1.5">
              <p className="text-xs font-bold text-amber-300">{ent.title}</p>
              <p className="text-xs text-stone-300 leading-relaxed">{ent.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900 font-display">
                Add Dish to Banquet Menu
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Shahi Malai Kofta with Zafrani Gravy"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Course</label>
                  <select
                    value={course}
                    onChange={e => setCourse(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="welcome_drinks">Welcome Drinks</option>
                    <option value="starters">Appetizers & Live Counters</option>
                    <option value="main_course">Main Course</option>
                    <option value="desserts">Desserts & Sweets</option>
                    <option value="late_night">Late Night Bites</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Dietary Tag</label>
                  <select
                    value={dietary}
                    onChange={e => setDietary(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="veg">Vegetarian</option>
                    <option value="non_veg">Non-Vegetarian</option>
                    <option value="jain">Pure Jain</option>
                    <option value="vegan">Vegan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Estimated Grams per Person (g)</label>
                <input
                  type="number"
                  min="20"
                  max="1000"
                  value={estimatedGrams}
                  onChange={e => setEstimatedGrams(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Preparation & Presentation Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Serve hot in copper handis with mint chutney..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 font-bold text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 text-white font-bold hover:bg-emerald-900 shadow-xs"
                >
                  Add Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
