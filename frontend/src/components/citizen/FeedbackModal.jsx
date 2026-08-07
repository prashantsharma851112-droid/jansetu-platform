import React, { useState } from 'react';
import { Star, X, CheckCircle } from 'lucide-react';
import API from '../../services/api';

export default function FeedbackModal({ complaintId, onClose, onSuccess }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const res = await API.post(`/complaints/${complaintId}/feedback`, { rating, comment });
      if (res.data.success) {
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-100">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
            Rate Issue Resolution
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500">How satisfied are you with the municipal repair work executed by our team?</p>

        {/* Star Rating Picker */}
        <div className="flex items-center justify-center gap-2 py-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="p-1.5 transition hover:scale-110"
            >
              <Star
                className={`w-8 h-8 ${
                  star <= rating ? 'text-amber-500 fill-amber-400' : 'text-slate-200 fill-slate-100'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Comment Box */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Additional Remarks / Praise</label>
          <textarea
            rows={3}
            placeholder="Share feedback on resolution speed, cleanliness, etc..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
        >
          {submitting ? 'Submitting...' : 'Submit Resolution Feedback'}
        </button>
      </div>
    </div>
  );
}
