import React, { useState, useEffect } from 'react';
import { LayoutDashboard, MapPin, Table, Tag, Users, Shield, RefreshCw } from 'lucide-react';
import AnalyticsOverview from '../components/admin/AnalyticsOverview';
import HeatmapView from '../components/map/HeatmapView';
import ComplaintTable from '../components/admin/ComplaintTable';
import CategoryManager from '../components/admin/CategoryManager';
import WorkerManager from '../components/admin/WorkerManager';
import DetailModal from '../components/common/DetailModal';
import API from '../services/api';

export default function AdminDashboard() {
  const [tab, setTab] = useState('ANALYTICS'); // 'ANALYTICS' | 'MAP' | 'TABLE' | 'CATEGORIES' | 'WORKERS'
  const [analytics, setAnalytics] = useState(null);
  const [heatmapPoints, setHeatmapPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDetailId, setSelectedDetailId] = useState(null);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [aRes, hRes] = await Promise.all([
        API.get('/admin/analytics'),
        API.get('/admin/heatmap'),
      ]);
      if (aRes.data.success) setAnalytics(aRes.data.analytics);
      if (hRes.data.success) setHeatmapPoints(hRes.data.points);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16 selection:bg-indigo-500 selection:text-white">
      {/* Header Banner */}
      <div className="bg-slate-900 border-b border-slate-800 py-6 px-4 sm:px-6 lg:px-8 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 block">Executive Command Center</span>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Municipal Oversight & Governance</h1>
          </div>

          <button
            onClick={fetchAdminData}
            className="self-start md:self-auto bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-700 flex items-center gap-1.5 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
          {[
            { id: 'ANALYTICS', label: 'Executive Analytics', icon: LayoutDashboard },
            { id: 'MAP', label: 'Spatial Heatmap', icon: MapPin },
            { id: 'TABLE', label: 'Complaints Register', icon: Table },
            { id: 'CATEGORIES', label: 'Category Editor', icon: Tag },
            { id: 'WORKERS', label: 'Field Staff Accounts', icon: Users },
          ].map((t) => {
            const IconComp = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  tab === t.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                }`}
              >
                <IconComp className="w-3.5 h-3.5" /> {t.label}
              </button>
            );
          })}
        </div>

        {/* Tab Views */}
        {tab === 'ANALYTICS' && <AnalyticsOverview analytics={analytics} />}
        {tab === 'MAP' && <HeatmapView points={heatmapPoints} height="580px" />}
        {tab === 'TABLE' && <ComplaintTable onSelectComplaint={(c) => setSelectedDetailId(c._id)} />}
        {tab === 'CATEGORIES' && <CategoryManager />}
        {tab === 'WORKERS' && <WorkerManager onSelectComplaint={(cId) => setSelectedDetailId(cId)} />}
      </main>

      {/* Detail Modal */}
      {selectedDetailId && (
        <DetailModal
          complaintId={selectedDetailId}
          onClose={() => setSelectedDetailId(null)}
          onUpvoted={fetchAdminData}
        />
      )}
    </div>
  );
}
