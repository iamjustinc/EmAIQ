export interface Email {
  id: string;
  sender: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  subject: string;
  bodyPreview: string;
  body?: string;
  receivedAt: string; 
  category: 'Client' | 'Internal' | 'Recruiting' | 'Finance' | 'Logistics' | 'Newsletter';
  urgency: {
    label: 'High' | 'Medium' | 'Low';
    score: number;
  };
  analysis: {
    summary: string[];
    sentiment: 'Urgent' | 'Formal' | 'Casual' | 'Frustrated';
    detectedDeadline?: string | null;
  };
  suggestedAction: 'Respond' | 'Review Later' | 'Delegate' | 'Archive';
  isRead: boolean;
  isActioned: boolean;
  isFavorite: boolean; // Added this
}

export type Category = Email['category'];
export type UrgencyLabel = Email['urgency']['label'];
export type SuggestedAction = Email['suggestedAction'];
export type Sentiment = Email['analysis']['sentiment'];