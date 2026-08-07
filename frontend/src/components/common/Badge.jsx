import React from 'react';

const statusConfig = {
  SUBMITTED: { label: 'Submitted', bg: 'bg-slate-100 text-slate-700 border-slate-300' },
  ASSIGNED: { label: 'Assigned', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
  IN_PROGRESS: { label: 'In Progress', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
  UNDER_REVIEW: { label: 'Under Review', bg: 'bg-purple-50 text-purple-700 border-purple-200' },
  RESOLVED: { label: 'Resolved', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  REJECTED: { label: 'Rejected', bg: 'bg-rose-50 text-rose-700 border-rose-200' },
};

const priorityConfig = {
  LOW: { label: 'Low Urgency', bg: 'bg-slate-100 text-slate-600' },
  MEDIUM: { label: 'Medium', bg: 'bg-blue-100 text-blue-700' },
  HIGH: { label: 'High Urgency', bg: 'bg-amber-100 text-amber-800 font-semibold' },
  CRITICAL: { label: 'Critical Escalation', bg: 'bg-rose-600 text-white font-bold animate-pulse' },
};

export function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.SUBMITTED;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg}`}>
      {config.label}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const config = priorityConfig[priority] || priorityConfig.MEDIUM;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] ${config.bg}`}>
      {config.label}
    </span>
  );
}
