export interface Email {
  id: string;
  sender: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  subject: string;
  bodyPreview: string;
  receivedAt: string; // ISO format
  category: 'Client' | 'Internal' | 'Recruiting' | 'Finance' | 'Logistics' | 'Newsletter';
  urgency: {
    label: 'High' | 'Medium' | 'Low';
    score: number; // 0 to 100
  };
  analysis: {
    summary: string[]; // 3 bullet points
    sentiment: 'Urgent' | 'Formal' | 'Casual' | 'Frustrated';
    detectedDeadline?: string | null;
  };
  suggestedAction: 'Respond' | 'Review Later' | 'Delegate' | 'Archive';
  isRead: boolean;
  isActioned: boolean;
}

export type Category = Email['category'];
export type UrgencyLabel = Email['urgency']['label'];
export type SuggestedAction = Email['suggestedAction'];
export type Sentiment = Email['analysis']['sentiment'];
