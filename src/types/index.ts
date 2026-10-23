export type EventType = 'wedding' | 'birthday' | 'college' | 'community' | 'custom';

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED';

export interface EventDetails {
  id: string;
  name: string;
  type: EventType;
  date: string;
  startTime?: string;
  endTime?: string;
  city: string;
  venue?: string;
  guestCount: number;
  totalBudget: number;
  currency: CurrencyCode;
  theme?: string;
  setting: 'indoor' | 'outdoor' | 'both';
  foodPreferences: string[]; // e.g. ["Vegetarian", "Non-Vegetarian", "Jain", "Vegan"]
  culturalRequirements?: string;
  accessibilityNeeds?: string;
  additionalInstructions?: string;
  createdAt: string;
  updatedAt: string;
  status: 'planning' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  ownerId: string;
}

export type BudgetCategory = 
  | 'venue'
  | 'catering'
  | 'decorations'
  | 'photography'
  | 'entertainment'
  | 'invitations'
  | 'clothing_makeup'
  | 'transportation'
  | 'accommodation'
  | 'equipment'
  | 'miscellaneous'
  | 'emergency_reserve';

export interface BudgetItem {
  id: string;
  eventId: string;
  category: BudgetCategory;
  name: string;
  estimatedCost: number;
  actualCost: number;
  advancePaid: number;
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  dueDate?: string;
  vendorName?: string;
  notes?: string;
  createdAt: string;
}

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface TaskItem {
  id: string;
  eventId: string;
  title: string;
  category: string;
  dueDate: string;
  dueTime?: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo?: string;
  dependencies?: string[];
  notes?: string;
  isAiGenerated?: boolean;
}

export type VendorCategory = 
  | 'venues'
  | 'caterers'
  | 'decorators'
  | 'photographers'
  | 'videographers'
  | 'makeup_artists'
  | 'entertainment'
  | 'transport'
  | 'equipment'
  | 'invitation_designers';

export type BookingStatus = 'contacted' | 'shortlisted' | 'booked' | 'rejected';

export interface VendorItem {
  id: string;
  eventId: string;
  name: string;
  category: VendorCategory;
  contactPerson: string;
  phone: string;
  email: string;
  quotationAmount: number;
  servicesOffered: string;
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  bookingStatus: BookingStatus;
  notes?: string;
  rating?: number;
  attachmentName?: string;
}

export type RsvpStatus = 'pending' | 'accepted' | 'declined';
export type AttendanceStatus = 'pending' | 'confirmed' | 'absent';
export type DietaryOption = 'vegetarian' | 'non_vegetarian' | 'vegan' | 'jain' | 'halal' | 'other';

export interface GuestItem {
  id: string;
  eventId: string;
  name: string;
  email?: string;
  phone?: string;
  invitationStatus: 'not_sent' | 'sent';
  rsvpStatus: RsvpStatus;
  attendanceStatus: AttendanceStatus;
  dietaryPreference: DietaryOption;
  accessibilityNeeds?: string;
  groupCategory: string; // e.g. "Groom's Family", "Bride's Friends", "College Alumni", "VIP"
  tableNumber?: string;
  plusOnes: number;
  notes?: string;
}

export interface DayScheduleItem {
  id: string;
  eventId: string;
  time: string;
  title: string;
  location: string;
  leadPerson?: string;
  notes?: string;
  completed?: boolean;
}

export interface DecorThemeIdea {
  id: string;
  eventId: string;
  themeName: string;
  description: string;
  colorPalette: { name: string; hex: string }[];
  stageConcept: string;
  floralLighting: string;
  budgetAlternative: string;
  imagePrompt: string;
  isFavorite: boolean;
}

export interface InvitationContent {
  id: string;
  eventId: string;
  format: 'whatsapp' | 'instagram' | 'formal_card' | 'email';
  tone: 'elegant' | 'casual' | 'festive' | 'royal' | 'fun';
  language: 'English' | 'Telugu' | 'Hindi';
  headline: string;
  body: string;
  hashtags?: string;
  callToAction: string;
  createdAt: string;
}

export interface MenuItem {
  id: string;
  eventId: string;
  course: 'welcome_drinks' | 'starters' | 'main_course' | 'desserts' | 'late_night';
  name: string;
  dietary: 'veg' | 'non_veg' | 'vegan' | 'jain';
  estimatedPerPersonGrams?: number;
  notes?: string;
}

export interface DocumentItem {
  id: string;
  eventId: string;
  title: string;
  category: 'contract' | 'quotation' | 'receipt' | 'design' | 'other';
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  vendorId?: string;
  url?: string;
}

export interface CollaboratorItem {
  id: string;
  eventId: string;
  email: string;
  name: string;
  role: 'owner' | 'editor' | 'viewer';
  status: 'active' | 'invited';
  avatar?: string;
}

export interface ActivityItem {
  id: string;
  eventId: string;
  timestamp: string;
  action: string;
  user: string;
  type: 'event' | 'budget' | 'task' | 'vendor' | 'guest' | 'ai';
}

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  timestamp: string;
  read: boolean;
  linkTab?: string;
}

export interface PostEventReview {
  id: string;
  eventId: string;
  finalActualBudget: number;
  totalGuestsAttended: number;
  rating: number; // 1 to 5
  highlights: string;
  challenges: string;
  vendorFeedback: { vendorName: string; rating: number; review: string }[];
  lessonsLearned: string[];
}

export interface AiPlanResponse {
  overview: string;
  budgetSavingTips: string[];
  suggestedAllocations: {
    category: BudgetCategory;
    percentage: number;
    amount: number;
    description: string;
  }[];
  tasks: {
    title: string;
    category: string;
    dueRelativeDays: number; // e.g. -30 for 30 days before event
    priority: TaskPriority;
    notes: string;
  }[];
  milestones: {
    timelinePhase: string;
    description: string;
  }[];
  menuRecommendations: string[];
  decorConcepts: string[];
  risksAndMitigation: {
    risk: string;
    mitigation: string;
  }[];
  guestManagementTips: string[];
  isDemoMode?: boolean;
}
