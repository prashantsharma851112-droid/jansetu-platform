import React, { useState, useEffect } from 'react';
import { PlusCircle, Map, List, ThumbsUp, CheckCircle, Clock, Filter, Search } from 'lucide-react';
import ComplaintCard from '../components/complaint/ComplaintCard';
import ComplaintWizard from '../components/complaint/ComplaintWizard';
import DetailModal from '../components/common/DetailModal';
import FeedbackModal from '../components/citizen/FeedbackModal';
import InteractiveMap from '../components/map/InteractiveMap';
import API from '../services/api';

export default function CitizenDashboard() {
  const [tab, setTab] = useState('MY'); // 'MY' | 'NEARBY' | 'MAP'
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [feedbackComplaintId, setFeedbackComplaintId] = useState(null);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const isMine = tab === 'MY' ? 'true' : 'false';
      const res = await API.get(`/complaints?isMine=${isMine}`);
      if (res.data.success) {
        setComplaints(res.data.complaints);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [tab]);

  const handleUpvote = async (id) => {
    try {
      const res = await API.post(`/complaints/${id}/upvote`);
      if (res.data.success) {
        fetchComplaints();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-emerald-950 text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-slate-800 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">Citizen Resolution Portal</h1>
            <p className="text-xs text-teal-300/80 mt-1">
              Report civic issues in your locality and track real-time resolution progress.
            </p>
          </div>
          <button
            onClick={() => setShowWizard(true)}
            className="bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-black text-xs px-5 py-3 rounded-2xl shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" /> Raise New Complaint
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTab('MY')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                tab === 'MY'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              My Complaints ({tab === 'MY' ? complaints.length : 0})
            </button>
            <button
              onClick={() => setTab('NEARBY')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                tab === 'NEARBY'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Nearby Public Issues & Upvotes
            </button>
            <button
              onClick={() => setTab('MAP')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                tab === 'MAP'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Map className="w-3.5 h-3.5" /> Spatial Map View
            </button>
          </div>
        </div>

        {/* Content Views */}
        {tab === 'MAP' ? (
          <InteractiveMap complaints={complaints} onSelectComplaint={(c) => setSelectedComplaintId(c._id)} height="550px" />
        ) : loading ? (
          <div className="p-16 text-center text-slate-400 text-sm font-medium">Fetching complaints...</div>
        ) : complaints.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto my-8 space-y-4">
            <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No Complaints Found</h3>
            <p className="text-xs text-slate-500">
              {tab === 'MY' ? "You haven't submitted any complaints yet. Click below to raise your first issue!" : 'No public complaints reported nearby.'}
            </p>
            {tab === 'MY' && (
              <button
                onClick={() => setShowWizard(true)}
                className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition"
              >
                Raise Issue Now
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {complaints.map((c) => (
              <div key={c._id} className="relative group">
                <ComplaintCard
                  complaint={c}
                  onClick={() => setSelectedComplaintId(c._id)}
                  onUpvote={handleUpvote}
                  showUpvote={tab === 'NEARBY'}
                />

                {/* Rating Button if resolved & belongs to user */}
                {c.status === 'RESOLVED' && tab === 'MY' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFeedbackComplaintId(c._id);
                    }}
                    className="absolute top-3 right-3 z-20 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[10px] px-2.5 py-1 rounded-full shadow-md transition"
                  >
                    Rate Resolution
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal 1: Multi-Step Complaint Wizard */}
      {showWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full my-auto">
            <ComplaintWizard
              onFinished={() => {
                setShowWizard(false);
                fetchComplaints();
              }}
            />
          </div>
        </div>
      )}

      {/* Modal 2: Detail Timeline View */}
      {selectedComplaintId && (
        <DetailModal
          complaintId={selectedComplaintId}
          onClose={() => setSelectedComplaintId(null)}
          onUpvoted={fetchComplaints}
        />
      )}

      {/* Modal 3: Feedback Star Rating */}
      {feedbackComplaintId && (
        <FeedbackModal
          complaintId={feedbackComplaintId}
          onClose={() => setFeedbackComplaintId(null)}
          onSuccess={fetchComplaints}
        />
      )}
    </div>
  );
}
