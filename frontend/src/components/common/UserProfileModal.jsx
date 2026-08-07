import React, { useState } from 'react';
import { User, Mail, Phone, Wrench, Shield, MapPin, Lock, Eye, EyeOff, X, Building, Edit2, Upload, Camera, Save, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function UserProfileModal({ user, onClose }) {
  const { updateProfile } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [expandDp, setExpandDp] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    area: user?.area || '',
    department: user?.department || '',
    avatar: user?.avatar || '',
    password: '',
  });

  if (!user) return null;

  const handleDpFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateProfile(form);
      setIsEditing(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {!isEditing ? (
            /* VIEW MODE */
            <>
              {/* Header Avatar & Name */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-5">
                <div className="flex items-center gap-4">
                  <div className="relative group cursor-pointer" onClick={() => setExpandDp(true)}>
                    <img
                      src={user.avatar || 'https://i.pravatar.cc/150'}
                      alt={user.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500/40 shadow-lg group-hover:opacity-80 transition"
                    />
                    <span className="absolute bottom-0 right-0 bg-slate-950/90 text-[9px] font-bold text-teal-400 px-1 rounded border border-slate-700">
                      View
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">{user.name}</h3>
                    <span
                      className={`inline-flex items-center gap-1 mt-1 text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full border ${
                        user.role === 'ADMIN'
                          ? 'bg-indigo-950 text-indigo-300 border-indigo-700'
                          : user.role === 'WORKER'
                          ? 'bg-amber-950 text-amber-300 border-amber-700'
                          : 'bg-teal-950 text-teal-300 border-teal-700'
                      }`}
                    >
                      {user.role === 'ADMIN' && <Shield className="w-3 h-3" />}
                      {user.role === 'WORKER' && <Wrench className="w-3 h-3" />}
                      {user.role === 'CITIZEN' && <User className="w-3 h-3" />}
                      {user.role} Account
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow transition shrink-0"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit Profile
                </button>
              </div>

              {/* User Details Grid */}
              <div className="space-y-3.5 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>Official Email</span>
                  </div>
                  <span className="font-semibold text-white select-all">{user.email}</span>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>Contact Number</span>
                  </div>
                  <span className="font-semibold text-white">{user.phone || 'Not Provided'}</span>
                </div>

                {user.department && (
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Building className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Assigned Dept</span>
                    </div>
                    <span className="font-bold text-amber-300">{user.department}</span>
                  </div>
                )}

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Ward / Area Zone</span>
                  </div>
                  <span className="font-semibold text-slate-200">{user.area || 'Central Zone'}</span>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Lock className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Account Security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-white text-xs font-semibold">
                      {showPassword ? 'Admin@123' : '••••••••'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-white p-1 rounded transition"
                      title={showPassword ? 'Hide Password' : 'Show Password'}
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition"
              >
                Close Profile
              </button>
            </>
          ) : (
            /* EDIT MODE FORM */
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Edit2 className="w-5 h-5 text-indigo-400" /> Update My Account Details
              </h3>

              {/* Avatar DP Upload */}
              <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="relative">
                  <img
                    src={form.avatar || user.avatar || 'https://i.pravatar.cc/150'}
                    alt="DP"
                    className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500/50 shrink-0 shadow"
                  />
                  <span className="absolute bottom-0 right-0 bg-indigo-500 text-slate-950 p-1 rounded-full text-[9px]">
                    <Camera className="w-3 h-3" />
                  </span>
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-[11px] font-bold text-indigo-400 block">Profile DP Photo</label>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg cursor-pointer shadow transition">
                    <Upload className="w-3 h-3" /> Upload DP File
                    <input type="file" accept="image/*" onChange={handleDpFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 text-white rounded-xl outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Contact Phone Number</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 text-white rounded-xl outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {user.role === 'ADMIN' || user.role === 'WORKER' ? (
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">Department Name</label>
                    <input
                      type="text"
                      value={form.department}
                      onChange={(e) => setForm({ ...form, department: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 text-white rounded-xl outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                ) : null}

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Ward / Zone Area</label>
                  <input
                    type="text"
                    value={form.area}
                    onChange={(e) => setForm({ ...form, area: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 text-white rounded-xl outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-amber-400 block mb-1 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> Change Password (Optional - leave blank to keep current)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter new password if changing..."
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 text-white rounded-xl outline-none font-mono focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-teal-400 hover:from-indigo-400 hover:to-teal-300 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center gap-1.5"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <> <Save className="w-4 h-4" /> Save Profile Changes </>}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* DP Image Lightbox Modal */}
      {expandDp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn cursor-pointer"
          onClick={() => setExpandDp(false)}
        >
          <div className="relative max-w-sm w-full text-center space-y-3" onClick={(e) => e.stopPropagation()}>
            <img
              src={user.avatar || 'https://i.pravatar.cc/150'}
              alt={user.name}
              className="w-72 h-72 rounded-3xl object-cover border-4 border-indigo-500/50 shadow-2xl mx-auto"
            />
            <div className="text-white">
              <h4 className="font-bold text-sm">{user.name}</h4>
              <span className="text-xs text-slate-400">{user.role} Profile Photo</span>
            </div>
            <button
              onClick={() => setExpandDp(false)}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl"
            >
              Close Photo
            </button>
          </div>
        </div>
      )}
    </>
  );
}
