import React, { useState, useEffect } from 'react';
import { UserPlus, Wrench, Phone, Mail, CheckCircle2, Shield, Loader2, Edit3, X, Save, Lock, Upload, Camera, ExternalLink, Activity, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import API from '../../services/api';

export default function WorkerManager({ onSelectComplaint }) {
  const [workers, setWorkers] = useState([]);
  const [dynamicDepartments, setDynamicDepartments] = useState([
    'Roads & Infrastructure',
    'Water Works & Jal Board',
    'Sanitation Department',
    'Electrical Division',
    'Sewage Management',
    'Horticulture Department',
    'Urban Enforcement',
    'Veterinary Services',
    'Traffic Police Liaison',
    'Health Department',
    'Public Works Division',
    'General Governance',
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingWorker, setEditingWorker] = useState(null);

  // Worker Workload & Progress Modal State
  const [selectedWorkerData, setSelectedWorkerData] = useState(null);
  const [loadingTasks, setLoadingTasks] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: 'Worker@123',
    phone: '',
    department: 'Roads & Infrastructure',
    area: 'Central Connaught Ward',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
  });

  const fetchWorkersAndDepartments = async () => {
    try {
      const [wRes, cRes] = await Promise.all([
        API.get('/admin/workers'),
        API.get('/categories'),
      ]);

      if (wRes.data.success) {
        setWorkers(wRes.data.workers);
      }

      if (cRes.data.success && cRes.data.categories) {
        const catDepts = cRes.data.categories
          .map((c) => c.defaultDepartment)
          .filter(Boolean);
        const merged = Array.from(new Set([...catDepts, ...dynamicDepartments]));
        setDynamicDepartments(merged);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWorkersAndDepartments();
  }, []);

  const handleOpenWorkerTasks = async (worker) => {
    try {
      setLoadingTasks(true);
      setSelectedWorkerData({ worker, complaints: [] });
      const res = await API.get(`/admin/workers/${worker._id}/tasks`);
      if (res.data.success) {
        setSelectedWorkerData({
          worker: res.data.worker,
          complaints: res.data.complaints,
        });
      }
    } catch (err) {
      console.error(err);
      alert('Error fetching worker assigned tasks');
    } finally {
      setLoadingTasks(false);
    }
  };

  // Handle local image file upload for new worker DP
  const handleAddDpFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Handle local image file upload for editing worker DP
  const handleEditDpFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setEditingWorker((prev) => ({ ...prev, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleCreateWorker = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return;

    try {
      setSubmitting(true);
      const res = await API.post('/admin/workers', form);
      if (res.data.success) {
        fetchWorkersAndDepartments();
        setShowAdd(false);
        setForm({
          name: '',
          email: '',
          password: 'Worker@123',
          phone: '',
          department: 'Roads & Infrastructure',
          area: 'Central Connaught Ward',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
        });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating worker account');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateWorker = async (e) => {
    e.preventDefault();
    if (!editingWorker || !editingWorker.name) return;

    try {
      setSubmitting(true);
      const res = await API.put(`/admin/workers/${editingWorker._id}`, editingWorker);
      if (res.data.success) {
        fetchWorkersAndDepartments();
        setEditingWorker(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating worker details');
    } finally {
      setSubmitting(false);
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

  const getLatestTimelineStage = (timeline) => {
    if (!timeline || timeline.length === 0) return 'Task assigned to field worker';
    const lastItem = timeline[timeline.length - 1];
    return lastItem.description || lastItem.title || 'Work in progress';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-amber-400" /> Municipal Field Worker Staff
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Provision, manage, and track live field worker task progress</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition shadow"
        >
          <UserPlus className="w-4 h-4" /> Provision Worker
        </button>
      </div>

      {/* Provision Worker Form */}
      {showAdd && (
        <form onSubmit={handleCreateWorker} className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-4">
          <div className="flex items-center gap-4 bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
            <div className="relative">
              <img
                src={form.avatar || 'https://i.pravatar.cc/150'}
                alt="Worker DP Preview"
                className="w-16 h-16 rounded-full object-cover border-2 border-amber-500/60 shadow shrink-0"
              />
              <span className="absolute bottom-0 right-0 bg-amber-500 text-slate-950 p-1 rounded-full text-[9px] shadow">
                <Camera className="w-3 h-3" />
              </span>
            </div>

            <div className="flex-1 space-y-1">
              <label className="text-[11px] font-bold text-amber-400 block">Worker Profile Photo (DP Image)</label>
              <p className="text-[10px] text-slate-400">Select a real photo file from your device/computer.</p>

              <div className="pt-1">
                <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl cursor-pointer shadow transition">
                  <Upload className="w-3.5 h-3.5" /> Upload Worker DP Photo
                  <input type="file" accept="image/*" onChange={handleAddDpFileUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Worker Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Kumar"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full text-xs p-2 bg-slate-900 border border-slate-700 text-white rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Official Email</label>
              <input
                type="email"
                required
                placeholder="worker@jansetu.gov.in"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full text-xs p-2 bg-slate-900 border border-slate-700 text-white rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Default Password</label>
              <input
                type="text"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full text-xs p-2 bg-slate-900 border border-slate-700 text-white rounded-lg outline-none font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="+91 98765 00000"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full text-xs p-2 bg-slate-900 border border-slate-700 text-white rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Assigned Department</label>
              <select
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className="w-full text-xs p-2 bg-slate-900 border border-slate-700 text-white rounded-lg outline-none font-semibold"
              >
                {dynamicDepartments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Ward / Zone Area</label>
              <input
                type="text"
                value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })}
                className="w-full text-xs p-2 bg-slate-900 border border-slate-700 text-white rounded-lg outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowAdd(false)} className="px-3 py-1.5 text-xs text-slate-400">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg shadow"
            >
              {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Create Account'}
            </button>
          </div>
        </form>
      )}

      {/* Edit Worker Modal */}
      {editingWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <form
            onSubmit={handleUpdateWorker}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 relative max-h-[90vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={() => setEditingWorker(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-teal-400" /> Edit Field Worker Account
            </h3>

            <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="relative">
                <img
                  src={editingWorker.avatar || 'https://i.pravatar.cc/150'}
                  alt="Worker Avatar"
                  className="w-16 h-16 rounded-full object-cover border-2 border-teal-500/50 shrink-0 shadow"
                />
                <span className="absolute bottom-0 right-0 bg-teal-500 text-slate-950 p-1 rounded-full text-[9px] shadow">
                  <Camera className="w-3 h-3" />
                </span>
              </div>

              <div className="flex-1 space-y-1">
                <label className="text-[11px] font-bold text-teal-400 block">Worker Profile Photo (DP Image)</label>
                <p className="text-[10px] text-slate-400">Upload a new photo file from your device.</p>
                <div className="pt-1">
                  <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl cursor-pointer shadow transition">
                    <Upload className="w-3.5 h-3.5" /> Change DP Photo
                    <input type="file" accept="image/*" onChange={handleEditDpFileUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Worker Name</label>
                <input
                  type="text"
                  required
                  value={editingWorker.name || ''}
                  onChange={(e) => setEditingWorker({ ...editingWorker, name: e.target.value })}
                  className="w-full p-2 bg-slate-950 border border-slate-800 text-white rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editingWorker.phone || ''}
                  onChange={(e) => setEditingWorker({ ...editingWorker, phone: e.target.value })}
                  className="w-full p-2 bg-slate-950 border border-slate-800 text-white rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Assigned Department</label>
                <select
                  value={editingWorker.department || ''}
                  onChange={(e) => setEditingWorker({ ...editingWorker, department: e.target.value })}
                  className="w-full p-2 bg-slate-950 border border-slate-800 text-white rounded-xl outline-none font-semibold"
                >
                  {dynamicDepartments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Ward / Zone Area</label>
                <input
                  type="text"
                  value={editingWorker.area || ''}
                  onChange={(e) => setEditingWorker({ ...editingWorker, area: e.target.value })}
                  className="w-full p-2 bg-slate-950 border border-slate-800 text-white rounded-xl outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-amber-400 block mb-1 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> Reset Password (Optional - leave blank to keep current)
              </label>
              <input
                type="text"
                placeholder="Enter new password if resetting..."
                value={editingWorker.password || ''}
                onChange={(e) => setEditingWorker({ ...editingWorker, password: e.target.value })}
                className="w-full text-xs p-2 bg-slate-950 border border-slate-800 text-white rounded-xl outline-none font-mono"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingWorker(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center gap-1.5"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <> <Save className="w-4 h-4" /> Save Worker Changes </>}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Workers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workers.map((w) => (
          <div key={w._id} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-3 relative group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={w.avatar || 'https://i.pravatar.cc/150'}
                  alt={w.name}
                  className="w-10 h-10 rounded-full border border-amber-500/30 object-cover shadow"
                />
                <div>
                  <h4 className="text-xs font-bold text-white">{w.name}</h4>
                  <span className="text-[10px] text-amber-400 font-semibold block">{w.department}</span>
                </div>
              </div>
              <button
                onClick={() => setEditingWorker(w)}
                className="p-1.5 bg-slate-900 hover:bg-teal-900 text-slate-400 hover:text-teal-300 border border-slate-700 hover:border-teal-600 rounded-lg transition"
                title="Edit Worker Staff Details"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-[11px] text-slate-400 space-y-1 pt-1 border-t border-slate-700/40">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-slate-500" /> {w.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-slate-500" /> {w.phone || 'N/A'}
              </span>
            </div>

            {/* Clickable Assigned / Resolved Workload Pill */}
            <div
              onClick={() => handleOpenWorkerTasks(w)}
              className="flex items-center justify-between text-[11px] bg-slate-900/80 hover:bg-slate-900 p-2.5 rounded-xl border border-slate-700/80 hover:border-amber-500/60 cursor-pointer transition group/pill shadow-sm"
              title="Click to view work progress & active tasks"
            >
              <div className="flex items-center gap-3">
                <span>Assigned: <strong className="text-amber-400 text-xs">{w.assignedCount}</strong></span>
                <span className="text-slate-600">|</span>
                <span>Resolved: <strong className="text-emerald-400 text-xs">{w.resolvedCount}</strong></span>
              </div>
              <span className="text-[10px] font-bold text-amber-400 group-hover/pill:text-amber-300 flex items-center gap-1">
                <Activity className="w-3 h-3" /> Track Work →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Worker Tasks Workload & Live Progress Modal */}
      {selectedWorkerData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl relative space-y-5">
            <button
              onClick={() => setSelectedWorkerData(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Worker Info Header */}
            <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
              <img
                src={selectedWorkerData.worker.avatar || 'https://i.pravatar.cc/150'}
                alt={selectedWorkerData.worker.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-500/50 shadow-lg"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-white">{selectedWorkerData.worker.name}</h3>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
                    {selectedWorkerData.worker.department}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  📞 {selectedWorkerData.worker.phone || 'N/A'} | 📍 {selectedWorkerData.worker.area || 'Central Zone'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-bold bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300">
              <span>Total Assigned Complaints: <strong className="text-amber-400 text-sm ml-1">{selectedWorkerData.complaints.length}</strong></span>
              <span className="text-emerald-400">
                Resolved: {selectedWorkerData.complaints.filter((c) => c.status === 'RESOLVED').length} / {selectedWorkerData.complaints.length}
              </span>
            </div>

            {/* Assigned Complaints Task List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {loadingTasks ? (
                <div className="py-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2 font-medium">
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" /> Fetching worker's live task progress...
                </div>
              ) : selectedWorkerData.complaints.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  No active civic complaints currently assigned to this field worker.
                </div>
              ) : (
                selectedWorkerData.complaints.map((c) => {
                  const progressPct = getProgressPercentage(c.status);
                  const latestStage = getLatestTimelineStage(c.timeline);

                  return (
                    <div
                      key={c._id}
                      className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800/90 hover:border-slate-700 transition space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-[10px] font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/60">
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

                        {onSelectComplaint && (
                          <button
                            onClick={() => {
                              setSelectedWorkerData(null);
                              onSelectComplaint(c._id);
                            }}
                            className="p-1.5 bg-slate-800 hover:bg-indigo-900 text-slate-300 hover:text-indigo-200 rounded-lg text-[10px] font-bold flex items-center gap-1 transition shrink-0"
                            title="Inspect full complaint details"
                          >
                            Inspect <ExternalLink className="w-3 h-3" />
                          </button>
                        )}
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

                      {/* Live Work Stage (Kahan tak pahucha hai) */}
                      <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 flex items-start gap-2 text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 block">Latest Progress Update:</span>
                          <span className="text-slate-200 font-medium">{latestStage}</span>
                        </div>
                      </div>

                      {/* Work Photos Evidence */}
                      {c.images && c.images.length > 0 && (
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-[10px] font-bold text-slate-500">Proof Uploaded:</span>
                          <div className="flex items-center gap-1.5">
                            {c.images.map((img, imgIdx) => (
                              <img
                                key={imgIdx}
                                src={img.url}
                                alt="Work proof"
                                className="w-7 h-7 rounded-lg object-cover border border-slate-700"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <button
              onClick={() => setSelectedWorkerData(null)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition"
            >
              Close Work Progress
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
