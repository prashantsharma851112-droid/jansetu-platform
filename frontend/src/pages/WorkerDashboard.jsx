import React, { useState, useEffect } from 'react';
import { Wrench, CheckCircle2, Clock, MapPin, UploadCloud, Layers, ArrowRight, Eye, Phone } from 'lucide-react';
import ProofOfWorkModal from '../components/worker/ProofOfWorkModal';
import DetailModal from '../components/common/DetailModal';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import API from '../services/api';

export default function WorkerDashboard() {
  const [tab, setTab] = useState('MY'); // 'MY' | 'POOL'
  const [tasks, setTasks] = useState([]);
  const [pool, setPool] = useState([]);
  const [stats, setStats] = useState({ totalAssigned: 0, totalResolved: 0, totalPending: 0 });
  const [loading, setLoading] = useState(true);

  const [activeUpdateTask, setActiveUpdateTask] = useState(null);
  const [selectedDetailId, setSelectedDetailId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (tab === 'MY') {
        const res = await API.get('/worker/my-tasks');
        if (res.data.success) {
          setTasks(res.data.tasks);
          setStats(res.data.stats);
        }
      } else {
        const res = await API.get('/worker/pool');
        if (res.data.success) {
          setPool(res.data.unassigned);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tab]);

  const handleClaim = async (id) => {
    try {
      const res = await API.post(`/worker/accept/${id}`);
      if (res.data.success) {
        setTab('MY');
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error claiming ticket');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-16 selection:bg-amber-500 selection:text-slate-950">
      {/* Worker Banner */}
      <div className="bg-slate-950 border-b border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 block">Field Worker App</span>
            <h1 className="text-2xl sm:text-3xl font-black">Department Operations Portal</h1>
          </div>

          {/* Performance Counter Header */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">My Assigned</span>
              <span className="text-lg font-black text-amber-400">{stats.totalAssigned}</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Resolved</span>
              <span className="text-lg font-black text-emerald-400">{stats.totalResolved}</span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <button
            onClick={() => setTab('MY')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              tab === 'MY' ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            My Assigned Tasks ({stats.totalPending} Pending)
          </button>
          <button
            onClick={() => setTab('POOL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              tab === 'POOL' ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Available Unassigned Pool ({pool.length})
          </button>
        </div>

        {/* Task Cards Grid */}
        {loading ? (
          <div className="p-16 text-center text-slate-500 text-sm">Loading field tasks...</div>
        ) : (tab === 'MY' ? tasks : pool).length === 0 ? (
          <div className="bg-slate-950 rounded-3xl p-12 text-center border border-slate-800 max-w-lg mx-auto my-8 space-y-2">
            <Wrench className="w-8 h-8 text-amber-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No Active Tasks Found</h3>
            <p className="text-xs text-slate-400">
              {tab === 'MY' ? 'You currently have no pending tasks assigned.' : 'No unassigned tickets available in your department pool.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(tab === 'MY' ? tasks : pool).map((t) => (
              <div key={t._id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-amber-400">{t.complaintCode}</span>
                    <div className="flex gap-1">
                      <StatusBadge status={t.status} />
                      <PriorityBadge priority={t.priority} />
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-white line-clamp-1">{t.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{t.description}</p>

                  <div className="mt-3 text-[11px] text-slate-400 space-y-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" /> {t.address}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-slate-300">
                      Citizen: {t.user?.name} ({t.user?.phone || 'No Phone'})
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedDetailId(t._id)}
                    className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <Eye className="w-3.5 h-3.5" /> Details
                  </button>

                  {tab === 'MY' ? (
                    <button
                      onClick={() => setActiveUpdateTask(t)}
                      className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-2 px-3 rounded-xl shadow transition flex items-center justify-center gap-1"
                    >
                      Update Stage / Proof <UploadCloud className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleClaim(t._id)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-3 rounded-xl shadow transition flex items-center justify-center gap-1"
                    >
                      Claim Ticket <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal 1: Proof of Work Action Drawer */}
      {activeUpdateTask && (
        <ProofOfWorkModal
          complaint={activeUpdateTask}
          onClose={() => setActiveUpdateTask(null)}
          onSuccess={fetchData}
        />
      )}

      {/* Modal 2: Detail Modal */}
      {selectedDetailId && (
        <DetailModal
          complaintId={selectedDetailId}
          onClose={() => setSelectedDetailId(null)}
        />
      )}
    </div>
  );
}
