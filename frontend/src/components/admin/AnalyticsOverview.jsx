import React from 'react';
import {
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, AreaChart, Area
} from 'recharts';
import { ShieldCheck, Clock, AlertOctagon, CheckCircle2, TrendingUp, Layers } from 'lucide-react';

export default function AnalyticsOverview({ analytics }) {
  if (!analytics) return null;

  const {
    totalComplaints,
    resolvedComplaints,
    pendingComplaints,
    criticalComplaints,
    overdueCount,
    resolutionRate,
    avgResolutionHours,
    categoryStats = [],
    areaStats = [],
  } = analytics;

  const pieColors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#ec4899', '#6366f1'];

  return (
    <div className="space-y-6">
      {/* Executive KPI Counter Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase block">Total Reported</span>
          <h3 className="text-3xl font-black text-white mt-1">{totalComplaints}</h3>
          <span className="text-xs text-slate-400 mt-2 block font-medium">All municipal wards</span>
          <Layers className="absolute right-4 bottom-4 w-8 h-8 text-slate-800" />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase block">Resolved Rate</span>
          <h3 className="text-3xl font-black text-emerald-400 mt-1">{resolutionRate}%</h3>
          <span className="text-xs text-slate-400 mt-2 block font-medium">{resolvedComplaints} tickets closed</span>
          <CheckCircle2 className="absolute right-4 bottom-4 w-8 h-8 text-emerald-950" />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase block">Avg Closure Time</span>
          <h3 className="text-3xl font-black text-amber-400 mt-1">{avgResolutionHours} hrs</h3>
          <span className="text-xs text-slate-400 mt-2 block font-medium">Target SLA: 48h</span>
          <Clock className="absolute right-4 bottom-4 w-8 h-8 text-amber-950" />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <span className="text-[10px] font-bold tracking-widest text-rose-400 uppercase block">SLA Overdue Alerts</span>
          <h3 className="text-3xl font-black text-rose-400 mt-1">{overdueCount}</h3>
          <span className="text-xs text-rose-300/70 mt-2 block font-medium">{criticalComplaints} critical priority</span>
          <AlertOctagon className="absolute right-4 bottom-4 w-8 h-8 text-rose-950" />
        </div>
      </div>

      {/* Recharts Graphical Visualizations */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Category Breakdown Pie Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <h4 className="text-sm font-bold text-slate-200 mb-4 flex items-center justify-between">
            <span>Category Wise Distribution</span>
            <span className="text-xs text-slate-500 font-normal">Real-time breakdown</span>
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryStats}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={50}
                  paddingAngle={4}
                >
                  {categoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Area / Ward Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <h4 className="text-sm font-bold text-slate-200 mb-4 flex items-center justify-between">
            <span>Ward-Wise Issue Volume</span>
            <span className="text-xs text-slate-500 font-normal">Complaints vs Resolved</span>
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={areaStats.slice(0, 6)}>
                <XAxis dataKey="_id" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                />
                <Bar dataKey="count" name="Total Complaints" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" name="Resolved" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
