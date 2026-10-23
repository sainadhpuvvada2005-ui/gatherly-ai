import React, { useState } from 'react';
import { 
  Mail, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Share2, 
  MessageSquare, 
  Instagram, 
  FileText, 
  Languages, 
  Loader2,
  RefreshCw
} from 'lucide-react';
import { EventDetails, InvitationContent } from '../types';
import { EventStore } from '../services/storage';
import { AiService } from '../services/aiService';

interface InvitationGeneratorProps {
  event: EventDetails;
  invitations: InvitationContent[];
  onRefreshData: () => void;
}

export const InvitationGenerator: React.FC<InvitationGeneratorProps> = ({
  event,
  invitations,
  onRefreshData
}) => {
  const [format, setFormat] = useState<'whatsapp' | 'instagram' | 'formal_card' | 'email'>('whatsapp');
  const [tone, setTone] = useState<'elegant' | 'casual' | 'festive' | 'royal' | 'fun'>('royal');
  const [language, setLanguage] = useState<'English' | 'Telugu' | 'Hindi'>('English');
  const [generating, setGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const generated = await AiService.generateInvitation(event, format, tone, language);
      EventStore.addInvitation({
        eventId: event.id,
        format,
        tone,
        language,
        headline: generated.headline,
        body: generated.body,
        hashtags: generated.hashtags,
        callToAction: generated.callToAction
      });
      onRefreshData();
    } catch (err) {
      console.error('Failed to generate invitation:', err);
      alert('Could not generate invitation text right now.');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleWhatsAppShare = (headline: string, body: string, cta: string) => {
    const fullText = `${headline}\n\n${body}\n\n${cta}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-stone-900 flex items-center gap-2">
            <Mail className="w-6 h-6 text-emerald-800" />
            <span>AI Invitation & Content Generator</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Craft tailored messages for WhatsApp broadcasts, Instagram reels, formal print cards, and email invites with one-click sharing.
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-900 hover:to-teal-900 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
        >
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
              <span>Drafting Copy...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate Invitation Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Control Selector Form */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
          Target Output Parameters
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Communication Format</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
                { id: 'instagram', label: 'Instagram', icon: Instagram },
                { id: 'formal_card', label: 'Formal Card', icon: FileText },
                { id: 'email', label: 'Email Invite', icon: Mail }
              ].map(f => {
                const Icon = f.icon;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFormat(f.id as any)}
                    className={`p-2.5 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all cursor-pointer ${
                      format === f.id
                        ? 'bg-emerald-50 border-emerald-700 text-emerald-900 font-bold'
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{f.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Tone & Voice</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {(['royal', 'festive', 'elegant', 'casual', 'fun'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  className={`p-2 rounded-xl text-xs font-semibold capitalize border transition-all cursor-pointer ${
                    tone === t
                      ? 'bg-emerald-50 border-emerald-700 text-emerald-900 font-bold'
                      : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Language</label>
            <div className="flex items-center gap-2">
              {(['English', 'Telugu', 'Hindi'] as const).map(l => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLanguage(l)}
                  className={`flex-1 p-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    language === l
                      ? 'bg-emerald-50 border-emerald-700 text-emerald-900 font-bold'
                      : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-stone-400 mt-2">
              Generates culturally authentic idioms and ceremonial phrases.
            </p>
          </div>
        </div>
      </div>

      {/* Generated Invitations Showcase */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-stone-900 font-display">
          Generated Invitation Suites for {event.name}
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {invitations.map(inv => {
            const fullContent = `${inv.headline}\n\n${inv.body}\n\n${inv.hashtags || ''}\n\n${inv.callToAction}`;
            const isCopied = copiedId === inv.id;

            return (
              <div 
                key={inv.id}
                className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b border-stone-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                        {inv.format.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] font-semibold text-stone-500 capitalize">
                        Tone: {inv.tone} • {inv.language}
                      </span>
                    </div>

                    <span className="text-[10px] text-stone-400">
                      {inv.createdAt}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-stone-900 font-display">
                    {inv.headline}
                  </h4>

                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80 text-xs text-stone-700 whitespace-pre-line leading-relaxed font-sans">
                    {inv.body}
                  </div>

                  {inv.hashtags && (
                    <p className="text-xs font-semibold text-emerald-800 font-mono">
                      {inv.hashtags}
                    </p>
                  )}

                  <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 font-semibold">
                    {inv.callToAction}
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleCopy(inv.id, fullContent)}
                    className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-bold text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-stone-500" />
                        <span>Copy Text</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleWhatsAppShare(inv.headline, inv.body, inv.callToAction)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share to WhatsApp</span>
                  </button>
                </div>
              </div>
            );
          })}

          {invitations.length === 0 && (
            <div className="col-span-full bg-white p-12 rounded-2xl border border-stone-200 text-center text-xs text-stone-400">
              No invitation cards generated yet. Click &ldquo;Generate Invitation Copy&rdquo; above!
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
