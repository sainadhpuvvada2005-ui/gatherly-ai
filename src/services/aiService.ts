import { AiPlanResponse, EventDetails, DecorThemeIdea, InvitationContent } from '../types';

export const AiService = {
  async getStatus(): Promise<{ geminiConfigured: boolean; firebaseConfigured: boolean }> {
    try {
      const res = await fetch('/api/status');
      if (!res.ok) throw new Error('Status failed');
      return await res.json();
    } catch {
      return { geminiConfigured: false, firebaseConfigured: false };
    }
  },

  async generatePlan(event: Partial<EventDetails>): Promise<AiPlanResponse> {
    const res = await fetch('/api/ai/plan-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    });

    if (!res.ok) {
      throw new Error(`AI planning request failed with status: ${res.status}`);
    }

    return await res.json();
  },

  async sendChatMessage(
    message: string, 
    event?: EventDetails, 
    history: { sender: 'user' | 'ai'; text: string }[] = []
  ): Promise<{ reply: string; suggestedAction?: any; isDemoMode?: boolean }> {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, event, history })
    });

    if (!res.ok) {
      throw new Error(`Chat request failed with status: ${res.status}`);
    }

    return await res.json();
  },

  async generateInvitation(
    event: EventDetails, 
    format: 'whatsapp' | 'instagram' | 'formal_card' | 'email',
    tone: 'elegant' | 'casual' | 'festive' | 'royal' | 'fun',
    language: 'English' | 'Telugu' | 'Hindi'
  ): Promise<InvitationContent & { isDemoMode?: boolean }> {
    const res = await fetch('/api/ai/invitation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, format, tone, language })
    });

    if (!res.ok) {
      throw new Error(`Invitation request failed with status: ${res.status}`);
    }

    return await res.json();
  },

  async generateDecor(event: EventDetails): Promise<DecorThemeIdea & { isDemoMode?: boolean }> {
    const res = await fetch('/api/ai/decor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event })
    });

    if (!res.ok) {
      throw new Error(`Decor AI request failed with status: ${res.status}`);
    }

    return await res.json();
  }
};
