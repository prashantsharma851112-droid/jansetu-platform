import React, { useState, useEffect } from 'react';
import { X, MapPin, ThumbsUp, Calendar, User, ShieldAlert, Star } from 'lucide-react';
import Timeline from './Timeline';
import { StatusBadge, PriorityBadge } from './Badge';
import API from '../../services/api';
import { formatImageUrl, handleImageError } from '../../utils/imageUrl';

export default function DetailModal({ complaintId, onClose, onUpvoted }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/complaints/${complaintId}`);
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (complaintId) fetchDetail();
  }, [complaintId]);

  const handleUpvote = async () => {
    try {
      const res = await API.post(`/complaints/${complaintId}/upvote`);
      if (res.data.success) {
        fetchDetail();
        if (onUpvoted) onUpvoted();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!complaintId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-100">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-teal-100 text-teal-800">
              {data?.complaint?.complaintCode || 'JS-2026'}
            </span>
            {data?.complaint?.status && <StatusBadge status={data.complaint.status} />}
            {data?.complaint?.priority && <PriorityBadge priority={data.complaint.priority} />}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {loading ? (
            <div className="p-12 text-center text-slate-400 font-medium">Loading complaint details...</div>
          ) : data?.complaint ? (
            <>
              {/* Title & Meta */}
              <div>
                <h2 className="text-xl font-black text-slate-900">{data.complaint.title}</h2>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {data.complaint.address}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(data.complaint.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1 font-medium text-slate-700">
                    Category: {data.complaint.category?.name || 'General'}
                  </span>
                </div>
              </div>

              {/* Description Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-sm text-slate-700">
                <p>{data.complaint.description}</p>
              </div>

              {/* Images Gallery */}
              {data.complaint.images?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Submitted Evidence & Proof of Work
                  </h4>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {data.complaint.images.map((img, i) => (
                      <a
                        key={i}
                        href={formatImageUrl(img.url)}
                        target="_blank"
                        rel="noreferrer"
                        className="group relative h-24 rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:ring-2 hover:ring-teal-500 transition bg-slate-100"
                      >
                        <img
                          src={formatImageUrl(img.url)}
                          onError={handleImageError}
                          alt="Proof"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-white text-[9px] font-bold text-center py-0.5 uppercase">
                          {img.stage} Photo
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Assigned Worker Info */}
              {data.complaint.assignedWorker && (
                <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={formatImageUrl(data.complaint.assignedWorker.avatar)}
                      onError={handleImageError}
                      alt="Worker"
                      className="w-10 h-10 rounded-full border border-blue-200 object-cover"
                    />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-blue-600 block">Assigned Field Officer</span>
                      <h4 className="text-sm font-bold text-slate-900">{data.complaint.assignedWorker.name}</h4>
                      <p className="text-xs text-slate-500">{data.complaint.assignedWorker.department}</p>
                    </div>
                  </div>
                  <a
                    href={`tel:${data.complaint.assignedWorker.phone}`}
                    className="text-xs font-semibold text-blue-700 bg-white border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition"
                  >
                    Call Worker
                  </a>
                </div>
              )}

              {/* Courier-Style Live Timeline */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Resolution Progress & Live Updates
                </h4>
                <Timeline
                  timeline={data.complaint.timeline}
                  images={data.complaint.images}
                  currentStatus={data.complaint.status}
                  feedback={data.feedback}
                />
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-rose-500">Failed to load complaint data.</div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={handleUpvote}
            className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100 transition border border-teal-200"
          >
            <ThumbsUp className="w-4 h-4 text-teal-600" />
            Support Issue ({data?.complaint?.upvoteCount || 0} Upvotes)
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
