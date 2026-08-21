import { BrandTone } from '../types/ecommerce';

export interface ToneDescriptor {
  id: BrandTone;
  name: string;
  badge: string;
  color: string;
  description: string;
  urgencyLevel: 'High' | 'Medium' | 'Subtle';
  styleGuide: string;
}

export const brandTones: Record<BrandTone, ToneDescriptor> = {
  urgency: {
    id: 'urgency',
    name: 'High-Urgency & Scarcity',
    badge: '⚡ Fast-Action',
    color: 'from-amber-500 to-rose-500',
    description: 'High-converting scarcity hooks, countdown reminders, and low-inventory warnings.',
    urgencyLevel: 'High',
    styleGuide: 'Use action verbs, explicit expiration timers, and inventory depletion counters.',
  },
  playful: {
    id: 'playful',
    name: 'Playful & Friendly',
    badge: '🎉 Engaging',
    color: 'from-purple-500 to-pink-500',
    description: 'Relatable, enthusiastic, emoji-rich messaging with conversational humor.',
    urgencyLevel: 'Medium',
    styleGuide: 'Use warm colloquial greetings, fun emojis, and community-first storytelling.',
  },
  luxury: {
    id: 'luxury',
    name: 'Luxury & Minimalist',
    badge: '💎 Premium',
    color: 'from-slate-300 to-emerald-400',
    description: 'Understated elegance, refined craftsmanship vocabulary, and VIP privilege phrasing.',
    urgencyLevel: 'Subtle',
    styleGuide: 'Use sophisticated adjectives, understated invitations, and zero loud hype words.',
  },
  technical: {
    id: 'technical',
    name: 'Performance & Analytical',
    badge: '🔬 Data-Backed',
    color: 'from-cyan-500 to-blue-500',
    description: 'Feature-heavy, metric-driven benefit breakdowns with engineering precision.',
    urgencyLevel: 'Medium',
    styleGuide: 'Focus on performance specifications, durability metrics, and laboratory guarantees.',
  },
};

export function applyBrandToneToEmail(
  baseSubject: string,
  basePreview: string,
  tone: BrandTone,
  storeName: string
): { subject: string; preview: string } {
  switch (tone) {
    case 'urgency':
      return {
        subject: `🚨 [Expiring Soon] Your cart at ${storeName} will be released!`,
        preview: 'Items are held for 15 minutes. Final chance to apply your automatic 10% discount.',
      };
    case 'playful':
      return {
        subject: `Pssst... did you forget these goodies at ${storeName}? 👀`,
        preview: 'They miss you already! Grab them before someone else snatches them up + take 10% off.',
      };
    case 'luxury':
      return {
        subject: `Your reserved selection from ${storeName}`,
        preview: 'Your curated items remain safely set aside. We invite you to conclude your acquisition.',
      };
    case 'technical':
      return {
        subject: `${storeName} Alert: Pending checkout session for high-spec items`,
        preview: 'Cart session #4892 holds engineered gear. Complete order to verify shipment allocation.',
      };
    default:
      return { subject: baseSubject, preview: basePreview };
  }
}
