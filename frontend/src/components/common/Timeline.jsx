import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Wrench, ShieldAlert, Star, UserCheck, Image as ImageIcon } from 'lucide-react';

import { formatImageUrl, handleImageError } from '../../utils/imageUrl';

const stageSteps = [
  { key: 'SUBMITTED', title: 'Submitted', icon: Clock, color: 'text-slate-500 bg-slate-100 border-slate-300' },
  { key: 'ASSIGNED', title: 'Assigned to Worker', icon: UserCheck, color: 'text-blue-600 bg-blue-50 border-blue-300' },
  { key: 'IN_PROGRESS', title: 'In Progress', icon: Wrench, color: 'text-amber-600 bg-amber-50 border-amber-300' },
  { key: 'UNDER_REVIEW', title: 'Under Review / Inspection', icon: ShieldAlert, color: 'text-purple-600 bg-purple-50 border-purple-300' },
  { key: 'RESOLVED', title: 'Issue Resolved', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-400' },
];

export default function Timeline({ timeline = [], images = [], currentStatus, feedback }) {
  const getStageIndex = (status) => {
    const idx = stageSteps.findIndex((s) => s.key === status);
    return idx !== -1 ? idx : 0;
  };

  const activeIndex = getStageIndex(currentStatus);

  return (
    <div className="relative py-4 pl-6 space-y-8 before:absolute before:left-3 before:top-6 before:bottom-6 before:w-0.5 before:bg-slate-200">
      {stageSteps.map((step, idx) => {
        const isPassed = idx <= activeIndex;
        const isCurrent = idx === activeIndex;
        const IconComponent = step.icon;
        const entry = timeline.find((t) => t.stage === step.key);

        // Find stage images
        const stageImages = images.filter((img) => {
          if (step.key === 'SUBMITTED') return img.stage === 'BEFORE';
          if (step.key === 'IN_PROGRESS' || step.key === 'UNDER_REVIEW') return img.stage === 'PROGRESS';
          if (step.key === 'RESOLVED') return img.stage === 'AFTER';
          return false;
        });

        return (
          <motion.div
            key={step.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
            className="relative flex items-start group"
          >
            {/* Timeline node icon */}
            <div
              className={`absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                isCurrent
                  ? `${step.color} ring-4 ring-teal-100 scale-110 shadow`
                  : isPassed
                  ? 'bg-teal-600 border-teal-600 text-white'
                  : 'bg-white border-slate-300 text-slate-300'
              }`}
            >
              <IconComponent className="w-3.5 h-3.5" />
            </div>

            {/* Stage Content Card */}
            <div className={`ml-4 w-full p-4 rounded-xl border transition-all ${
              isCurrent ? 'bg-white border-teal-200 shadow-md ring-1 ring-teal-400/30' : isPassed ? 'bg-slate-50 border-slate-200' : 'bg-slate-50/50 border-slate-100 opacity-60'
            }`}>
              <div className="flex items-center justify-between gap-2">
                <h4 className={`font-bold text-sm ${isPassed ? 'text-slate-900' : 'text-slate-400'}`}>
                  {step.title}
                </h4>
                {entry && (
                  <span className="text-[11px] font-medium text-slate-400">
                    {new Date(entry.createdAt).toLocaleDateString()} at {new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>

              {entry?.note && (
                <p className="mt-1 text-xs text-slate-600 font-medium">
                  {entry.note}
                </p>
              )}

              {/* Photos associated with stage */}
              {stageImages.length > 0 && (
                <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
                  {stageImages.map((img, i) => (
                    <a
                      key={i}
                      href={formatImageUrl(img.url)}
                      target="_blank"
                      rel="noreferrer"
                      className="group/img relative block w-16 h-16 rounded-lg overflow-hidden border border-slate-200 shrink-0 shadow-sm hover:ring-2 hover:ring-teal-500 bg-slate-100"
                    >
                      <img
                        src={formatImageUrl(img.url)}
                        onError={handleImageError}
                        alt={`Stage ${step.key}`}
                        className="w-full h-full object-cover group-hover/img:scale-105 transition-transform"
                      />
                      <span className="absolute bottom-0 inset-x-0 bg-slate-900/70 text-[9px] text-white text-center py-0.5 uppercase font-bold">
                        {img.stage}
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        );
      })}

      {/* Citizen Feedback Stage if resolved */}
      {feedback && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative flex items-start ml-4 p-4 rounded-xl border border-amber-200 bg-amber-50/60 shadow-sm"
        >
          <div className="w-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                Citizen Resolution Rating
              </span>
              <span className="text-[11px] text-amber-700 font-semibold">{feedback.rating}/5 Stars</span>
            </div>
            {feedback.comment && (
              <p className="mt-1 text-xs text-amber-800 italic">"{feedback.comment}"</p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
