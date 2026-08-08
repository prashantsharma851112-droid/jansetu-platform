import React, { useState, useEffect } from 'react';
import { Download, Filter, Search, UserCheck, AlertOctagon, Eye, RefreshCw, Phone, Mail, MapPin, Wrench, Shield, X, ExternalLink, Activity, Clock, Loader2, UserPlus } from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { formatImageUrl, handleImageError } from '../../utils/imageUrl';
import API from '../../services/api';

export default function ComplaintTable({ onSelectComplaint }) {
  const [complaints, setComplaints] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [search, setSearch] = useState('');

  // Reassignment Modal State
  const [assignTarget, setAssignTarget] = useState(null);
  const [selectedWorkerId, setSelectedWorkerId] = useState('');

  // Worker Detail Modal State
  const [selectedWorkerDetails, setSelectedWorkerDetails] = useState(null);
  const [loadingWorkerTasks, setLoadingWorkerTasks] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (statusFilter) query.append('status', statusFilter);
      if (priorityFilter) query.append('priority', priorityFilter);
      if (search) query.append('search', search);

      const [cRes, wRes] = await Promise.all([
        API.get(`/complaints?${query.toString()}`),
        API.get('/admin/workers'),
      ]);

      if (cRes.data.success) setComplaints(cRes.data.complaints);
      if (wRes.data.success) setWorkers(wRes.data.workers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter, priorityFilter, search]);

  const handleOpenWorkerModal = async (worker) => {
    if (!worker || !worker._id) return;
    try {
      setLoadingWorkerTasks(true);
      setSelectedWorkerDetails({ worker, complaints: [] });
      const res = await API.get(`/admin/workers/${worker._id}/tasks`);
      if (res.data.success) {
        setSelectedWorkerDetails({
          worker: res.data.worker,
          complaints: res.data.complaints,
        });
      }
    } catch (err) {
      console.error(err);
      alert('Error fetching worker details');
    } finally {
      setLoadingWorkerTasks(false);
    }
  };

  const handleEscalate = async (complaintId) => {
    try {
      const res = await API.put(`/admin/escalate/${complaintId}`);
      if (res.data.success) {
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error escalating ticket');
    }
  };

  const handleAssignWorker = async () => {
    if (!assignTarget || !selectedWorkerId) return;
    try {
      const res = await API.post('/admin/assign', {
        complaintId: assignTarget._id,
        workerId: selectedWorkerId,
      });
      if (res.data.success) {
        setAssignTarget(null);
        setSelectedWorkerId('');
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error assigning worker');
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await API.get('/admin/export/csv', {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `jansetu-complaints-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to export CSV. Please try again.');
    }
  };

  const getProgressPercentage = (status) => {
    switch (status) {
      case 'SUBMITTED':
        return 15;
      case 'ASSIGNED':
        return 35;
      case 'IN_PROGRESS':
        return 65;
      case 'UNDER_REVIEW':
        return 85;
      case 'RESOLVED':
        return 100;
      default:
        return 20;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white">Master Complaint Register</h3>
          <p className="text-xs text-slate-400">View, assign field staff, escalate overdue tickets, or export report</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search code, title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-800 border border-slate-700 text-xs text-white rounded-xl focus:ring-1 focus:ring-indigo-500 outline-none w-44"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-1.5 px-3 bg-slate-800 border border-slate-700 text-xs text-slate-300 rounded-xl outline-none"
          >
            <option value="">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow transition"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <th className="p-3">Ticket Code</th>
              <th className="p-3">Issue & Category</th>
              <th className="p-3">Area Ward</th>
              <th className="p-3">Status</th>
              <th className="p-3">Priority</th>
              <th className="p-3">Field Worker</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-xs text-slate-300">
            {loading ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500">Loading complaints register...</td>
              </tr>
            ) : complaints.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500">No matching complaints found.</td>
              </tr>
            ) : (
              complaints.map((c) => (
                <tr key={c._id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-mono font-bold text-indigo-400">{c.complaintCode}</td>
                  <td className="p-3">
                    <span className="font-bold text-white block line-clamp-1">{c.title}</span>
                    <span className="text-[10px] text-slate-500">{c.category?.name}</span>
                  </td>
                  <td className="p-3 text-slate-400">{c.area}</td>
                  <td className="p-3"><StatusBadge status={c.status} /></td>
                  <td className="p-3"><PriorityBadge priority={c.priority} /></td>
                  <td className="p-3">
                    {c.assignedWorker ? (
                      <button
                        type="button"
                        onClick={() => handleOpenWorkerModal(c.assignedWorker)}
                        className="text-amber-400 font-bold hover:underline hover:text-amber-300 flex items-center gap-1.5 transition text-left"
                        title="Click to view worker details and active workload"
                      >
                        <img
                          src={c.assignedWorker.avatar || 'https://i.pravatar.cc/150'}
                          alt="Avatar"
                          className="w-5 h-5 rounded-full object-cover border border-amber-500/40"
                        />
                        {c.assignedWorker.name}
                      </button>
                    ) : (
                      <span className="text-rose-400/80 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onSelectComplaint(c)}
                        title="View Details"
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (c.assignedWorker) {
                            handleOpenWorkerModal(c.assignedWorker);
                          } else {
                            setAssignTarget(c);
                            setSelectedWorkerId('');
                          }
                        }}
                        title={c.assignedWorker ? `View ${c.assignedWorker.name}'s Details & Progress` : "Assign Field Worker"}
                        className="p-1.5 bg-blue-900/60 hover:bg-blue-800 text-blue-200 rounded-lg transition"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleEscalate(c._id)}
                        title="Toggle SLA Escalation"
                        className={`p-1.5 rounded-lg transition ${
                          c.overdueEscalated ? 'bg-rose-600 text-white' : 'bg-slate-800 hover:bg-rose-900/60 text-rose-400'
                        }`}
                      >
                        <AlertOctagon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Worker Details & Workload Progress Modal */}
      {selectedWorkerDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl relative space-y-5">
            <button
              onClick={() => setSelectedWorkerDetails(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Worker Info Header */}
            <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
              <img
                src={formatImageUrl(selectedWorkerDetails.worker.avatar)}
                onError={handleImageError}
                alt={selectedWorkerDetails.worker.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500/50 shadow-lg"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-white">{selectedWorkerDetails.worker.name}</h3>
                  <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-800">
                    {selectedWorkerDetails.worker.role || 'FIELD WORKER'}
                  </span>
                </div>
                <p className="text-xs text-amber-400 font-bold mt-0.5">{selectedWorkerDetails.worker.department}</p>
                <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-500" /> {selectedWorkerDetails.worker.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-500" /> {selectedWorkerDetails.worker.phone || 'N/A'}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" /> {selectedWorkerDetails.worker.area || 'Central Zone'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-bold bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300">
              <span>Assigned Complaints: <strong className="text-amber-400 text-sm ml-1">{selectedWorkerDetails.complaints.length}</strong></span>
              <span className="text-emerald-400">
                Resolved: {selectedWorkerDetails.complaints.filter((c) => c.status === 'RESOLVED').length} / {selectedWorkerDetails.complaints.length}
              </span>
            </div>

            {/* Workload Tasks List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {loadingWorkerTasks ? (
                <div className="py-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2 font-medium">
                  <Loader2 className="w-4 h-4 animate-spin text-teal-400" /> Fetching worker details & live progress...
                </div>
              ) : selectedWorkerDetails.complaints.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  No active civic complaints currently assigned to this field worker.
                </div>
              ) : (
                selectedWorkerDetails.complaints.map((c) => {
                  const progressPct = getProgressPercentage(c.status);
                  const lastTimeline = c.timeline && c.timeline.length > 0 ? c.timeline[c.timeline.length - 1] : null;

                  return (
                    <div
                      key={c._id}
                      className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800/90 hover:border-slate-700 transition space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-[10px] font-bold text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800/60">
                              {c.complaintCode}
                            </span>
                            <span
                              className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                              style={{ backgroundColor: c.category?.colorCode || '#3b82f6' }}
                            >
                              {c.category?.name || 'General'}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-white line-clamp-1">{c.title}</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">{c.address}</p>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedWorkerDetails(null);
                            onSelectComplaint(c);
                          }}
                          className="p-1.5 bg-slate-800 hover:bg-teal-900 text-slate-300 hover:text-teal-200 rounded-lg text-[10px] font-bold flex items-center gap-1 transition shrink-0"
                          title="Inspect full complaint details"
                        >
                          Inspect Ticket <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Work Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span className="text-slate-400">Current Work Status:</span>
                          <span className={c.status === 'RESOLVED' ? 'text-emerald-400' : 'text-amber-400'}>
                            {c.status} ({progressPct}%)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className={`h-full transition-all duration-500 ${
                              c.status === 'RESOLVED'
                                ? 'bg-emerald-500'
                                : c.status === 'IN_PROGRESS'
                                ? 'bg-amber-500'
                                : 'bg-indigo-500'
                            }`}
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Latest Timeline Stage */}
                      {lastTimeline && (
                        <div className="p-2 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center gap-2 text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="text-slate-300 font-medium line-clamp-1">{lastTimeline.description || lastTimeline.title}</span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedWorkerDetails(null)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition"
              >
                Close Worker Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Worker Reassignment Modal */}
      {assignTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h4 className="text-sm font-bold text-white">Assign Worker to {assignTarget.complaintCode}</h4>
            <p className="text-xs text-slate-400">{assignTarget.title}</p>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Select Field Officer</label>
              <select
                value={selectedWorkerId}
                onChange={(e) => setSelectedWorkerId(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none font-semibold"
              >
                <option value="">Select Worker...</option>
                {workers.map((w) => (
                  <option key={w._id} value={w._id}>
                    {w.name} — {w.department} ({w.area})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setAssignTarget(null)} className="px-3 py-1.5 text-xs text-slate-400">
                Cancel
              </button>
              <button
                onClick={handleAssignWorker}
                disabled={!selectedWorkerId}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow"
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
