import { 
  EventDetails, 
  BudgetItem, 
  TaskItem, 
  VendorItem, 
  GuestItem, 
  DayScheduleItem,
  DecorThemeIdea,
  InvitationContent,
  MenuItem,
  DocumentItem,
  CollaboratorItem,
  ActivityItem
} from '../types';

export const INITIAL_EVENTS: EventDetails[] = [
  {
    id: 'evt-wedding-01',
    name: "Ananya & Rohan's Royal Heritage Wedding",
    type: 'wedding',
    date: '2026-11-20',
    startTime: '10:00',
    endTime: '23:30',
    city: 'Udaipur, Rajasthan',
    venue: 'Fateh Garh Palace Heritage Resort',
    guestCount: 350,
    totalBudget: 2500000,
    currency: 'INR',
    theme: 'Regal Rajputana & Marigold Sunset',
    setting: 'both',
    foodPreferences: ['Vegetarian', 'Jain', 'North Indian Royal', 'Rajasthani Dal Baati'],
    culturalRequirements: 'Traditional North Indian Hindu wedding with Sangeet, Mehendi, Haldi, and sunset Phere overlooking the lake.',
    accessibilityNeeds: 'Wheelchair access for grandparents across the palace courtyard.',
    additionalInstructions: 'Eco-friendly decor using fresh marigolds and brass lamps, zero single-use plastic.',
    createdAt: '2026-09-01T10:00:00.000Z',
    updatedAt: '2026-10-20T14:30:00.000Z',
    status: 'in_progress',
    ownerId: 'user-demo-01'
  },
  {
    id: 'evt-birthday-02',
    name: "Aarav's 10th Superhero Gala & Arcade Party",
    type: 'birthday',
    date: '2026-11-08',
    startTime: '16:30',
    endTime: '20:30',
    city: 'Bengaluru, Karnataka',
    venue: 'Playtopia Arena & Lawn, Indiranagar',
    guestCount: 65,
    totalBudget: 150000,
    currency: 'INR',
    theme: 'Avengers & Marvel Universe Champions',
    setting: 'indoor',
    foodPreferences: ['Vegetarian', 'Kids Friendly', 'Mini Burgers & Pizza', 'Live Waffle Station'],
    culturalRequirements: 'Inclusive friendly celebration with birthday cake cutting and return gifts.',
    accessibilityNeeds: 'Stroller accessible entrance.',
    additionalInstructions: 'Custom superhero cape for every child attendee.',
    createdAt: '2026-10-01T11:00:00.000Z',
    updatedAt: '2026-10-22T09:15:00.000Z',
    status: 'planning',
    ownerId: 'user-demo-01'
  },
  {
    id: 'evt-college-03',
    name: 'TechVyom 2026 — Annual Tech & Cultural Fest',
    type: 'college',
    date: '2026-12-12',
    startTime: '09:00',
    endTime: '22:00',
    city: 'Hyderabad, Telangana',
    venue: 'University Grand Open Air Amphitheatre',
    guestCount: 1200,
    totalBudget: 850000,
    currency: 'INR',
    theme: 'Cyberpunk Neon Pulse',
    setting: 'both',
    foodPreferences: ['Vegetarian', 'Non-Vegetarian', 'Hyderabadi Biryani', 'Food Truck Court'],
    culturalRequirements: 'Inter-collegiate battle of the bands, hackathon showcase, and celebrity DJ night.',
    accessibilityNeeds: 'Ramps to amphitheatre and designated seating.',
    additionalInstructions: 'QR Code entry badges and fire safety clearance from municipal authorities.',
    createdAt: '2026-08-15T08:00:00.000Z',
    updatedAt: '2026-10-18T16:45:00.000Z',
    status: 'planning',
    ownerId: 'user-demo-01'
  }
];

export const INITIAL_BUDGET_ITEMS: BudgetItem[] = [
  // Wedding items
  {
    id: 'b-01',
    eventId: 'evt-wedding-01',
    category: 'venue',
    name: 'Palace Courtyard & Lawn Rental (3 Days)',
    estimatedCost: 750000,
    actualCost: 720000,
    advancePaid: 350000,
    paymentStatus: 'partial',
    dueDate: '2026-11-05',
    vendorName: 'Fateh Garh Palace Hospitality',
    notes: 'Includes lakeside mandap lawn and banquet hall backup',
    createdAt: '2026-09-02'
  },
  {
    id: 'b-02',
    eventId: 'evt-wedding-01',
    category: 'catering',
    name: 'Royal Heritage Multi-Cuisine Buffet (350 pax)',
    estimatedCost: 650000,
    actualCost: 630000,
    advancePaid: 300000,
    paymentStatus: 'partial',
    dueDate: '2026-11-10',
    vendorName: 'Maharaja Royal Caterers',
    notes: 'Includes 4 live counters, Rajasthani sweets, high tea',
    createdAt: '2026-09-03'
  },
  {
    id: 'b-03',
    eventId: 'evt-wedding-01',
    category: 'decorations',
    name: 'Floral Mandap, Marigold Strings & Fairy Lighting',
    estimatedCost: 350000,
    actualCost: 360000,
    advancePaid: 180000,
    paymentStatus: 'partial',
    dueDate: '2026-11-12',
    vendorName: 'Vedic Blooms & Decor Arts',
    notes: 'Lake-facing mandap with real brass urulis and floating diyas',
    createdAt: '2026-09-05'
  },
  {
    id: 'b-04',
    eventId: 'evt-wedding-01',
    category: 'photography',
    name: 'Cinematography + Candid Drone Coverage (3 Days)',
    estimatedCost: 240000,
    actualCost: 220000,
    advancePaid: 100000,
    paymentStatus: 'partial',
    dueDate: '2026-11-15',
    vendorName: 'ShutterShade Cinematic Weddings',
    notes: 'Deliverables: 1 Cinematic Teaser, 40-min film, 800 edited high-res photos',
    createdAt: '2026-09-06'
  },
  {
    id: 'b-05',
    eventId: 'evt-wedding-01',
    category: 'entertainment',
    name: 'Live Folk Rajasthani Manganiyar Troup & Sangeet DJ',
    estimatedCost: 150000,
    actualCost: 140000,
    advancePaid: 70000,
    paymentStatus: 'partial',
    dueDate: '2026-11-18',
    vendorName: 'Desert Symphony & DJ Kabir',
    notes: 'Manganiyar live folk for Mehendi + DJ with acoustic sound system for Sangeet',
    createdAt: '2026-09-08'
  },
  {
    id: 'b-06',
    eventId: 'evt-wedding-01',
    category: 'clothing_makeup',
    name: 'Bridal Lehengas, Groom Sherwani & Makeup Team',
    estimatedCost: 200000,
    actualCost: 195000,
    advancePaid: 195000,
    paymentStatus: 'paid',
    dueDate: '2026-10-15',
    vendorName: 'Sabyasachi Heritage & Glow Glam Salon',
    notes: 'Completed all trial fittings and final pickup',
    createdAt: '2026-09-10'
  },
  {
    id: 'b-07',
    eventId: 'evt-wedding-01',
    category: 'invitations',
    name: 'Lacquered Wooden Box Invites + Digital WhatsApp Suite',
    estimatedCost: 45000,
    actualCost: 42000,
    advancePaid: 42000,
    paymentStatus: 'paid',
    dueDate: '2026-09-30',
    vendorName: 'Vellum & Gilt Studios',
    notes: 'Dispatched to all family and outstation guests',
    createdAt: '2026-09-12'
  },
  {
    id: 'b-08',
    eventId: 'evt-wedding-01',
    category: 'transportation',
    name: 'Luxury Coaches & AC Innova Airport Shuttles (3 Days)',
    estimatedCost: 65000,
    actualCost: 60000,
    advancePaid: 20000,
    paymentStatus: 'partial',
    dueDate: '2026-11-19',
    vendorName: 'Mewar Luxury Cabs',
    notes: 'Covers airport transfers from Dabok Airport to Fateh Garh',
    createdAt: '2026-09-15'
  },
  {
    id: 'b-09',
    eventId: 'evt-wedding-01',
    category: 'emergency_reserve',
    name: 'Unforeseen Weather & Miscellaneous Contingency Fund',
    estimatedCost: 50000,
    actualCost: 15000,
    advancePaid: 0,
    paymentStatus: 'unpaid',
    dueDate: '2026-11-20',
    notes: 'Extra canopy heaters if night temperature drops below 14°C',
    createdAt: '2026-09-20'
  },

  // Birthday items
  {
    id: 'b-10',
    eventId: 'evt-birthday-02',
    category: 'venue',
    name: 'Arena & Party Lawn Booking (4 Hours)',
    estimatedCost: 45000,
    actualCost: 42000,
    advancePaid: 20000,
    paymentStatus: 'partial',
    dueDate: '2026-11-01',
    vendorName: 'Playtopia Arena',
    createdAt: '2026-10-02'
  },
  {
    id: 'b-11',
    eventId: 'evt-birthday-02',
    category: 'catering',
    name: 'Kids Buffet, Live Pasta Bar & Avengers Tier Cake',
    estimatedCost: 50000,
    actualCost: 48000,
    advancePaid: 25000,
    paymentStatus: 'partial',
    dueDate: '2026-11-05',
    vendorName: 'Whimsical Bakes & Bites',
    createdAt: '2026-10-03'
  },
  {
    id: 'b-12',
    eventId: 'evt-birthday-02',
    category: 'entertainment',
    name: 'Illusionist Magic Show, Game Host & Superhero Mascots',
    estimatedCost: 28000,
    actualCost: 26000,
    advancePaid: 10000,
    paymentStatus: 'partial',
    dueDate: '2026-11-06',
    vendorName: 'Marvelous Kids Entertainment',
    createdAt: '2026-10-04'
  },
  {
    id: 'b-13',
    eventId: 'evt-birthday-02',
    category: 'decorations',
    name: 'Marvel Balloon Arch, Neon Photo Booth & Capes',
    estimatedCost: 20000,
    actualCost: 18000,
    advancePaid: 18000,
    paymentStatus: 'paid',
    dueDate: '2026-10-25',
    vendorName: 'Balloon Crafters Co.',
    createdAt: '2026-10-05'
  }
];

export const INITIAL_TASKS: TaskItem[] = [
  // Wedding Tasks
  {
    id: 't-01',
    eventId: 'evt-wedding-01',
    title: 'Finalize and sign Fateh Garh Palace venue contract',
    category: 'Venue',
    dueDate: '2026-09-15',
    priority: 'high',
    status: 'completed',
    assignedTo: 'Rohan Sharma',
    notes: 'Signed and advance receipt attached in vault.'
  },
  {
    id: 't-02',
    eventId: 'evt-wedding-01',
    title: 'Schedule Menu Food Tasting Session with Maharaja Caterers',
    category: 'Catering',
    dueDate: '2026-10-25',
    priority: 'high',
    status: 'in_progress',
    assignedTo: 'Ananya Verma',
    notes: 'Focus on tasting Rajasthani Dal Baati Churma and dessert varieties.'
  },
  {
    id: 't-03',
    eventId: 'evt-wedding-01',
    title: 'Confirm Sangeet Choreography playlist and rehearse',
    category: 'Entertainment',
    dueDate: '2026-11-05',
    priority: 'medium',
    status: 'in_progress',
    assignedTo: 'Pooja (Bridesmaid)',
    notes: 'Total 6 performances scheduled.'
  },
  {
    id: 't-04',
    eventId: 'evt-wedding-01',
    title: 'Send WhatsApp RSVP reminder to outstation guests',
    category: 'Guests',
    dueDate: '2026-10-28',
    priority: 'high',
    status: 'pending',
    assignedTo: 'Ananya Verma',
    notes: 'Need flight arrival details for airport shuttle dispatch.'
  },
  {
    id: 't-05',
    eventId: 'evt-wedding-01',
    title: 'Review Mandap Floral Mockup & Acoustic sound limits',
    category: 'Decorations',
    dueDate: '2026-11-08',
    priority: 'medium',
    status: 'pending',
    assignedTo: 'Vikram (Wedding Planner)',
    notes: 'Ensure lakefront breeze safeguards for candles.'
  },
  {
    id: 't-06',
    eventId: 'evt-wedding-01',
    title: 'Prepare Room Welcome Hampers with Local Udaipur Sweets',
    category: 'Gifts & Hospitality',
    dueDate: '2026-11-16',
    priority: 'low',
    status: 'pending',
    assignedTo: 'Sneha (Sister)',
    notes: 'Include personalized handwritten welcome notes.'
  },
  {
    id: 't-07',
    eventId: 'evt-wedding-01',
    title: 'Conduct Final Sound & Drone Camera Inspection',
    category: 'Photography',
    dueDate: '2026-11-19',
    priority: 'medium',
    status: 'pending',
    assignedTo: 'ShutterShade Team',
    notes: 'Check battery spares and palace drone flight permit.'
  },

  // Birthday Tasks
  {
    id: 't-08',
    eventId: 'evt-birthday-02',
    title: 'Order custom Iron-Man & Spider-Man 3D Fondant Cake',
    category: 'Catering',
    dueDate: '2026-10-30',
    priority: 'high',
    status: 'in_progress',
    assignedTo: 'Priya (Mom)',
    notes: 'Chocolate truffle flavor, eggless.'
  },
  {
    id: 't-09',
    eventId: 'evt-birthday-02',
    title: 'Pack 40 Superhero return gift boxes with badges and comic books',
    category: 'Gifts',
    dueDate: '2026-11-05',
    priority: 'medium',
    status: 'pending',
    assignedTo: 'Karan (Dad)',
    notes: 'Pre-ordered from vendor.'
  }
];

export const INITIAL_VENDORS: VendorItem[] = [
  {
    id: 'v-01',
    eventId: 'evt-wedding-01',
    name: 'Fateh Garh Palace Hospitality',
    category: 'venues',
    contactPerson: 'Mr. Surendra Singh Rathore',
    phone: '+91 98290 12345',
    email: 'events@fatehgarhpalace.com',
    quotationAmount: 720000,
    servicesOffered: 'Exclusive courtyard, luxury lawn, complimentary honeymoon suite, round-the-clock security',
    paymentStatus: 'partial',
    bookingStatus: 'booked',
    notes: 'GST invoice submitted. Noise cutoff strictly at 11:00 PM per municipal regulation.',
    rating: 4.9,
    attachmentName: 'FatehGarh_Venue_Agreement_Signed.pdf'
  },
  {
    id: 'v-02',
    eventId: 'evt-wedding-01',
    name: 'Maharaja Royal Caterers',
    category: 'caterers',
    contactPerson: 'Chef Lalit Joshi',
    phone: '+91 94140 88990',
    email: 'info@maharajacaterers.in',
    quotationAmount: 630000,
    servicesOffered: 'Pure Veg & Jain Rajasthani Banquet, Live Chaat Counter, Royal Dessert Platter, High Tea',
    paymentStatus: 'partial',
    bookingStatus: 'booked',
    notes: 'All cutlery and copper royal chaffing dishes included in quotation.',
    rating: 4.8,
    attachmentName: 'Catering_Tasting_Menu_Quotation.pdf'
  },
  {
    id: 'v-03',
    eventId: 'evt-wedding-01',
    name: 'Vedic Blooms & Decor Arts',
    category: 'decorators',
    contactPerson: 'Aarti Kulkarni',
    phone: '+91 98901 44552',
    email: 'aarti@vedicblooms.com',
    quotationAmount: 360000,
    servicesOffered: 'Marigold floral mandap, entrance floral rangoli, brass urlis, warm fairy lights canopy',
    paymentStatus: 'partial',
    bookingStatus: 'booked',
    notes: 'Eco-friendly proposal approved.',
    rating: 4.9,
    attachmentName: 'Decor_Floral_Mandap_Concept.pdf'
  },
  {
    id: 'v-04',
    eventId: 'evt-wedding-01',
    name: 'ShutterShade Cinematic Weddings',
    category: 'photographers',
    contactPerson: 'Aakash Verma',
    phone: '+91 97654 32109',
    email: 'aakash@shuttershade.co',
    quotationAmount: 220000,
    servicesOffered: '2 Candid Photographers, 2 Cinematographers, 1 Drone Pilot, 4K Master Video',
    paymentStatus: 'partial',
    bookingStatus: 'booked',
    notes: 'Includes pre-wedding teaser reel for Instagram.',
    rating: 5.0,
    attachmentName: 'ShutterShade_Contract_2026.pdf'
  },
  {
    id: 'v-05',
    eventId: 'evt-wedding-01',
    name: 'Desert Symphony Manganiyars',
    category: 'entertainment',
    contactPerson: 'Ustad Anwar Khan',
    phone: '+91 98281 77665',
    email: 'desert.symphony@folkart.org',
    quotationAmount: 80000,
    servicesOffered: '7-piece Rajasthani authentic folk orchestra with Morchang, Kamaicha, Dholak & Khartal',
    paymentStatus: 'partial',
    bookingStatus: 'booked',
    notes: 'Will perform during the Mehendi and sunset guest reception.',
    rating: 4.9
  },
  {
    id: 'v-06',
    eventId: 'evt-wedding-01',
    name: 'Mewar Royal Coaches',
    category: 'transport',
    contactPerson: 'Gopal Meena',
    phone: '+91 94142 33441',
    email: 'bookings@mewarroyalcoaches.com',
    quotationAmount: 60000,
    servicesOffered: '3 Luxury 24-seater mini-buses and 4 AC Innova Crysta for 3 full days',
    paymentStatus: 'partial',
    bookingStatus: 'booked',
    notes: 'Includes airport pickup signboards with bride & groom names.',
    rating: 4.7
  }
];

export const INITIAL_GUESTS: GuestItem[] = [
  {
    id: 'g-01',
    eventId: 'evt-wedding-01',
    name: 'Dr. Ashok & Meena Verma',
    email: 'ashok.verma@aiims.edu',
    phone: '+91 98110 54321',
    invitationStatus: 'sent',
    rsvpStatus: 'accepted',
    attendanceStatus: 'confirmed',
    dietaryPreference: 'vegetarian',
    groupCategory: "Bride's Family",
    tableNumber: 'Table 1 - Royal Court',
    plusOnes: 1,
    notes: 'Grandparents, require ground floor seating.'
  },
  {
    id: 'g-02',
    eventId: 'evt-wedding-01',
    name: 'Raghav & Neha Sharma',
    email: 'raghav.sharma@techfirm.com',
    phone: '+91 99201 12348',
    invitationStatus: 'sent',
    rsvpStatus: 'accepted',
    attendanceStatus: 'confirmed',
    dietaryPreference: 'vegetarian',
    groupCategory: "Groom's Family",
    tableNumber: 'Table 2 - Royal Court',
    plusOnes: 2,
    notes: 'Arriving 19th Nov via SpiceJet flight.'
  },
  {
    id: 'g-03',
    eventId: 'evt-wedding-01',
    name: 'Sameer Patel',
    email: 'sameer.patel@designstudio.in',
    phone: '+91 98450 99887',
    invitationStatus: 'sent',
    rsvpStatus: 'accepted',
    attendanceStatus: 'confirmed',
    dietaryPreference: 'jain',
    groupCategory: 'College Friends',
    tableNumber: 'Table 6 - Alumni Lounge',
    plusOnes: 0,
    notes: 'Strict Jain meal without onion/garlic/root veg.'
  },
  {
    id: 'g-04',
    eventId: 'evt-wedding-01',
    name: 'Divya & Siddharth Roy',
    email: 'divya.roy@londonconsulting.co.uk',
    phone: '+44 7911 123456',
    invitationStatus: 'sent',
    rsvpStatus: 'accepted',
    attendanceStatus: 'confirmed',
    dietaryPreference: 'vegan',
    groupCategory: 'Overseas Friends',
    tableNumber: 'Table 7 - Globetrotters',
    plusOnes: 1,
    notes: 'Vegan diet request.'
  },
  {
    id: 'g-05',
    eventId: 'evt-wedding-01',
    name: 'Rajesh & Sunita Singhal',
    email: 'rajesh.singhal@industrial.com',
    phone: '+91 98290 66554',
    invitationStatus: 'sent',
    rsvpStatus: 'pending',
    attendanceStatus: 'pending',
    dietaryPreference: 'vegetarian',
    groupCategory: 'Family Friends',
    plusOnes: 2,
    notes: 'Follow up on WhatsApp on 28th Oct.'
  },
  {
    id: 'g-06',
    eventId: 'evt-wedding-01',
    name: 'Aditya Mathur',
    email: 'aditya.mathur@corp.com',
    phone: '+91 98765 43219',
    invitationStatus: 'sent',
    rsvpStatus: 'declined',
    attendanceStatus: 'absent',
    dietaryPreference: 'vegetarian',
    groupCategory: 'Office Colleagues',
    plusOnes: 0,
    notes: 'Cannot attend due to overseas project launch, sent warm wishes.'
  }
];

export const INITIAL_DAY_SCHEDULE: DayScheduleItem[] = [
  {
    id: 's-01',
    eventId: 'evt-wedding-01',
    time: '08:30 AM',
    title: 'Bridal & Groom Makeup Begins',
    location: 'Bridal Suite, 2nd Floor',
    leadPerson: 'Glow Glam Salon Team',
    notes: 'Photographer arrives at 09:30 AM for getting-ready shots.',
    completed: false
  },
  {
    id: 's-02',
    eventId: 'evt-wedding-01',
    time: '10:30 AM',
    title: 'Haldi & Phoolon Ki Holi Ceremony',
    location: 'Palace Central Fountain Courtyard',
    leadPerson: 'Sneha (Sister) & Vedic Blooms',
    notes: 'Yellow dress code, marigold petal baskets ready.',
    completed: false
  },
  {
    id: 's-03',
    eventId: 'evt-wedding-01',
    time: '01:00 PM',
    title: 'Traditional Rajasthani Lunch Buffet',
    location: 'Lakeside Dining Verandah',
    leadPerson: 'Chef Lalit (Maharaja Caterers)',
    notes: '350 pax live counter with Ghewar & Malpua.',
    completed: false
  },
  {
    id: 's-04',
    eventId: 'evt-wedding-01',
    time: '04:45 PM',
    title: 'Baraat Procession & Welcome Ceremony (Milni)',
    location: 'Palace Grand Gateway to Courtyard',
    leadPerson: 'Dhol Troup & Ustad Anwar Khan',
    notes: 'Rose petal shower at grand archway.',
    completed: false
  },
  {
    id: 's-05',
    eventId: 'evt-wedding-01',
    time: '06:00 PM',
    title: 'Sunset Jaimala & Phere by the Lake',
    location: 'Lakeside Mandap Lawn',
    leadPerson: 'Head Pandit Shri Sharma Ji',
    notes: 'Drone recording permitted during sunset ceremony.',
    completed: false
  },
  {
    id: 's-06',
    eventId: 'evt-wedding-01',
    time: '08:30 PM',
    title: 'Royal Banquet Dinner & Sangeet Celebration',
    location: 'Grand Ballroom & Illuminated Lawn',
    leadPerson: 'DJ Kabir & Anchor Priya',
    notes: 'Cake cutting followed by family dance performances.',
    completed: false
  }
];

export const INITIAL_DECOR_IDEAS: DecorThemeIdea[] = [
  {
    id: 'dec-01',
    eventId: 'evt-wedding-01',
    themeName: 'Regal Rajputana & Marigold Sunset',
    description: 'An ode to Mewari royalty with warm ochre walls, fragrant yellow and saffron marigolds, antique brass lamps, and cascading fairy lights echoing starry skies.',
    colorPalette: [
      { name: 'Royal Crimson', hex: '#8B1E2D' },
      { name: 'Sunset Marigold', hex: '#F39C12' },
      { name: 'Antique Brass Gold', hex: '#D4AF37' },
      { name: 'Palace Ivory', hex: '#FDFBF7' },
      { name: 'Forest Emerald', hex: '#1B4332' }
    ],
    stageConcept: 'Geometric wooden jaali backdrop adorned with layered marigold garlands and hanging brass lotus bells, framed by an open view of Lake Pichola.',
    floralLighting: 'Fresh marigold strings, tuberose (rajnigandha) chandeliers, soft 2700K warm LED wash lights, and 150 safe glass floating diyas.',
    budgetAlternative: 'Use local seasonal marigolds and jasmine instead of imported hydrangeas; rent heritage brass urulis rather than buying new metal props.',
    imagePrompt: 'A breathtaking lakeside wedding mandap in Udaipur with marigold garlands, brass lamps, soft sunset golden light, and Lake Pichola in the background, cinematic quality.',
    isFavorite: true
  },
  {
    id: 'dec-02',
    eventId: 'evt-wedding-01',
    themeName: 'Emerald Garden & Jasmine Whispers',
    description: 'A contemporary fresh botanical theme featuring lush green foliage, scented white mogra, crystal candle-holders, and subtle champagne gold accents.',
    colorPalette: [
      { name: 'Deep Emerald', hex: '#0B4F37' },
      { name: 'Sage Green', hex: '#7D9D8B' },
      { name: 'Champagne Gold', hex: '#E5C158' },
      { name: 'Pure Jasmine White', hex: '#FDFEFE' }
    ],
    stageConcept: 'Living vertical garden wall with cascading white mogra strings and delicate brass candle scones.',
    floralLighting: 'Hanging glass globes with LED tea lights, warm string lighting across olive trees, and floral misting fans.',
    budgetAlternative: 'Combine eucalyptus leaves with seasonal white carnations and local jasmine buds.',
    imagePrompt: 'Modern royal Indian wedding reception lawn with botanical emerald foliage, cascading white jasmine garlands, and floating lanterns under the stars.',
    isFavorite: false
  }
];

export const INITIAL_INVITATIONS: InvitationContent[] = [
  {
    id: 'inv-01',
    eventId: 'evt-wedding-01',
    format: 'whatsapp',
    tone: 'royal',
    language: 'English',
    headline: '👑 Two Souls, One Eternal Journey — Ananya & Rohan',
    body: `Namaste! 🙏✨

With the blessings of our elders and the grace of the Almighty, we joyfully invite you and your family to celebrate the auspicious union of:

🌸 Ananya Verma & Rohan Sharma 🌸

Join us amid the royal splendour of Udaipur as we begin our forever journey together.

📅 Date: 20th November 2026
📍 Venue: Fateh Garh Palace Heritage Resort, Udaipur
⏰ Haldi & Welcome: 10:30 AM | Sunset Phere: 06:00 PM | Royal Banquet: 08:30 PM

Your presence and blessings will make our special day complete. Kindly treat this as our personal invitation and let us know your travel details.

With love and regards,
The Verma & Sharma Families`,
    hashtags: '#AnanyaWedsRohan #RoyalUdaipurWedding #VermaSharmaNuptials',
    callToAction: 'Tap the link below to view the itinerary and RSVP by 30th October:',
    createdAt: '2026-09-15'
  },
  {
    id: 'inv-02',
    eventId: 'evt-wedding-01',
    format: 'instagram',
    tone: 'festive',
    language: 'English',
    headline: '✨ From College Hallways to Palace Courtyards 💍',
    body: `We’re making it official! In a city steeped in poetry and lakes, we’re tying the knot surrounded by the people who mean the world to us.

Count with us down to November 20th, 2026 in Udaipur! 🌅🏰

Drop your favourite love song recommendations below for our Sangeet playlist! 👇🎶`,
    hashtags: '#AnanyaRohanForever #DestinationWedding #UdaipurDiaries #WeddingCountdown #IndianWedding',
    callToAction: 'Save the Date | Link in bio for travel guide & schedule',
    createdAt: '2026-09-16'
  }
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'm-01',
    eventId: 'evt-wedding-01',
    course: 'welcome_drinks',
    name: 'Saffron Thandai with Rose Pistachio Crumble',
    dietary: 'veg',
    estimatedPerPersonGrams: 200,
    notes: 'Served in chilled earthenware kulhads on arrival.'
  },
  {
    id: 'm-02',
    eventId: 'evt-wedding-01',
    course: 'welcome_drinks',
    name: 'Fresh Keri Panna with Smoked Cumin & Mint',
    dietary: 'veg',
    estimatedPerPersonGrams: 200,
    notes: 'Cooling traditional raw mango summer refresher.'
  },
  {
    id: 'm-03',
    eventId: 'evt-wedding-01',
    course: 'starters',
    name: 'Royal Paneer Tikka Angara & Dahi Ke Kebab',
    dietary: 'veg',
    estimatedPerPersonGrams: 150,
    notes: 'Live tandoor counter with mint chutney and pickled onions.'
  },
  {
    id: 'm-04',
    eventId: 'evt-wedding-01',
    course: 'starters',
    name: 'Dal Kachori with Rajasthani Khatti Meethi Kadhi',
    dietary: 'veg',
    estimatedPerPersonGrams: 120,
    notes: 'Crispy bite-sized savouries.'
  },
  {
    id: 'm-05',
    eventId: 'evt-wedding-01',
    course: 'main_course',
    name: 'Mewari Dal Baati Churma with Pure Desi Ghee',
    dietary: 'veg',
    estimatedPerPersonGrams: 350,
    notes: 'Signature dish with 5 varieties of dal and rose petal churma.'
  },
  {
    id: 'm-06',
    eventId: 'evt-wedding-01',
    course: 'main_course',
    name: 'Shahi Malai Kofta & Zafrani Dum Pulao',
    dietary: 'veg',
    estimatedPerPersonGrams: 300,
    notes: 'Rich cashew gravy and aged Dehradun basmati rice.'
  },
  {
    id: 'm-07',
    eventId: 'evt-wedding-01',
    course: 'desserts',
    name: 'Warm Moong Dal Halwa & Rabdi Ghewar with Gold Foil',
    dietary: 'veg',
    estimatedPerPersonGrams: 180,
    notes: 'Traditional dessert station with live rabdi drizzling.'
  }
];

export const INITIAL_COLLABORATORS: CollaboratorItem[] = [
  {
    id: 'col-01',
    eventId: 'evt-wedding-01',
    email: 'sainadhpuvvada2005@gmail.com',
    name: 'Sainadh Puvvada',
    role: 'owner',
    status: 'active'
  },
  {
    id: 'col-02',
    eventId: 'evt-wedding-01',
    email: 'ananya.verma@gatherly.ai',
    name: 'Ananya Verma (Bride)',
    role: 'editor',
    status: 'active'
  },
  {
    id: 'col-03',
    eventId: 'evt-wedding-01',
    email: 'rohan.sharma@gatherly.ai',
    name: 'Rohan Sharma (Groom)',
    role: 'editor',
    status: 'active'
  },
  {
    id: 'col-04',
    eventId: 'evt-wedding-01',
    email: 'vikram.planner@gatherly.ai',
    name: 'Vikram Mehta (Lead Coordinator)',
    role: 'editor',
    status: 'active'
  }
];

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-01',
    eventId: 'evt-wedding-01',
    title: 'Palace Venue Booking & Courtyard Policy Agreement',
    category: 'contract',
    fileName: 'FatehGarh_Venue_Agreement_Signed.pdf',
    fileSize: '2.4 MB',
    uploadedAt: '2026-09-15',
    vendorId: 'v-01'
  },
  {
    id: 'doc-02',
    eventId: 'evt-wedding-01',
    title: 'Comprehensive Catering Menu Proposal with Tasting Log',
    category: 'quotation',
    fileName: 'Maharaja_Catering_Approved_Menu.pdf',
    fileSize: '1.8 MB',
    uploadedAt: '2026-09-18',
    vendorId: 'v-02'
  },
  {
    id: 'doc-03',
    eventId: 'evt-wedding-01',
    title: 'Floral Mandap 3D Elevation & Seating Floorplan',
    category: 'design',
    fileName: 'Mandap_Design_Elevation_v2.pdf',
    fileSize: '4.1 MB',
    uploadedAt: '2026-09-22',
    vendorId: 'v-03'
  },
  {
    id: 'doc-04',
    eventId: 'evt-wedding-01',
    title: 'Advance Token Payment Receipt (INR 3,50,000)',
    category: 'receipt',
    fileName: 'Receipt_Palace_Token_350k.pdf',
    fileSize: '480 KB',
    uploadedAt: '2026-09-16',
    vendorId: 'v-01'
  }
];

export const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-01',
    eventId: 'evt-wedding-01',
    timestamp: '2026-10-23T07:15:00Z',
    action: 'AI Assistant recommended reducing decoration expenses by ₹15,000 with marigold alternatives',
    user: 'Gatherly AI',
    type: 'ai'
  },
  {
    id: 'act-02',
    eventId: 'evt-wedding-01',
    timestamp: '2026-10-22T16:20:00Z',
    action: 'Confirmed RSVP for Dr. Ashok & Meena Verma (Bride’s Family, 2 pax)',
    user: 'Ananya Verma',
    type: 'guest'
  },
  {
    id: 'act-03',
    eventId: 'evt-wedding-01',
    timestamp: '2026-10-21T11:45:00Z',
    action: 'Recorded advance payment of ₹1,80,000 to Vedic Blooms & Decor Arts',
    user: 'Rohan Sharma',
    type: 'budget'
  },
  {
    id: 'act-04',
    eventId: 'evt-wedding-01',
    timestamp: '2026-10-20T14:30:00Z',
    action: 'Updated event-day run-sheet: Moved Baraat to 04:45 PM for sunset Phere',
    user: 'Vikram Mehta',
    type: 'task'
  }
];
