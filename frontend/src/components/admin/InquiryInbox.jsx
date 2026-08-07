import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2, Trash2, Clock, User, MessageSquare, RefreshCw, Send, ShieldCheck, CornerDownRight } from 'lucide-react';
import API from '../../services/api';

export default function InquiryInbox() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

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

  const handleSendReply = async (id) => {
    if (!replyText || !replyText.trim()) {
      alert('Please type a reply message before sending.');
      return;
    }

    try {
      setSubmittingReply(true);
      const res = await API.post(`/admin/inquiries/${id}/reply`, { replyMessage: replyText });
      if (res.data.success) {
        setInquiries((prev) =>
          prev.map((item) => (item._id === id ? res.data.inquiry : item))
        );
        setActiveReplyId(null);
        setReplyText('');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send reply');
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleTestEmail = async () => {
    try {
      const res = await API.post('/admin/test-email');
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send test email');
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

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleTestEmail}
            className="bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 text-xs font-bold px-3.5 py-2 rounded-xl border border-indigo-800 flex items-center gap-1.5 transition"
          >
            <Mail className="w-3.5 h-3.5" /> Test SMTP Email
          </button>
          <button
            onClick={fetchInquiries}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-700 flex items-center gap-1.5 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Inbox
          </button>
        </div>
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
              className={`p-5 rounded-2xl border transition-all space-y-3 ${
                item.status === 'NEW'
                  ? 'bg-slate-950 border-teal-500/40 shadow-lg shadow-teal-500/5'
                  : 'bg-slate-950/50 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
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

              {/* Citizen Message */}
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[9px] uppercase font-bold text-slate-500 block">Citizen Message</span>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {item.message}
                </p>
              </div>

              {/* Existing Official Reply (if any) */}
              {item.adminReply && (
                <div className="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-800/60 space-y-1 ml-4 border-l-4 border-l-indigo-500">
                  <div className="flex items-center justify-between text-[10px] font-bold text-indigo-400">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Official Municipal Reply
                    </span>
                    {item.repliedAt && (
                      <span className="text-slate-500 font-normal">
                        {new Date(item.repliedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-indigo-200 leading-relaxed whitespace-pre-wrap">
                    {item.adminReply}
                  </p>
                </div>
              )}

              {/* Inline Reply Form */}
              {activeReplyId === item._id && (
                <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-4 space-y-3 shadow-xl">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400">
                    <CornerDownRight className="w-4 h-4" /> Send Official Response to {item.email}
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Type official municipal response here..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full text-xs p-3 bg-slate-950 border border-slate-800 text-white rounded-xl outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveReplyId(null);
                        setReplyText('');
                      }}
                      className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={submittingReply}
                      onClick={() => handleSendReply(item._id)}
                      className="text-xs font-bold px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center gap-1.5 shadow"
                    >
                      {submittingReply ? 'Sending...' : 'Send Reply'} <Send className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-900">
                <button
                  onClick={() => {
                    setActiveReplyId(activeReplyId === item._id ? null : item._id);
                    setReplyText(item.adminReply || '');
                  }}
                  className="text-[11px] font-bold text-indigo-400 hover:bg-indigo-950/60 border border-indigo-800/80 px-3 py-1.5 rounded-xl flex items-center gap-1 transition"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> {item.adminReply ? 'Edit Reply' : 'Reply'}
                </button>

                {item.status !== 'RESOLVED' && (
                  <button
                    onClick={() => handleUpdateStatus(item._id, 'RESOLVED')}
                    className="text-[11px] font-bold text-emerald-400 hover:bg-emerald-950/60 border border-emerald-800/80 px-3 py-1.5 rounded-xl flex items-center gap-1 transition"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Mark Resolved
                  </button>
                )}

                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-[11px] font-bold text-rose-400 hover:bg-rose-950/60 border border-rose-800/80 px-3 py-1.5 rounded-xl flex items-center gap-1 transition"
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
