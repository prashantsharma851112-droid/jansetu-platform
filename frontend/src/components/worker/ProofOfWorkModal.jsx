import React, { useState } from 'react';
import { X, UploadCloud, CheckCircle2, Wrench, AlertTriangle, Loader2 } from 'lucide-react';
import API from '../../services/api';

export default function ProofOfWorkModal({ complaint, onClose, onSuccess }) {
  const [targetStage, setTargetStage] = useState('IN_PROGRESS');
  const [note, setNote] = useState('');
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selected]);
    const newPreviews = selected.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    if (targetStage === 'RESOLVED' && files.length === 0) {
      alert('⚠️ Mandatory Proof of Work: You must upload at least 1 AFTER photo to mark a complaint as RESOLVED.');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('stage', targetStage);
      formData.append('note', note);

      files.forEach((file) => {
        formData.append('images', file);
      });

      const res = await API.put(`/worker/update-stage/${complaint._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating task stage');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-5 border border-slate-100">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="font-mono text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
              {complaint.complaintCode}
            </span>
            <h3 className="font-bold text-base text-slate-900 mt-1">{complaint.title}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stage Selection */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-2">Select Action Stage</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'IN_PROGRESS', label: 'In Progress', color: 'bg-amber-600' },
              { id: 'UNDER_REVIEW', label: 'Under Review', color: 'bg-purple-600' },
              { id: 'RESOLVED', label: 'Mark Resolved', color: 'bg-emerald-600' },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setTargetStage(st.id)}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                  targetStage === st.id
                    ? `${st.color} text-white border-transparent shadow-md scale-[1.02]`
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stage Remarks */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Field Work Remarks / Notes</label>
          <textarea
            rows={3}
            placeholder="e.g. Replaced 50m pipeline, asphalt laid and cleared debris..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>

        {/* Upload Proof Photo */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Proof of Work Photo {targetStage === 'RESOLVED' && <span className="text-rose-500 font-bold">(Mandatory)</span>}
          </label>
          <label className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-xl p-4 text-center flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-amber-50/40 transition">
            <UploadCloud className="w-6 h-6 text-amber-600 mb-1" />
            <span className="text-xs font-semibold text-slate-700">Click to upload ground photo</span>
            <input type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
          </label>

          {previews.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mt-3">
              {previews.map((url, i) => (
                <div key={i} className="relative h-16 rounded-lg overflow-hidden border border-slate-200">
                  <img src={url} alt="Proof" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-0.5 text-[10px]"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Stage Update'}
        </button>
      </div>
    </div>
  );
}
