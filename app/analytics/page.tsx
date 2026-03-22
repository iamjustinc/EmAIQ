'use client';

import { AppShell } from '@/components/app-shell';
import { Header } from '@/components/header';
import { InsightCard } from '@/components/insight-card';
import { CircularGauge } from '@/components/circular-gauge';
import { analyticsData, aiInsights } from '@/lib/mock-data';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { 
  Brain, 
  Clock, 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Mail,
  AlertCircle,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card/95 p-3 shadow-lg backdrop-blur-sm">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm text-muted-foreground">
            {entry.name}: <span className="font-medium text-foreground">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const COLORS = ['#8B7CFF', '#3DD9A3', '#FFB84D', '#FF5D73', '#55C2FF', '#A6ADBB'];

function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  sublabel,
  iconColor = 'text-primary'
}: { 
  icon: any; 
  label: string; 
  value: string; 
  sublabel?: string;
  iconColor?: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card/60 p-4 backdrop-blur-sm">
      <div className={cn('rounded-lg bg-primary/10 p-2.5', iconColor.replace('text-', 'bg-').replace('primary', 'primary/10'))}>
        <Icon className={cn('h-5 w-5', iconColor)} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-xl font-bold text-foreground">{value}</p>
        {sublabel && <p className="text-xs text-muted-foreground">{sublabel}</p>}
      </div>
    </div>
  );
}

function SenderRow({ sender, index }: { sender: typeof analyticsData.topSenders[0]; index: number }) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <span className="w-5 text-xs font-medium text-muted-foreground">#{index + 1}</span>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
        <User className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{sender.name}</p>
        <p className="text-xs text-muted-foreground">{sender.count} emails</p>
      </div>
      <div className="flex items-center gap-2">
        {sender.urgentCount > 0 && (
          <span className="flex items-center gap-1 rounded-full bg-danger/10 px-2 py-0.5 text-xs font-medium text-danger">
            <AlertCircle className="h-3 w-3" />
            {sender.urgentCount}
          </span>
        )}
        <div className="flex flex-col items-end">
          <span className="text-sm font-semibold text-foreground">{sender.interruptionScore}</span>
          <span className="text-[10px] text-muted-foreground">score</span>
        </div>
      </div>
    </div>
  );
}

function TopicTag({ topic }: { topic: typeof analyticsData.topicTags[0] }) {
  const TrendIcon = topic.trend === 'up' ? TrendingUp : topic.trend === 'down' ? TrendingDown : Minus;
  const trendColor = topic.trend === 'up' ? 'text-success' : topic.trend === 'down' ? 'text-danger' : 'text-muted-foreground';
  
  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/60 px-3 py-1.5">
      <span className="text-sm text-foreground">{topic.topic}</span>
      <span className="text-xs font-medium text-muted-foreground">{topic.count}</span>
      <TrendIcon className={cn('h-3 w-3', trendColor)} />
    </div>
  );
}

export default function AnalyticsPage() {
  const { summaryStats, topSenders, topicTags, urgentByDay, hourlyLoad } = analyticsData;

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <Header title="Analytics" hideSearch />
        
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Summary Strip */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              icon={Brain}
              label="Focus Score"
              value={`${summaryStats.focusScore}%`}
              sublabel="This week"
              iconColor="text-primary"
            />
            <div className="flex items-center justify-center rounded-xl border border-border bg-card/60 p-4 backdrop-blur-sm">
              <CircularGauge
                value={summaryStats.actionableRate}
                size={100}
                strokeWidth={8}
                label="Actionable Rate"
                color="#3DD9A3"
              />
            </div>
            <StatCard
              icon={Clock}
              label="Avg Triage Time"
              value={`${summaryStats.avgTriageTime}min`}
              sublabel="Per email"
              iconColor="text-info"
            />
            <StatCard
              icon={Zap}
              label="Time Saved"
              value={`${summaryStats.timeSaved}min`}
              sublabel="This week"
              iconColor="text-success"
            />
          </div>

          {/* AI Insights with Glassmorphism */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {aiInsights.map((insight, index) => (
              <InsightCard
                key={index}
                title={insight.title}
                description={insight.description}
                type={insight.type}
              />
            ))}
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Urgent vs Non-Urgent Stacked Bar Chart */}
            <div className="rounded-2xl border border-border bg-card/80 p-5 backdrop-blur-sm">
              <h3 className="mb-4 font-semibold text-foreground">Urgent vs Non-Urgent by Day</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={urgentByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A3140" />
                  <XAxis dataKey="day" stroke="#A6ADBB" fontSize={12} />
                  <YAxis stroke="#A6ADBB" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    formatter={(value) => (
                      <span className="text-sm text-muted-foreground capitalize">{value}</span>
                    )}
                  />
                  <Bar dataKey="nonUrgent" name="Non-Urgent" stackId="a" fill="#3DD9A3" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="urgent" name="Urgent" stackId="a" fill="#FF5D73" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Hourly Load Area Chart */}
            <div className="rounded-2xl border border-border bg-card/80 p-5 backdrop-blur-sm">
              <h3 className="mb-4 font-semibold text-foreground">Inbox Load by Hour</h3>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={hourlyLoad}>
                  <defs>
                    <linearGradient id="colorEmails" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B7CFF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8B7CFF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A3140" />
                  <XAxis dataKey="hour" stroke="#A6ADBB" fontSize={11} interval={1} />
                  <YAxis stroke="#A6ADBB" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="emails"
                    name="Emails"
                    stroke="#8B7CFF"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorEmails)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sender & Topic Insights */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Sender Insights */}
            <div className="rounded-2xl border border-border bg-card/80 p-5 backdrop-blur-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Top Senders by Interruption</h3>
                <span className="text-xs text-muted-foreground">Ranked by load score</span>
              </div>
              <div className="divide-y divide-border">
                {topSenders.map((sender, index) => (
                  <SenderRow key={sender.email} sender={sender} index={index} />
                ))}
              </div>
            </div>

            {/* Topic Insights */}
            <div className="rounded-2xl border border-border bg-card/80 p-5 backdrop-blur-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Recurring Themes</h3>
                <span className="text-xs text-muted-foreground">This week</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {topicTags.map((topic, index) => (
                  <TopicTag key={index} topic={topic} />
                ))}
              </div>
              <div className="mt-4 flex items-center gap-4 border-t border-border pt-4">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 text-success" />
                  <span>Increasing</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Minus className="h-3 w-3" />
                  <span>Stable</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <TrendingDown className="h-3 w-3 text-danger" />
                  <span>Decreasing</span>
                </div>
              </div>
            </div>
          </div>

          {/* Original Charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Category Breakdown - Donut Chart */}
            <div className="rounded-2xl border border-border bg-card/80 p-5 backdrop-blur-sm">
              <h3 className="mb-4 font-semibold text-foreground">Email Category Breakdown</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={analyticsData.categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {analyticsData.categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    formatter={(value) => <span className="text-sm text-muted-foreground">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Focus Score Trend */}
            <div className="rounded-2xl border border-border bg-card/80 p-5 backdrop-blur-sm">
              <h3 className="mb-4 font-semibold text-foreground">Focus Score Trend</h3>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={analyticsData.focusScore}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3DD9A3" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3DD9A3" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A3140" />
                  <XAxis dataKey="day" stroke="#A6ADBB" fontSize={12} />
                  <YAxis stroke="#A6ADBB" fontSize={12} domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="score"
                    name="Score"
                    stroke="#3DD9A3"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorScore)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
