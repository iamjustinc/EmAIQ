'use client';

import { AppShell } from '@/components/app-shell';
import { Header } from '@/components/header';
import { CircularGauge } from '@/components/circular-gauge';
import { analyticsData } from '@/lib/mock-data';
import {
  PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Brain, Clock, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const COLORS = {
  teal: '#7FC6DA',
  pink: '#F6B3C4',
  dark: '#2D3436',
  gray: '#A8A29A',
  bg: '#F4F7F7',
  softTeal: '#A8D0D0'
};

const CHART_FILLS = [COLORS.teal, COLORS.pink, COLORS.dark, COLORS.softTeal, COLORS.gray];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-2xl border-2 border-[#A8D0D0]/30 bg-white p-3 shadow-xl">
        <p className="text-[10px] font-black uppercase tracking-widest text-[#8C867E] mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm font-bold text-[#2D3436]">
            {entry.name}: <span style={{ color: entry.fill || entry.stroke }}>{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function StatCard({ icon: Icon, label, value, sublabel, iconColor = 'text-[#7FC6DA]' }: any) {
  return (
    <div className="flex items-center gap-4 rounded-[2rem] border-2 border-[#A8D0D0]/20 bg-white p-6 shadow-sm">
      <div className={cn('rounded-2xl p-3', iconColor.replace('text-', 'bg-').replace('[', '[').replace(']', ']/10'))}>
        <Icon className={cn('h-6 w-6', iconColor)} />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-[#8C867E]">{label}</p>
        <p className="text-2xl font-black text-[#2D3436]">{value}</p>
        {sublabel && <p className="text-[10px] font-bold text-[#7FC6DA]">{sublabel}</p>}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const { summaryStats, urgentByDay, hourlyLoad, categoryBreakdown, focusScore } = analyticsData;

  return (
    <AppShell>
      <div className="flex h-full flex-col bg-[#F4F7F7]">
        <Header title="Analytics" hideSearch />
        <div className="flex-1 overflow-auto p-8 space-y-8">
          
          {/* Summary Strip */}
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            <StatCard icon={Brain} label="Focus Score" value={`${summaryStats.focusScore}%`} sublabel="Actionable" iconColor="text-[#2D3436]" />
            <div className="flex items-center justify-center rounded-[2rem] border-2 border-[#A8D0D0]/20 bg-white p-4 shadow-sm">
              <CircularGauge value={summaryStats.actionableRate} size={90} strokeWidth={10} label="Rate" color={COLORS.teal} />
            </div>
            <StatCard icon={Clock} label="Avg Triage" value={`${summaryStats.avgTriageTime}m`} sublabel="Per email" iconColor="text-[#7FC6DA]" />
            <StatCard icon={Zap} label="Time Saved" value={`${summaryStats.timeSaved}m`} sublabel="This week" iconColor="text-[#F6B3C4]" />
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Urgent Bar Chart */}
            <div className="rounded-[2.5rem] border-2 border-[#A8D0D0]/30 bg-white p-8 shadow-sm">
              <h3 className="mb-6 text-[11px] font-black uppercase tracking-[0.2em] text-[#2D3436]">Urgent vs Non-Urgent</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={urgentByDay}>
                  <CartesianGrid strokeDasharray="8 8" stroke="#F0F4F4" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#8C867E', fontWeight: 900, fontSize: 10}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#8C867E', fontSize: 10}} width={30} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                  <Bar dataKey="nonUrgent" name="Normal" stackId="a" fill={COLORS.dark} barSize={40} />
                  <Bar dataKey="urgent" name="Urgent" stackId="a" fill={COLORS.teal} radius={[10, 10, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Inbox Load Area Chart */}
            <div className="rounded-[2.5rem] border-2 border-[#A8D0D0]/30 bg-white p-8 shadow-sm">
              <h3 className="mb-6 text-[11px] font-black uppercase tracking-[0.2em] text-[#2D3436]">Inbox Load by Hour</h3>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={hourlyLoad}>
                  <defs>
                    <linearGradient id="loadGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.teal} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={COLORS.teal} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="8 8" stroke="#F0F4F4" vertical={false} />
                  <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{fill: '#8C867E', fontSize: 10}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#8C867E', fontSize: 10}} width={30} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="emails" stroke={COLORS.teal} strokeWidth={4} fill="url(#loadGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}