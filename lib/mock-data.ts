export const analyticsData = {
  summaryStats: {
    focusScore: 81,
    actionableRate: 68,
    avgTriageTime: 2.3,
    timeSaved: 47
  },
  urgentByDay: [
    { day: 'Mon', urgent: 12, nonUrgent: 35 },
    { day: 'Tue', urgent: 18, nonUrgent: 42 },
    { day: 'Wed', urgent: 8, nonUrgent: 33 },
    { day: 'Thu', urgent: 15, nonUrgent: 45 },
    { day: 'Fri', urgent: 10, nonUrgent: 40 },
    { day: 'Sat', urgent: 4, nonUrgent: 12 },
    { day: 'Sun', urgent: 2, nonUrgent: 8 },
  ],
  hourlyLoad: [
    { hour: '6AM', emails: 5 }, { hour: '8AM', emails: 25 },
    { hour: '10AM', emails: 82 }, { hour: '12PM', emails: 45 },
    { hour: '2PM', emails: 70 }, { hour: '4PM', emails: 55 },
    { hour: '6PM', emails: 20 }, { hour: '8PM', emails: 5 },
  ],
  focusScore: [
    { day: 'Mon', score: 65 }, { day: 'Tue', score: 60 },
    { day: 'Wed', score: 75 }, { day: 'Thu', score: 70 },
    { day: 'Fri', score: 72 }, { day: 'Sat', score: 85 },
    { day: 'Sun', score: 85 },
  ],
  topSenders: [
    { name: 'Sarah Chen', emails: 24, score: 85 },
    { name: 'Marketing Team', emails: 42, score: 72 },
    { name: 'Slack Notifications', emails: 85, score: 68 },
    { name: 'Marcus Johnson', emails: 15, score: 62 },
    { name: 'HR Team', emails: 10, score: 45 },
    { name: 'LinkedIn', emails: 33, score: 28 },
  ]
};