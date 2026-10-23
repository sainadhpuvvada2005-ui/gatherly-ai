import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Calendar, 
  MapPin, 
  Coins, 
  Users, 
  Utensils, 
  HeartHandshake, 
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { EventDetails, EventType, CurrencyCode } from '../types';

interface EventWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveEvent: (eventData: Omit<EventDetails, 'id' | 'createdAt' | 'updatedAt'>, shouldTriggerAi: boolean) => Promise<void>;
  initialEvent?: EventDetails;
}

export const EventWizard: React.FC<EventWizardProps> = ({
  isOpen,
  onClose,
  onSaveEvent,
  initialEvent
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form State
  const [name, setName] = useState(initialEvent?.name || '');
  const [type, setType] = useState<EventType>(initialEvent?.type || 'wedding');
  const [date, setDate] = useState(initialEvent?.date || '2026-11-25');
  const [startTime, setStartTime] = useState(initialEvent?.startTime || '10:00');
  const [endTime, setEndTime] = useState(initialEvent?.endTime || '22:30');
  const [city, setCity] = useState(initialEvent?.city || 'Bengaluru, Karnataka');
  const [venue, setVenue] = useState(initialEvent?.venue || '');
  const [guestCount, setGuestCount] = useState<number>(initialEvent?.guestCount || 200);
  const [totalBudget, setTotalBudget] = useState<number>(initialEvent?.totalBudget || 1000000);
  const [currency, setCurrency] = useState<CurrencyCode>(initialEvent?.currency || 'INR');
  const [theme, setTheme] = useState(initialEvent?.theme || 'Regal Heritage & Floral Amber');
  const [setting, setSetting] = useState<'indoor' | 'outdoor' | 'both'>(initialEvent?.setting || 'both');
  const [foodPreferences, setFoodPreferences] = useState<string[]>(
    initialEvent?.foodPreferences || ['Vegetarian', 'Jain']
  );
  const [culturalRequirements, setCulturalRequirements] = useState(
    initialEvent?.culturalRequirements || 'Traditional Hindu wedding ceremonies with Haldi, Mehendi, Sangeet & Phere'
  );
  const [accessibilityNeeds, setAccessibilityNeeds] = useState(
    initialEvent?.accessibilityNeeds || 'Wheelchair ramp access for senior family members'
  );
  const [additionalInstructions, setAdditionalInstructions] = useState(
    initialEvent?.additionalInstructions || 'Eco-friendly decor, minimal plastic, brass lighting props.'
  );

  const availableFoodOptions = [
    'Vegetarian',
    'Non-Vegetarian',
    'Pure Jain',
    'Vegan',
    'Halal',
    'Continental / Italian',
    'Live Chaat Counters',
    'Kids Special'
  ];

  const toggleFoodPreference = (option: string) => {
    if (foodPreferences.includes(option)) {
      setFoodPreferences(foodPreferences.filter(f => f !== option));
    } else {
      setFoodPreferences([...foodPreferences, option]);
    }
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!name.trim()) newErrors.name = 'Please provide an event name.';
      if (!date) newErrors.date = 'Event date is required.';
    } else if (currentStep === 2) {
      if (!city.trim()) newErrors.city = 'City or location is required.';
      if (guestCount < 1) newErrors.guestCount = 'Guest count must be at least 1.';
      if (totalBudget < 1000) newErrors.totalBudget = 'Please enter a realistic budget.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setStep(prev => prev - 1);
  };

  const handleFinish = async (shouldTriggerAi: boolean) => {
    if (!validateStep(1) || !validateStep(2)) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSaveEvent({
        name,
        type,
        date,
        startTime,
        endTime,
        city,
        venue,
        guestCount: Number(guestCount),
        totalBudget: Number(totalBudget),
        currency,
        theme,
        setting,
        foodPreferences,
        culturalRequirements,
        accessibilityNeeds,
        additionalInstructions,
        status: initialEvent?.status || 'planning',
        ownerId: initialEvent?.ownerId || 'user-demo-01'
      }, shouldTriggerAi);

      onClose();
    } catch (err) {
      console.error('Save event failed:', err);
      alert('Could not save event. Please check inputs and retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8 animate-in fade-in zoom-in-95">
        
        {/* Wizard Header */}
        <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Event Creation Wizard • Step {step} of 4</span>
          </div>

          <h2 className="text-2xl font-bold font-display">
            {initialEvent ? 'Edit Event Blueprint' : 'Create Your Event Blueprint'}
          </h2>
          <p className="text-xs text-emerald-100/80 mt-1">
            Gatherly AI will analyze these parameters to produce tailored timelines, budgets, and menus.
          </p>

          {/* Stepper Progress bar */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {[1, 2, 3, 4].map(s => (
              <div 
                key={s} 
                className={`h-1.5 rounded-full transition-all ${
                  s <= step ? 'bg-amber-400' : 'bg-white/20'
                }`} 
              />
            ))}
          </div>
        </div>

        {/* Wizard Body Steps */}
        <div className="p-6 sm:p-8 max-h-[65vh] overflow-y-auto space-y-6">
          
          {/* STEP 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-stone-900">Step 1: Event Identity & Schedule</h3>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1">
                  Event Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Diya & Kabir's Royal Palace Wedding"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm font-medium"
                />
                {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1">
                  Event Type *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'wedding', label: '💍 Wedding' },
                    { id: 'birthday', label: '🎂 Birthday' },
                    { id: 'college', label: '🎓 College Fest' },
                    { id: 'community', label: '🤝 Community' },
                    { id: 'custom', label: '✨ Custom Event' }
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setType(t.id as EventType)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-all text-left flex items-center justify-between ${
                        type === t.id
                          ? 'bg-emerald-50 border-emerald-700 text-emerald-900 ring-1 ring-emerald-700'
                          : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <span>{t.label}</span>
                      {type === t.id && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-xs font-medium"
                  />
                  {errors.date && <p className="text-xs text-rose-600 mt-1">{errors.date}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-xs font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Venue, Guests & Budget */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-stone-900">Step 2: Location, Attendance & Budget Envelope</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1">
                    City / Destination *
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="e.g. Udaipur, Mumbai, Hyderabad"
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm font-medium"
                  />
                  {errors.city && <p className="text-xs text-rose-600 mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1">
                    Specific Venue (if booked / known)
                  </label>
                  <input
                    type="text"
                    value={venue}
                    onChange={e => setVenue(e.target.value)}
                    placeholder="e.g. Grand Heritage Palace Courtyard"
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1">
                    Expected Guests *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={guestCount}
                    onChange={e => setGuestCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm font-medium"
                  />
                  {errors.guestCount && <p className="text-xs text-rose-600 mt-1">{errors.guestCount}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1">
                    Total Budget *
                  </label>
                  <input
                    type="number"
                    min="1000"
                    step="10000"
                    value={totalBudget}
                    onChange={e => setTotalBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm font-medium"
                  />
                  {errors.totalBudget && <p className="text-xs text-rose-600 mt-1">{errors.totalBudget}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1">
                    Currency *
                  </label>
                  <select
                    value={currency}
                    onChange={e => setCurrency(e.target.value as CurrencyCode)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm font-semibold bg-white"
                  >
                    <option value="INR">INR (₹ Indian Rupee)</option>
                    <option value="USD">USD ($ US Dollar)</option>
                    <option value="EUR">EUR (€ Euro)</option>
                    <option value="GBP">GBP (£ British Pound)</option>
                    <option value="AED">AED (د.إ UAE Dirham)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1">
                  Setting / Environment
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['indoor', 'outdoor', 'both'] as const).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSetting(s)}
                      className={`py-2 rounded-xl text-xs font-bold border capitalize transition-all ${
                        setting === s
                          ? 'bg-emerald-50 border-emerald-700 text-emerald-900 ring-1 ring-emerald-700'
                          : 'bg-white border-stone-200 text-stone-700'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Styling & Dining */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-stone-900">Step 3: Theme, Style & Food Preferences</h3>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1">
                  Theme / Aesthetic Style
                </label>
                <input
                  type="text"
                  value={theme}
                  onChange={e => setTheme(e.target.value)}
                  placeholder="e.g. Royal Marigold Sunset, Cyberpunk Neon, Vintage Chic"
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1">
                  Food & Catering Options (Select all that apply)
                </label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {availableFoodOptions.map(opt => {
                    const isSelected = foodPreferences.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleFoodPreference(opt)}
                        className={`p-2.5 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-700 text-emerald-900 font-bold'
                            : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Cultural & Accessibility Needs */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-stone-900">Step 4: Cultural, Accessibility & Special Logistics</h3>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1">
                  Cultural / Ritual Requirements
                </label>
                <textarea
                  rows={2}
                  value={culturalRequirements}
                  onChange={e => setCulturalRequirements(e.target.value)}
                  placeholder="e.g. Traditional Hindu rituals, Sangeet choreography stage, Jain dinner before sunset"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1">
                  Accessibility & Senior Citizen Needs
                </label>
                <input
                  type="text"
                  value={accessibilityNeeds}
                  onChange={e => setAccessibilityNeeds(e.target.value)}
                  placeholder="e.g. Ground floor seating, wheelchair ramps, close parking"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1">
                  Special Notes & Coordinator Directives
                </label>
                <textarea
                  rows={2}
                  value={additionalInstructions}
                  onChange={e => setAdditionalInstructions(e.target.value)}
                  placeholder="e.g. Zero single-use plastic, acoustic sound curfew at 10 PM, live drone recording"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-xs font-medium"
                />
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs">
                <p className="font-bold flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  <span>Ready to Generate with Gatherly AI</span>
                </p>
                <p className="leading-relaxed">
                  Clicking &ldquo;Save & Generate AI Plan&rdquo; will create your event, generate a comprehensive budget split, milestone tasks, risk checklists, and decor ideas.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Wizard Footer Controls */}
        <div className="p-6 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-xs font-bold text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleFinish(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Save Draft Only
                </button>
                <button
                  type="button"
                  onClick={() => handleFinish(true)}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-900 hover:to-teal-900 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating Plan...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Save & Generate AI Plan</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
