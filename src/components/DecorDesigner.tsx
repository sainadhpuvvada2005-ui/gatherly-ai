import React, { useState } from 'react';
import { 
  Palette, 
  Sparkles, 
  Copy, 
  Check, 
  Heart, 
  Plus, 
  RefreshCw, 
  Lightbulb, 
  Layers, 
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { EventDetails, DecorThemeIdea } from '../types';
import { EventStore } from '../services/storage';
import { AiService } from '../services/aiService';

interface DecorDesignerProps {
  event: EventDetails;
  decorIdeas: DecorThemeIdea[];
  onRefreshData: () => void;
}

export const DecorDesigner: React.FC<DecorDesignerProps> = ({
  event,
  decorIdeas,
  onRefreshData
}) => {
  const [generating, setGenerating] = useState(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleGenerateDecor = async () => {
    setGenerating(true);
    try {
      const generated = await AiService.generateDecor(event);
      EventStore.addDecorIdea({
        eventId: event.id,
        themeName: generated.themeName || 'Regal Saffron & Emerald Twilight',
        description: generated.description || 'Lush botanical garden staging with warm ambient lanterns.',
        colorPalette: generated.colorPalette || [
          { name: 'Saffron Gold', hex: '#D97706' },
          { name: 'Emerald Velvet', hex: '#064E3B' },
          { name: 'Warm Ivory', hex: '#FFFBEB' }
        ],
        stageConcept: generated.stageConcept || 'Geometric wooden jaali arches with cascading tuberose and brass diyas.',
        floralLighting: generated.floralLighting || '2700K warm wash spotlights with low-voltage fairy light canopies.',
        budgetAlternative: generated.budgetAlternative || 'Rent heritage brass urulis rather than commissioning custom metal fabrications.',
        imagePrompt: generated.imagePrompt || `Grand luxury celebration stage design for ${event.name}.`,
        isFavorite: false
      });
      onRefreshData();
    } catch (err) {
      console.error('Decor generation failed:', err);
      alert('Could not generate new decor theme right now.');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleToggleFavorite = (id: string) => {
    EventStore.toggleFavoriteDecor(id);
    onRefreshData();
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-stone-900 flex items-center gap-2">
            <Palette className="w-6 h-6 text-emerald-800" />
            <span>AI Theme & Scenography Designer</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Curated color schemes, architectural stage backdrops, ambient illumination protocols, and cost-saving floral alternatives.
          </p>
        </div>

        <button
          onClick={handleGenerateDecor}
          disabled={generating}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-900 hover:to-teal-900 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
        >
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
              <span>Generating Theme...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate New Aesthetic Concept</span>
            </>
          )}
        </button>
      </div>

      {/* Grid of Saved and Generated Concepts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {decorIdeas.map(idea => (
          <div 
            key={idea.id}
            className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden flex flex-col justify-between"
          >
            <div className="p-6 space-y-4">
              
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    Aesthetic Concept
                  </span>
                  <h3 className="text-xl font-bold font-display text-stone-900 mt-1.5">
                    {idea.themeName}
                  </h3>
                </div>

                <button
                  onClick={() => handleToggleFavorite(idea.id)}
                  className={`p-2 rounded-xl transition-colors ${
                    idea.isFavorite ? 'text-rose-600 bg-rose-50' : 'text-stone-300 hover:text-stone-500 bg-stone-50'
                  }`}
                  title="Save to Favorites"
                >
                  <Heart className={`w-4 h-4 ${idea.isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">
                {idea.description}
              </p>

              {/* Color Palette Swatches */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  Signature Color Palette (Click swatch to copy hex code)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {idea.colorPalette.map((color, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleCopyHex(color.hex)}
                      className="p-2 rounded-xl border border-stone-200/80 hover:border-stone-400 bg-stone-50 text-left transition-all group cursor-pointer"
                    >
                      <div 
                        className="w-full h-8 rounded-lg shadow-inner mb-1.5 transition-transform group-hover:scale-105" 
                        style={{ backgroundColor: color.hex }}
                      />
                      <p className="text-[10px] font-bold text-stone-800 truncate">{color.name}</p>
                      <p className="text-[9px] font-mono text-stone-400 flex items-center justify-between">
                        <span>{color.hex}</span>
                        {copiedHex === color.hex ? (
                          <Check className="w-2.5 h-2.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100" />
                        )}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stage and Floral Specifications */}
              <div className="space-y-3 pt-2">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-1">
                  <p className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Stage Backdrop & Focal Point</span>
                  </p>
                  <p className="text-xs text-stone-600 leading-relaxed">{idea.stageConcept}</p>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-1">
                  <p className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                    <span>Floral Arrangements & 2700K Warm Lighting</span>
                  </p>
                  <p className="text-xs text-stone-600 leading-relaxed">{idea.floralLighting}</p>
                </div>

                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/70 space-y-1">
                  <p className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    <span>Affordable DIY / Local Alternatives</span>
                  </p>
                  <p className="text-xs text-amber-950/80 leading-relaxed">{idea.budgetAlternative}</p>
                </div>
              </div>

            </div>

            {/* Visual Prompt Section */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 text-xs text-stone-500 space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-400 flex items-center gap-1">
                <ImageIcon className="w-3 h-3 text-stone-500" /> Visual Moodboard Prompt
              </span>
              <p className="text-[11px] text-stone-600 italic">
                &ldquo;{idea.imagePrompt}&rdquo;
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
