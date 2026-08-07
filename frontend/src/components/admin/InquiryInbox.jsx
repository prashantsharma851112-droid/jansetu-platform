import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2, Trash2, Clock, User, MessageSquare, RefreshCw } from 'lucide-react';
import API from '../../services/api';

export default function InquiryInbox() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/inquiries');
      if (res.data.success) {
        setInquiries(res.data.inquiries);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await API.patch(`/admin/inquiries/${id}`, { status });
      if (res.data.success) {
        setInquiries((prev) =>
          prev.map((item) => (item._id === id ? { ...item, status } : item))
        );
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this inquiry permanently?')) return;
    try {
      const res = await API.delete(`/admin/inquiries/${id}`);
      if (res.data.success) {
        setInquiries((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      alert('Failed to delete inquiry');
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-teal-400">Citizen Inquiries & Feedback</span>
          <h2 className="text-xl font-black text-white">Public Support Inbox</h2>
          <p className="text-xs text-slate-400">Messages & suggestions submitted via JanSetu Landing Page contact form</p>
        </div>

        <button
          onClick={fetchInquiries}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-700 flex items-center gap-1.5 transition self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Inbox
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading public inquiries...</div>
      ) : inquiries.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-500 bg-slate-950/60 rounded-2xl border border-slate-800">
          No public inquiries or feedback messages received yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {inquiries.map((item) => (
            <div
              key={item._id}
              className={`p-5 rounded-2xl border transition-all ${
                item.status === 'NEW'
                  ? 'bg-slate-950 border-teal-500/40 shadow-lg shadow-teal-500/5'
                  : 'bg-slate-950/50 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.name}</h4>
                    <a href={`mailto:${item.email}`} className="text-xs text-teal-400 hover:underline">
                      {item.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-full border ${
                      item.status === 'NEW'
                        ? 'bg-teal-950 text-teal-300 border-teal-800'
                        : item.status === 'RESOLVED'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {item.status}
                  </span>

                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 bg-slate-900 p-3.5 rounded-xl border border-slate-800 leading-relaxed whitespace-pre-wrap">
                {item.message}
              </p>

              <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-slate-900">
                {item.status !== 'RESOLVED' && (
                  <button
                    onClick={() => handleUpdateStatus(item._id, 'RESOLVED')}
                    className="text-[11px] font-bold text-emerald-400 hover:bg-emerald-950/60 border border-emerald-800/80 px-3 py-1 rounded-xl flex items-center gap-1 transition"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Mark Resolved
                  </button>
                )}
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-[11px] font-bold text-rose-400 hover:bg-rose-950/60 border border-rose-800/80 px-3 py-1 rounded-xl flex items-center gap-1 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
