import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  HeartHandshake, 
  Cake, 
  GraduationCap, 
  Users, 
  CheckCircle, 
  TrendingUp, 
  Calendar, 
  ShieldCheck, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  Coins,
  Store,
  MessageSquareShare
} from 'lucide-react';

interface LandingPageProps {
  onStartPlanning: () => void;
  onExploreDemo: () => void;
  onOpenLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartPlanning,
  onExploreDemo,
  onOpenLogin
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does Gatherly AI calculate customized event budgets?',
      a: 'Gatherly AI uses real-world market distributions based on your selected city, event style, and guest count. It allocates smart proportions across venues, catering, decoration, photography, and contingency reserves, dynamically updating whenever you log an advance or change estimates.'
    },
    {
      q: 'Can I use Gatherly AI for traditional Indian ceremonies like Haldi and Sangeet?',
      a: 'Absolutely! Our wedding blueprints are designed with deep support for multi-day cultural events, ritual schedules, authentic catering arrangements (like Rajasthani, South Indian, or Jain banquets), and guest group management.'
    },
    {
      q: 'Does Gatherly AI support collaboration with my family and vendors?',
      a: 'Yes. You can invite coordinators, family members, or vendors as Owners, Editors, or Viewers. Shared access keeps everyone synchronized on timelines, tasks, and budgets.'
    },
    {
      q: 'What happens if the Gemini AI service is temporarily offline?',
      a: 'Gatherly AI includes a robust deterministic Demo and Offline Mode. You can plan, create custom items, manage guests, and generate structured templates without interruption.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 selection:bg-emerald-100 selection:text-emerald-950">
      
      {/* Landing Navigation */}
      <nav className="sticky top-0 z-50 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight text-stone-900 font-display">
                Gatherly <span className="text-emerald-800">AI</span>
              </span>
              <p className="text-[11px] font-medium text-stone-500 tracking-wider uppercase">
                Plan Smarter. Celebrate Better.
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-stone-700">
            <a href="#features" className="hover:text-emerald-800 transition-colors">Features</a>
            <a href="#event-types" className="hover:text-emerald-800 transition-colors">Celebrations</a>
            <a href="#how-it-works" className="hover:text-emerald-800 transition-colors">Workflow</a>
            <a href="#faq" className="hover:text-emerald-800 transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenLogin}
              className="px-4 py-2 text-sm font-semibold text-stone-700 hover:text-emerald-800 transition-colors cursor-pointer"
            >
              Log In
            </button>
            <button
              onClick={onStartPlanning}
              className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Start Planning</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle decorative background shapes */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-tr from-emerald-100/50 via-amber-100/30 to-rose-100/40 blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs sm:text-sm font-semibold shadow-xs">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>Next-Gen Event Intelligence with Gemini AI</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-stone-900 font-display leading-[1.15]">
            Plan Your Perfect Event with <span className="text-emerald-800 italic underline decoration-amber-400 decoration-wavy decoration-2">AI</span>
          </h1>

          <p className="text-lg sm:text-xl text-stone-600 max-w-2xl mx-auto font-normal leading-relaxed">
            From regal palace weddings and joyful birthday galas to high-energy college fests. Gatherly AI automates budgets, schedules, vendors, and invitations in seconds.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartPlanning}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-base shadow-lg hover:shadow-emerald-900/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>Start Planning Free</span>
              <ArrowRight className="w-5 h-5 text-amber-300" />
            </button>

            <button
              onClick={onExploreDemo}
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-bold text-base shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-5 h-5 text-emerald-700" />
              <span>Explore Live Dashboard</span>
            </button>
          </div>

          {/* Social Proof & Metrics */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto border-t border-stone-200/80">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-emerald-900 font-display">₹2.5 Cr+</p>
              <p className="text-xs text-stone-500 font-medium mt-0.5">Budgets Optimized</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-emerald-900 font-display">4,200+</p>
              <p className="text-xs text-stone-500 font-medium mt-0.5">Tasks Coordinated</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-emerald-900 font-display">99.4%</p>
              <p className="text-xs text-stone-500 font-medium mt-0.5">On-Schedule Delivery</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-emerald-900 font-display">Zero</p>
              <p className="text-xs text-stone-500 font-medium mt-0.5">Planning Anxiety</p>
            </div>
          </div>
        </div>
      </section>

      {/* Event Types Section */}
      <section id="event-types" className="py-20 bg-stone-100/60 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Designed for Every Milestone</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 font-display mt-2">
              Specialized Blueprints for Every Occasion
            </h2>
            <p className="text-sm sm:text-base text-stone-600 mt-3">
              Pre-configured workflows with ritual schedules, specialized vendors, and accurate budgeting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Weddings Card */}
            <div className="bg-white rounded-2xl p-7 border border-stone-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 rounded-xl bg-amber-100/70 text-amber-800 flex items-center justify-center mb-6">
                <HeartHandshake className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-stone-900 font-display">Weddings & Nuptials</h3>
              <p className="text-stone-600 text-sm mt-3 leading-relaxed">
                Full multi-day itinerary coordination including Sangeet, Mehendi, Haldi, and Lakefront Sunset Phere. Multi-family group management and bridal styling checkpoints.
              </p>
              <ul className="mt-5 space-y-2.5 text-xs text-stone-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-700" />
                  <span>Palace and banquet venue contract trackers</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-700" />
                  <span>Live floral mandap & lighting cost modeling</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-700" />
                  <span>Outstation guest room and shuttle logistics</span>
                </li>
              </ul>
              <button 
                onClick={onStartPlanning}
                className="mt-6 w-full py-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-800 font-bold text-xs border border-stone-200 transition-colors"
              >
                Plan a Wedding
              </button>
            </div>

            {/* Birthdays Card */}
            <div className="bg-white rounded-2xl p-7 border border-stone-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 rounded-xl bg-rose-100/70 text-rose-800 flex items-center justify-center mb-6">
                <Cake className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-stone-900 font-display">Birthdays & Galas</h3>
              <p className="text-stone-600 text-sm mt-3 leading-relaxed">
                From 10th superhero celebrations with arcade fun to milestone 50th golden jubilee banquets. Games, tiered cakes, magic shows, and personalized return gifts.
              </p>
              <ul className="mt-5 space-y-2.5 text-xs text-stone-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-700" />
                  <span>Theme props and custom balloon arch concepts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-700" />
                  <span>Entertainer booking: magicians, hosts & mascots</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-700" />
                  <span>Kids snack bars and return gift packing lists</span>
                </li>
              </ul>
              <button 
                onClick={onStartPlanning}
                className="mt-6 w-full py-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-800 font-bold text-xs border border-stone-200 transition-colors"
              >
                Plan a Birthday
              </button>
            </div>

            {/* College & Community Card */}
            <div className="bg-white rounded-2xl p-7 border border-stone-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 rounded-xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center mb-6">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-stone-900 font-display">Festivals & Community</h3>
              <p className="text-stone-600 text-sm mt-3 leading-relaxed">
                Annual cultural fests, inter-college hackathons, musical concerts, and neighborhood society galas with hundreds or thousands of active attendees.
              </p>
              <ul className="mt-5 space-y-2.5 text-xs text-stone-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-700" />
                  <span>Sponsorship tracking & committee approvals</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-700" />
                  <span>Stage acoustics, power load & line-array checks</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-700" />
                  <span>Volunteer shifts and crowd control checklists</span>
                </li>
              </ul>
              <button 
                onClick={onStartPlanning}
                className="mt-6 w-full py-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-800 font-bold text-xs border border-stone-200 transition-colors"
              >
                Plan a Festival
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Autonomous Assistant</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 font-display mt-2">
            Engineered for Precision & Peace of Mind
          </h2>
          <p className="text-sm sm:text-base text-stone-600 mt-3">
            Every feature is linked together: AI plans automatically generate budgets, budgets alert vendors, and RSVPs update catering calculations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4">
              <Coins className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-stone-900">Smart Financial Allocation</h4>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              Auto-computes estimated vs actual expenses, tracks advance tokens, highlights balance due dates, and triggers warnings when nearing budget limits.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-stone-900">Conversational AI Co-Pilot</h4>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              Ask questions like &ldquo;Reduce decoration budget by ₹15,000&rdquo; or &ldquo;Create a vegetarian menu for 100 guests&rdquo; and let Gatherly AI recalculate instantly.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center mb-4">
              <Store className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-stone-900">Vendor Directory & Comparison</h4>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              Side-by-side quotation comparison for caterers, decorators, and photographers. Maintain contact numbers, booking status, and signed contract files.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-800 flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-stone-900">Live RSVP & Dietary Estimator</h4>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              Keep guest attendance confirmed, track Jain, vegan, and non-veg dietary requirements, and auto-estimate exact catering batch volumes in kilograms.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center mb-4">
              <MessageSquareShare className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-stone-900">Multilingual Invitation Generator</h4>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              Generate one-click WhatsApp messages with emojis, Instagram captions, formal cards, and email invites in English, Telugu, and Hindi.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-stone-900">Hour-by-Hour Day Run-Sheet</h4>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              Keep every bridesmaid, groomsperson, vendor, and emcee aligned with a minute-by-minute live schedule on the big day.
            </p>
          </div>
        </div>
      </section>

      {/* Workflow Explanation */}
      <section id="how-it-works" className="py-20 bg-emerald-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">How It Works</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display mt-2">
              Four Steps from Vision to Celebration
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-emerald-900/60 border border-emerald-800/80">
              <div className="text-3xl font-bold text-amber-300 font-display mb-3">01</div>
              <h4 className="text-lg font-bold">Input Event Vision</h4>
              <p className="text-xs text-emerald-200/80 mt-2 leading-relaxed">
                Provide dates, estimated guest count, city, theme, and total budget envelope in our guided wizard.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-900/60 border border-emerald-800/80">
              <div className="text-3xl font-bold text-amber-300 font-display mb-3">02</div>
              <h4 className="text-lg font-bold">AI Generates Master Plan</h4>
              <p className="text-xs text-emerald-200/80 mt-2 leading-relaxed">
                Gemini AI creates a structured budget split, milestone checklist, risk mitigation steps, and decor palettes.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-900/60 border border-emerald-800/80">
              <div className="text-3xl font-bold text-amber-300 font-display mb-3">03</div>
              <h4 className="text-lg font-bold">Collaborate & Track</h4>
              <p className="text-xs text-emerald-200/80 mt-2 leading-relaxed">
                Manage vendor quotations, monitor task deadlines, record advance receipts, and track guest RSVPs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-900/60 border border-emerald-800/80">
              <div className="text-3xl font-bold text-amber-300 font-display mb-3">04</div>
              <h4 className="text-lg font-bold">Celebrate Flawlessly</h4>
              <p className="text-xs text-emerald-200/80 mt-2 leading-relaxed">
                Execute the day-of run-sheet seamlessly, print executive reports, and reconcile final expenses stress-free.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Got Questions?</span>
          <h2 className="text-3xl font-bold text-stone-900 font-display mt-2">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className="rounded-xl border border-stone-200 bg-white overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left px-5 py-4 flex items-center justify-between font-bold text-stone-900 text-sm sm:text-base hover:bg-stone-50 cursor-pointer"
              >
                <span>{faq.q}</span>
                {openFaq === i ? <ChevronUp className="w-4 h-4 text-emerald-700" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 text-xs sm:text-sm text-stone-600 border-t border-stone-100 pt-3 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
              G
            </div>
            <span className="font-bold text-stone-800">Gatherly AI</span>
            <span>— Plan Smarter. Celebrate Better.</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="hover:text-emerald-800 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-emerald-800 cursor-pointer">Terms of Service</span>
            <span className="hover:text-emerald-800 cursor-pointer">Security Blueprint</span>
            <span className="hover:text-emerald-800 cursor-pointer">Support</span>
          </div>

          <p>© {new Date().getFullYear()} Gatherly AI. Built for memorable celebrations.</p>
        </div>
      </footer>

    </div>
  );
};
