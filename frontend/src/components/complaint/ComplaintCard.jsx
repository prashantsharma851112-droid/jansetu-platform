import React from 'react';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { MapPin, ThumbsUp, Calendar, ArrowRight, ShieldAlert } from 'lucide-react';

export default function ComplaintCard({ complaint, onClick, onUpvote, showUpvote = true }) {
  const thumbnail =
    complaint.images && complaint.images.length > 0
      ? complaint.images[0].url
      : 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=400&q=80';

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-teal-300 transition-all duration-300 overflow-hidden flex flex-col justify-between group cursor-pointer"
    >
      <div>
        {/* Card Thumbnail & Status */}
        <div className="relative h-40 w-full bg-slate-100 overflow-hidden">
          <img
            src={thumbnail}
            alt={complaint.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            <StatusBadge status={complaint.status} />
            <PriorityBadge priority={complaint.priority} />
          </div>
          <span className="absolute bottom-3 right-3 text-[10px] font-mono font-bold bg-slate-900/80 text-white px-2 py-0.5 rounded backdrop-blur">
            {complaint.complaintCode}
          </span>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
            <span>{complaint.category?.name || 'Civic Care'}</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(complaint.createdAt).toLocaleDateString()}
            </span>
          </div>

          <h3 className="font-bold text-sm text-slate-900 group-hover:text-teal-700 transition line-clamp-1">
            {complaint.title}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {complaint.description}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-500 flex items-center gap-1 line-clamp-1 max-w-[65%]">
          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
          {complaint.address}
        </span>

        {showUpvote ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onUpvote) onUpvote(complaint._id);
            }}
            className="flex items-center gap-1 text-[11px] font-bold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-lg transition"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            {complaint.upvoteCount || 0}
          </button>
        ) : (
          <span className="text-[11px] font-bold text-teal-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
            View Details <ArrowRight className="w-3.5 h-3.5" />
          </span>
        )}
      </div>
    </div>
  );
}
