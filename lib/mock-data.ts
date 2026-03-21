import { Email } from './types';

export const mockEmails: Email[] = [
  {
    id: '1',
    sender: {
      name: 'Sarah Chen',
      email: 'sarah.chen@acmecorp.com',
    },
    subject: 'Urgent: Q1 Contract Renewal - Action Required by EOD',
    bodyPreview: 'Hi Alex, I wanted to follow up on the Q1 contract renewal. The client is expecting our response by end of day today. Can you please review the attached terms and provide your sign-off?',
    receivedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    category: 'Client',
    urgency: {
      label: 'High',
      score: 95,
    },
    analysis: {
      summary: [
        'Contract renewal requires immediate attention',
        'Client expects response by end of day',
        'Attached terms need review and sign-off',
      ],
      sentiment: 'Urgent',
      detectedDeadline: 'Today EOD',
    },
    suggestedAction: 'Respond',
    isRead: false,
    isActioned: false,
  },
];

export const analyticsData = {
  categoryBreakdown: [
    { name: 'Client', value: 35, fill: 'var(--chart-1)' },
    { name: 'Internal', value: 25, fill: 'var(--chart-2)' },
    { name: 'Newsletter', value: 20, fill: 'var(--chart-3)' },
    { name: 'Finance', value: 10, fill: 'var(--chart-4)' },
    { name: 'Recruiting', value: 5, fill: 'var(--chart-5)' },
    { name: 'Logistics', value: 5, fill: 'var(--color-muted-foreground)' },
  ],
  emailVolume: [
    { day: 'Mon', emails: 45 },
    { day: 'Tue', emails: 62 },
    { day: 'Wed', emails: 38 },
    { day: 'Thu', emails: 55 },
    { day: 'Fri', emails: 48 },
    { day: 'Sat', emails: 12 },
    { day: 'Sun', emails: 8 },
  ],
  focusScore: [
    { day: 'Mon', score: 72 },
    { day: 'Tue', score: 65 },
    { day: 'Wed', score: 85 },
    { day: 'Thu', score: 78 },
    { day: 'Fri', score: 82 },
    { day: 'Sat', score: 95 },
    { day: 'Sun', score: 92 },
  ],
  distractingSenders: [
    { sender: 'Newsletter Digest', emails: 28 },
    { sender: 'Slack Notifications', emails: 24 },
    { sender: 'LinkedIn Updates', emails: 18 },
    { sender: 'Marketing Team', emails: 15 },
    { sender: 'System Alerts', emails: 12 },
  ],
  // New data for enhanced analytics
  urgentByDay: [
    { day: 'Mon', urgent: 8, nonUrgent: 37 },
    { day: 'Tue', urgent: 12, nonUrgent: 50 },
    { day: 'Wed', urgent: 5, nonUrgent: 33 },
    { day: 'Thu', urgent: 10, nonUrgent: 45 },
    { day: 'Fri', urgent: 7, nonUrgent: 41 },
    { day: 'Sat', urgent: 2, nonUrgent: 10 },
    { day: 'Sun', urgent: 1, nonUrgent: 7 },
  ],
  hourlyLoad: [
    { hour: '6AM', emails: 3 },
    { hour: '7AM', emails: 8 },
    { hour: '8AM', emails: 18 },
    { hour: '9AM', emails: 32 },
    { hour: '10AM', emails: 28 },
    { hour: '11AM', emails: 22 },
    { hour: '12PM', emails: 15 },
    { hour: '1PM', emails: 12 },
    { hour: '2PM', emails: 25 },
    { hour: '3PM', emails: 30 },
    { hour: '4PM', emails: 24 },
    { hour: '5PM', emails: 18 },
    { hour: '6PM', emails: 10 },
    { hour: '7PM', emails: 5 },
    { hour: '8PM', emails: 3 },
  ],
  topSenders: [
    { name: 'Sarah Chen', email: 'sarah.chen@acmecorp.com', count: 24, urgentCount: 8, interruptionScore: 85 },
    { name: 'Marketing Team', email: 'marketing@company.com', count: 42, urgentCount: 3, interruptionScore: 72 },
    { name: 'Slack Notifications', email: 'notifications@slack.com', count: 86, urgentCount: 0, interruptionScore: 68 },
    { name: 'Marcus Johnson', email: 'marcus.j@globaltech.io', count: 18, urgentCount: 6, interruptionScore: 62 },
    { name: 'HR Team', email: 'hr@company.com', count: 15, urgentCount: 2, interruptionScore: 45 },
    { name: 'LinkedIn', email: 'notifications@linkedin.com', count: 35, urgentCount: 0, interruptionScore: 38 },
  ],
  topicTags: [
    { topic: 'Contract Review', count: 12, trend: 'up' },
    { topic: 'Meeting Requests', count: 28, trend: 'stable' },
    { topic: 'Status Updates', count: 45, trend: 'down' },
    { topic: 'Budget Approval', count: 8, trend: 'up' },
    { topic: 'Client Feedback', count: 15, trend: 'stable' },
    { topic: 'Hiring Pipeline', count: 9, trend: 'up' },
    { topic: 'Invoice/Billing', count: 11, trend: 'stable' },
    { topic: 'Project Deadlines', count: 18, trend: 'up' },
  ],
  summaryStats: {
    focusScore: 81,
    actionableRate: 68,
    avgTriageTime: '2.3',
    timeSaved: '47',
  },
};

export const aiInsights = [
  {
    title: 'Batch Internal Updates',
    description: 'Batch internal updates into one daily review block. You could save 35 minutes per day.',
    type: 'info' as const,
  },
  {
    title: 'Peak Distraction Hours',
    description: 'You spend the most time on status emails between 9-11 AM. Consider blocking this time for deep work.',
    type: 'warning' as const,
  },
  {
    title: 'Reduce Newsletter Noise',
    description: 'Archive newsletters by default to reduce noise. 20% of your inbox is low-priority subscriptions.',
    type: 'success' as const,
  },
];
