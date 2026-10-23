import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini SDK if API key is present
const apiKey = process.env.GEMINI_API_KEY || '';
let genAI: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    genAI = new GoogleGenAI({ apiKey });
    console.log('Gemini API initialized successfully with gemini-3.8-flash.');
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
} else {
  console.log('No GEMINI_API_KEY configured. Running in Demo / Fallback Mode.');
}

// Status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    geminiConfigured: !!genAI,
    firebaseConfigured: false, // In AI Studio web app, client can connect to Firebase project or use local store
    serverTime: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Timeout helper so AI requests never block indefinitely
function withTimeout<T>(promise: Promise<T>, ms: number = 6000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('AI request timeout')), ms))
  ]);
}

// Helper for demo / fallback plan generation
function generateFallbackPlan(event: any) {
  const budget = Number(event.totalBudget) || 1000000;
  const guests = Number(event.guestCount) || 150;
  const type = event.type || 'wedding';
  const currency = event.currency || 'INR';

  let breakdown: any[] = [];
  if (type === 'wedding') {
    breakdown = [
      { category: 'venue', percentage: 30, amount: Math.round(budget * 0.30), description: 'Heritage or banquet venue booking across ceremonies' },
      { category: 'catering', percentage: 26, amount: Math.round(budget * 0.26), description: `Multi-course buffet & live counters for ${guests} guests` },
      { category: 'decorations', percentage: 14, amount: Math.round(budget * 0.14), description: 'Mandap floral work, entrance rangoli & fairy lighting' },
      { category: 'photography', percentage: 9, amount: Math.round(budget * 0.09), description: 'Candid photography, cinematography & drone coverage' },
      { category: 'entertainment', percentage: 6, amount: Math.round(budget * 0.06), description: 'DJ, sound system, folk artists / emcee' },
      { category: 'clothing_makeup', percentage: 8, amount: Math.round(budget * 0.08), description: 'Bridal & groom couture, professional makeup artist' },
      { category: 'invitations', percentage: 2, amount: Math.round(budget * 0.02), description: 'Custom printed and digital WhatsApp stationery' },
      { category: 'emergency_reserve', percentage: 5, amount: Math.round(budget * 0.05), description: 'Contingency reserve for last-minute needs' }
    ];
  } else if (type === 'birthday') {
    breakdown = [
      { category: 'venue', percentage: 30, amount: Math.round(budget * 0.30), description: 'Party lawn, arcade hall or banquet room' },
      { category: 'catering', percentage: 32, amount: Math.round(budget * 0.32), description: `Custom themed tiered cake and snacks for ${guests} guests` },
      { category: 'decorations', percentage: 15, amount: Math.round(budget * 0.15), description: 'Balloon arches, neon backdrop and character props' },
      { category: 'entertainment', percentage: 15, amount: Math.round(budget * 0.15), description: 'Magic show, game host and mascot characters' },
      { category: 'invitations', percentage: 3, amount: Math.round(budget * 0.03), description: 'Digital animated invitations & reminders' },
      { category: 'emergency_reserve', percentage: 5, amount: Math.round(budget * 0.05), description: 'Contingency fund' }
    ];
  } else {
    breakdown = [
      { category: 'venue', percentage: 35, amount: Math.round(budget * 0.35), description: 'Auditorium or grounds rental' },
      { category: 'equipment', percentage: 25, amount: Math.round(budget * 0.25), description: 'Sound line arrays, LED screens and stage trusses' },
      { category: 'catering', percentage: 15, amount: Math.round(budget * 0.15), description: `Food trucks & refreshment stalls for ${guests} participants` },
      { category: 'decorations', percentage: 10, amount: Math.round(budget * 0.10), description: 'Campus branding, cyber banners and badges' },
      { category: 'miscellaneous', percentage: 10, amount: Math.round(budget * 0.10), description: 'Permissions, security staff and first-aid kits' },
      { category: 'emergency_reserve', percentage: 5, amount: Math.round(budget * 0.05), description: 'Contingency pool' }
    ];
  }

  return {
    overview: `Personalized AI blueprint curated for "${event.name || 'Your Event'}" in ${event.city || 'your city'}. Designed for ${guests} attendees with an optimal ${currency} ${budget.toLocaleString()} budget envelope.`,
    budgetSavingTips: [
      `Book local seasonal florals to save up to 20% on the decoration budget.`,
      `Consolidate audio-visual and stage lighting with a single comprehensive vendor to negotiate a package rate.`,
      `Finalize firm RSVP confirmations 14 days prior to trim excess catering headcounts.`,
      `Opt for digital interactive WhatsApp invitation suites alongside limited printed keepsakes.`
    ],
    suggestedAllocations: breakdown,
    tasks: [
      { title: 'Lock venue agreement and review sound curfew policies', category: 'Venue', dueRelativeDays: -45, priority: 'high', notes: 'Check emergency exits, generator backups, and parking permits.' },
      { title: 'Conduct food tasting with caterer and finalize menu', category: 'Catering', dueRelativeDays: -30, priority: 'high', notes: 'Include dietary tags (veg/vegan/jain).' },
      { title: 'Send digital invitation cards and launch RSVP tracking', category: 'Guests', dueRelativeDays: -25, priority: 'medium', notes: 'Include map directions and timing details.' },
      { title: 'Review floral and lighting layout mockup', category: 'Decorations', dueRelativeDays: -18, priority: 'medium', notes: 'Confirm stage dimensions and power load.' },
      { title: 'Brief photography team on priority shot list', category: 'Media', dueRelativeDays: -10, priority: 'medium', notes: 'List key VIPs and milestone moments.' },
      { title: 'Conduct full technical sound check and rehearsal', category: 'Logistics', dueRelativeDays: -2, priority: 'high', notes: 'Check wireless mics and battery reserves.' }
    ],
    milestones: [
      { timelinePhase: '4-6 Weeks Prior', description: 'Lock core contracts (venue, food, primary decorators).' },
      { timelinePhase: '2-3 Weeks Prior', description: 'Finalize RSVP guest count, dietary counts, and seating map.' },
      { timelinePhase: '1 Week Prior', description: 'Conduct vendor coordination meeting and confirm arrival time slots.' },
      { timelinePhase: 'Event Day', description: 'Execute run-sheet with point coordinators on stage and entry gates.' }
    ],
    menuRecommendations: [
      `Signature welcoming refreshers tailored to the season.`,
      `Curated live counters with freshly prepared hot delicacies.`,
      `Balanced main course combining regional specialities and international favourites.`,
      `Dessert pairing featuring one warm traditional dessert and one chilled confection.`
    ],
    decorConcepts: [
      `Contemporary warm gold ambient wash lighting with architectural highlights.`,
      `Lush botanical backdrops using layered fresh green foliage and fragrant blossoms.`,
      `Statement entrance arch welcoming guests with acoustic background melodies.`
    ],
    risksAndMitigation: [
      { risk: 'Unexpected weather shifts or sudden rainfall', mitigation: 'Ensure pre-contracted waterproof canopy overhangs and indoor banquet backup.' },
      { risk: 'Vendor delayed arrivals during morning setup', mitigation: 'Mandate setup completion minimum 3 hours prior to guest arrival.' },
      { risk: 'Power load trips during live sound performance', mitigation: 'Keep a dedicated 62.5kVA silent diesel generator on hot standby.' }
    ],
    guestManagementTips: [
      `Group guests into designated categories for targeted communications.`,
      `Collect dietary preferences early to minimize food waste.`,
      `Set up a dedicated hospitality desk at entry for seamless arrivals.`
    ],
    isDemoMode: true
  };
}

// 1. AI Event Plan Generator
app.post('/api/ai/plan-event', async (req, res) => {
  const event = req.body;
  if (!event || !event.name) {
    return res.status(400).json({ error: 'Event details required' });
  }

  if (!genAI) {
    // Return high quality deterministic plan clearly marked as demo mode
    return res.json(generateFallbackPlan(event));
  }

  try {
    const prompt = `You are Gatherly AI, an elite event planner and financial strategist.
Create a comprehensive, production-grade event plan in valid JSON format for the following event:
Event Name: ${event.name}
Event Type: ${event.type}
Date: ${event.date || 'Upcoming'}
Time: ${event.startTime || '10:00'} to ${event.endTime || '22:00'}
City & Venue: ${event.city || 'TBD'} - ${event.venue || 'TBD'}
Guest Count: ${event.guestCount || 100}
Total Budget: ${event.currency || 'INR'} ${event.totalBudget || 500000}
Theme: ${event.theme || 'Elegant Celebration'}
Setting: ${event.setting || 'indoor'}
Food Preferences: ${JSON.stringify(event.foodPreferences || ['Vegetarian'])}
Cultural / Accessibility Requirements: ${event.culturalRequirements || 'None'} / ${event.accessibilityNeeds || 'None'}
Additional Notes: ${event.additionalInstructions || 'None'}

Return ONLY a valid JSON object with the following schema:
{
  "overview": "string (comprehensive executive summary)",
  "budgetSavingTips": ["string", "string", "string"],
  "suggestedAllocations": [
    { "category": "venue"|"catering"|"decorations"|"photography"|"entertainment"|"invitations"|"clothing_makeup"|"transportation"|"accommodation"|"equipment"|"miscellaneous"|"emergency_reserve", "percentage": number, "amount": number, "description": "string" }
  ],
  "tasks": [
    { "title": "string", "category": "string", "dueRelativeDays": number, "priority": "low"|"medium"|"high", "notes": "string" }
  ],
  "milestones": [
    { "timelinePhase": "string", "description": "string" }
  ],
  "menuRecommendations": ["string", "string"],
  "decorConcepts": ["string", "string"],
  "risksAndMitigation": [
    { "risk": "string", "mitigation": "string" }
  ],
  "guestManagementTips": ["string", "string"]
}`;

    const response = await withTimeout(genAI.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    }), 7000);

    const text = response.text || '';
    const parsed = JSON.parse(text);
    parsed.isDemoMode = false;
    res.json(parsed);
  } catch (error: any) {
    console.error('Gemini API Error in /api/ai/plan-event:', error);
    // Graceful fallback with indicator
    const fallback = generateFallbackPlan(event);
    fallback.isDemoMode = true;
    res.json(fallback);
  }
});

// 2. Interactive AI Chat & Planning Assistant
app.post('/api/ai/chat', async (req, res) => {
  const { message, event, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (!genAI) {
    // Intelligent heuristic response for common questions
    const msg = message.toLowerCase();
    let reply = '';
    let suggestedAction = null;

    if (msg.includes('reduce') && (msg.includes('decor') || msg.includes('decoration'))) {
      reply = `I have analyzed your decoration expenses. To reduce decoration costs by ₹15,000–₹25,000 without compromising elegance:
1. Replace exotic out-of-season florals with fragrant local marigolds and tuberose (saves approx ₹12,000).
2. Utilize warm LED fairy light canopies over expensive fabric draping.
3. Rent heritage brass urulis and urlis locally.
Would you like me to automatically update the decoration line item in your Smart Budget?`;
      suggestedAction = { type: 'modify_budget', category: 'decorations', suggestedDelta: -15000 };
    } else if (msg.includes('vegetarian') || msg.includes('menu')) {
      reply = `Here is an elevated vegetarian menu recommendation:
• Welcome: Fresh Keri Panna & Saffron Almond Thandai
• Live Counters: Paneer Angara Tikka & Crispy Dal Kachori with chutneys
• Mains: Shahi Malai Kofta, Rajasthani Dal Baati Churma, Zafrani Dum Pulao, Assorted Tandoori Rotis
• Desserts: Warm Moong Dal Halwa & Gold-foil Ghewar.
This works out to approximately ₹1,650 per guest.`;
      suggestedAction = { type: 'menu_suggestion' };
    } else if (msg.includes('evening') || msg.includes('schedule') || msg.includes('time')) {
      reply = `Rescheduling to the evening is a wonderful choice! In evening lighting:
• Haldi/Welcome drinks: 04:30 PM
• Main Ceremony / Stage Program: 06:15 PM (sunset golden hour)
• Banquet & Live Entertainment: 08:00 PM onwards.
Ambient fairy lighting will look twice as dramatic!`;
      suggestedAction = { type: 'modify_schedule' };
    } else {
      reply = `Based on "${event?.name || 'your event'}" with a budget of ${event?.currency || 'INR'} ${(event?.totalBudget || 500000).toLocaleString()}:
I recommend locking key contracts 30 days prior, tracking RSVPs digitally to avoid catering overages, and maintaining a 5% emergency reserve. What specific aspect would you like to refine next?`;
    }

    return res.json({
      reply,
      suggestedAction,
      isDemoMode: true
    });
  }

  try {
    const prompt = `You are Gatherly AI, a world-class event concierge and planner.
Current Event Context:
Name: ${event?.name}
Type: ${event?.type}
Date: ${event?.date}
Guests: ${event?.guestCount}
Budget: ${event?.currency} ${event?.totalBudget}
Venue: ${event?.venue || event?.city}
Food: ${JSON.stringify(event?.foodPreferences)}

User Query: "${message}"

Give a friendly, highly practical, expert response. If the user asks to modify a budget, menu, or schedule, suggest concrete numerical updates. Keep responses formatted with clean bullet points.`;

    const response = await withTimeout(genAI.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt
    }), 7000);

    res.json({
      reply: response.text || 'I am ready to help you organize every detail of your celebration.',
      isDemoMode: false
    });
  } catch (err: any) {
    console.error('Chat error:', err);
    res.json({
      reply: `I processed your request regarding "${message}". For "${event?.name || 'your event'}", I recommend checking vendor contracts, keeping a 5% contingency reserve, and tracking RSVPs early.`,
      isDemoMode: true
    });
  }
});

// 3. AI Invitation Generator
app.post('/api/ai/invitation', async (req, res) => {
  const { event, format, tone, language } = req.body;
  const lang = language || 'English';
  const selectedTone = tone || 'royal';
  const selectedFormat = format || 'whatsapp';

  if (!genAI) {
    const isWedding = event?.type === 'wedding';
    const isBirthday = event?.type === 'birthday';
    
    let headline = `🎉 Celebrate With Us: ${event?.name || 'Special Celebration'}`;
    let body = `Join us on ${event?.date || 'the celebration day'} at ${event?.venue || event?.city || 'our venue'} for an unforgettable gathering with family & friends!`;
    let hashtags = `#${(event?.name || 'Celebrate').replace(/\s+/g, '')} #GatherlyMoments`;

    if (isWedding) {
      headline = selectedTone === 'royal' 
        ? `👑 Two Souls, One Auspicious Union — ${event?.name || 'Wedding Bells'}` 
        : `💍 Save The Date: ${event?.name || 'Wedding Celebration'}`;
      body = `Namaste! 🙏✨\n\nWith boundless joy and the blessings of our elders, we invite you to join us in celebrating the wedding nuptials of ${event?.name || 'the couple'}.\n\n📅 Date: ${event?.date || 'Upcoming'}\n📍 Venue: ${event?.venue || event?.city || 'Royal Palace'}\n⏰ Ceremonies begin at ${event?.startTime || '10:00 AM'}.\n\nYour warm presence and blessings will make our special day complete!`;
      hashtags = `#${(event?.name || 'Wedding').replace(/[^a-zA-Z0-9]/g, '')} #RoyalWedding #IndianWedding`;
    } else if (isBirthday) {
      headline = `🎈 Superhero Alert! ${event?.name || 'Birthday Party'}`;
      body = `Get ready for an action-packed celebration! 🎂✨\n\nYou are invited to celebrate ${event?.name || 'the big birthday'}.\n\n📅 Date: ${event?.date || 'Upcoming'}\n📍 Venue: ${event?.venue || event?.city || 'Party Zone'}\n⏰ Time: ${event?.startTime || '04:00 PM'}\n\nGames, prizes, and delicious treats await!`;
      hashtags = `#${(event?.name || 'Birthday').replace(/[^a-zA-Z0-9]/g, '')} #PartyTime`;
    }

    return res.json({
      format: selectedFormat,
      tone: selectedTone,
      language: lang,
      headline,
      body,
      hashtags,
      callToAction: 'Kindly RSVP by clicking the link or messaging us back!',
      isDemoMode: true
    });
  }

  try {
    const prompt = `You are a master invitation copywriter.
Generate an event invitation with:
Event Name: ${event?.name}
Type: ${event?.type}
Date: ${event?.date}
Time: ${event?.startTime || '10:00 AM'}
Venue: ${event?.venue || event?.city}
Format: ${selectedFormat} (e.g. whatsapp message with tasteful emojis, instagram caption with hashtags, formal print card, or email)
Tone: ${selectedTone} (e.g. royal, elegant, festive, fun, modern)
Language: ${lang}

Return ONLY valid JSON with:
{
  "headline": "string",
  "body": "string",
  "hashtags": "string",
  "callToAction": "string"
}`;

    const response = await withTimeout(genAI.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    }), 7000);

    const parsed = JSON.parse(response.text || '{}');
    parsed.format = selectedFormat;
    parsed.tone = selectedTone;
    parsed.language = lang;
    parsed.isDemoMode = false;
    res.json(parsed);
  } catch (err: any) {
    console.error('Invitation generator error:', err);
    res.json({
      headline: `✨ Invitation: ${event?.name}`,
      body: `Join us on ${event?.date} at ${event?.venue || event?.city} to celebrate!`,
      hashtags: '#GatherlyCelebration',
      callToAction: 'Please RSVP by confirming your attendance.',
      isDemoMode: true
    });
  }
});

// 4. AI Decor & Theme Designer
app.post('/api/ai/decor', async (req, res) => {
  const { event } = req.body;
  if (!genAI) {
    return res.json({
      themeName: event?.theme || 'Regal Marigold & Warm Amber',
      description: 'A harmonious blend of warm marigold tones, ambient brass lanterns, and open starry skyline draping.',
      colorPalette: [
        { name: 'Royal Amber', hex: '#D97706' },
        { name: 'Sunset Marigold', hex: '#F59E0B' },
        { name: 'Palace Crimson', hex: '#991B1B' },
        { name: 'Warm Ivory', hex: '#FFFBEB' },
        { name: 'Forest Emerald', hex: '#064E3B' }
      ],
      stageConcept: 'Layered botanical backdrop with floating brass diya urulis and backlit geometric arches.',
      floralLighting: 'Fresh marigold strings, tuberose accents, 2700K warm wash spotlights, and fairy light canopies.',
      budgetAlternative: 'Opt for local seasonal marigolds and rented brass props instead of imported hydrangeas and custom metal fabrications.',
      imagePrompt: `Cinematic stage and floral mandap setup for ${event?.name || 'event'} with warm lighting and amber flowers.`,
      isDemoMode: true
    });
  }

  try {
    const prompt = `You are a luxury event designer and scenographer.
Create a stunning theme and decor design for:
Event: ${event?.name}
Type: ${event?.type}
Theme/Style: ${event?.theme || 'Modern Festive'}
Setting: ${event?.setting || 'both'}
Budget: ${event?.currency} ${event?.totalBudget}

Return ONLY valid JSON matching:
{
  "themeName": "string",
  "description": "string",
  "colorPalette": [
    { "name": "string", "hex": "#HEX" }
  ],
  "stageConcept": "string",
  "floralLighting": "string",
  "budgetAlternative": "string (practical cost-saving alternative)",
  "imagePrompt": "string (for visual generative concept)"
}`;

    const response = await withTimeout(genAI.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    }), 7000);

    const parsed = JSON.parse(response.text || '{}');
    parsed.isDemoMode = false;
    res.json(parsed);
  } catch (err: any) {
    console.error('Decor AI error:', err);
    res.json({
      themeName: 'Festive Elegance',
      description: 'Clean ambient aesthetic with warm highlights.',
      colorPalette: [
        { name: 'Gold', hex: '#F59E0B' },
        { name: 'Emerald', hex: '#064E3B' },
        { name: 'Cream', hex: '#FEF3C7' }
      ],
      stageConcept: 'Backlit geometric wooden screen with fresh garlands.',
      floralLighting: 'Warm fairy lights and seasonal blooms.',
      budgetAlternative: 'Use potted greenery and local flowers.',
      imagePrompt: 'Festive celebration stage with ambient lighting.',
      isDemoMode: true
    });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Gatherly AI server listening on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Server startup error:', err);
});
