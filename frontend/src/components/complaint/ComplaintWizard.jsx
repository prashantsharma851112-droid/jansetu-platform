import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  HardHat, Droplets, Waves, Zap, Trash2, Trees, Building2, Dog, TrafficCone,
  Activity, School, HelpCircle, UploadCloud, MapPin, AlertTriangle, ArrowRight,
  ArrowLeft, CheckCircle2, Loader2, Image as ImageIcon, X
} from 'lucide-react';
import PinPickerMap from '../map/PinPickerMap';
import API from '../../services/api';

const categoryIcons = {
  HardHat, Droplets, Waves, Zap, Trash2, Trees, Building2, Dog, TrafficCone, Activity, School, HelpCircle
};

export default function ComplaintWizard({ onFinished }) {
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [gettingGps, setGettingGps] = useState(false);
  const [createdTicket, setCreatedTicket] = useState(null);

  // Form State
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [location, setLocation] = useState({
    lat: 28.6139,
    lng: 77.209,
    address: '',
    area: 'Central Zone',
    pincode: '110001',
  });
  const [details, setDetails] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
  });

  const handleGetLiveLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setGettingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const data = await res.json();
          const addressName = data.display_name || `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
          setLocation({
            lat,
            lng,
            address: addressName,
            area: data.address?.suburb || data.address?.city_district || 'Central Zone',
            pincode: data.address?.postcode || '110001',
          });
        } catch (err) {
          setLocation((prev) => ({ ...prev, lat, lng }));
        } finally {
          setGettingGps(false);
        }
      },
      (err) => {
        alert('Could not fetch GPS location. Please drop the pin on the map or type address manually.');
        setGettingGps(false);
      }
    );
  };

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await API.get('/categories');
        if (res.data.success) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCats(false);
      }
    };
    fetchCats();
  }, []);

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
    if (!selectedCategory || !details.title || !details.description || !location.address) {
      alert('Please complete all required fields in earlier steps.');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('title', details.title);
      formData.append('description', details.description);
      formData.append('categoryId', selectedCategory._id);
      formData.append('priority', details.priority);
      formData.append('latitude', location.lat);
      formData.append('longitude', location.lng);
      formData.append('address', location.address);
      formData.append('area', location.area);
      formData.append('pincode', location.pincode);

      files.forEach((file) => {
        formData.append('images', file);
      });

      const res = await API.post('/complaints', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setCreatedTicket(res.data.complaint);
        setStep(5); // Confetti success step
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting complaint');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative">
      {/* Step Progress Bar Header */}
      <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
        <div className="flex-1 mr-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider font-bold text-teal-400">
              Step {step} of 5
            </span>
            <span className="text-xs text-slate-400 font-semibold">
              {step === 1 && 'Select Issue Category'}
              {step === 2 && 'Upload Photos / Evidence'}
              {step === 3 && 'Pin-Drop Location'}
              {step === 4 && 'Describe Problem'}
              {step === 5 && 'Success'}
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Top Right Close Button */}
        <button
          type="button"
          onClick={onFinished}
          className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          title="Cancel & Exit Wizard"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Step Container */}
      <div className="p-6 md:p-8 min-h-[420px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          {/* STEP 1: CATEGORY SELECTION */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-black text-slate-900">What issue are you reporting?</h3>
              <p className="text-xs text-slate-500">Select the category that best matches the civic issue.</p>

              {loadingCats ? (
                <div className="p-12 text-center text-slate-400">Loading categories...</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {categories.map((cat) => {
                    const IconComp = categoryIcons[cat.icon] || AlertTriangle;
                    const isSelected = selectedCategory?._id === cat._id;
                    return (
                      <button
                        key={cat._id}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all ${
                          isSelected
                            ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-500/30 shadow-md scale-[1.02]'
                            : 'bg-slate-50/50 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold shadow-sm"
                          style={{ backgroundColor: cat.colorCode }}
                        >
                          <IconComp className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 leading-snug">{cat.name}</h4>
                          <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                            {cat.defaultDepartment}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 2: PHOTO UPLOAD */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-black text-slate-900">Upload Photos of the Issue</h3>
              <p className="text-xs text-slate-500">Adding photos speeds up municipal dispatch and worker action.</p>

              <label className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-2xl p-8 text-center flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-teal-50/30 transition">
                <UploadCloud className="w-10 h-10 text-teal-600 mb-2" />
                <span className="text-xs font-bold text-slate-800">Click to upload or drag & drop</span>
                <span className="text-[10px] text-slate-400 mt-1">PNG, JPG, WEBP up to 5MB</span>
                <input type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
              </label>

              {previews.length > 0 && (
                <div className="grid grid-cols-4 gap-3 mt-4">
                  {previews.map((url, i) => (
                    <div key={i} className="relative h-20 rounded-xl overflow-hidden border border-slate-200 group">
                      <img src={url} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-1 opacity-80 group-hover:opacity-100 transition"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 3: LOCATION PIN DROP */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Pin-Drop Location</h3>
                  <p className="text-xs text-slate-500">Click/drag pin or use Live GPS location to prevent incorrect addresses.</p>
                </div>
                <button
                  type="button"
                  onClick={handleGetLiveLocation}
                  disabled={gettingGps}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow transition shrink-0"
                >
                  {gettingGps ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5" />}
                  Use Live GPS Location
                </button>
              </div>

              <PinPickerMap
                defaultLat={location.lat}
                defaultLng={location.lng}
                onLocationChange={(loc) => setLocation((prev) => ({ ...prev, ...loc }))}
              />

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 block">Address (Auto-detected / Editable)</label>
                <input
                  type="text"
                  value={location.address}
                  onChange={(e) => setLocation((prev) => ({ ...prev, address: e.target.value }))}
                  placeholder="Street address or landmark..."
                  className="w-full text-xs font-semibold text-slate-900 bg-white border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
            </motion.div>
          )}

          {/* STEP 4: DESCRIPTION & URGENCY */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-black text-slate-900">Complaint Details & Urgency</h3>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Short Title</label>
                <input
                  type="text"
                  placeholder="e.g. Deep pothole causing bike skid on Main Street"
                  value={details.title}
                  onChange={(e) => setDetails((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  placeholder="Provide any additional context, landmarks, or safety hazards..."
                  value={details.description}
                  onChange={(e) => setDetails((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Urgency Level</label>
                <div className="grid grid-cols-4 gap-2">
                  {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setDetails((prev) => ({ ...prev, priority: p }))}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        details.priority === p
                          ? p === 'CRITICAL'
                            ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                            : 'bg-teal-600 text-white border-teal-600 shadow-md'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 5: SUCCESS CONFETTI */}
          {step === 5 && createdTicket && (
            <motion.div
              key="step5"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-8 space-y-4"
            >
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Complaint Raised Successfully!</h3>
              <p className="text-xs text-slate-500">Your complaint has been registered and dispatched to the concerned department.</p>

              <div className="inline-block bg-teal-50 border border-teal-200 rounded-2xl px-6 py-4 text-center">
                <span className="text-[10px] uppercase font-bold text-teal-600 block">Your Tracking Code</span>
                <span className="text-2xl font-mono font-black text-teal-900">{createdTicket.complaintCode}</span>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={onFinished}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg transition"
                >
                  Go to My Complaints Dashboard
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wizard Controls */}
        {step < 5 && (
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 px-4 py-2 rounded-xl hover:bg-slate-100 transition"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <button
                type="button"
                onClick={onFinished}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition"
              >
                Cancel & Exit
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                disabled={step === 1 && !selectedCategory}
                onClick={() => setStep((s) => s + 1)}
                className="flex items-center gap-1.5 text-xs font-bold bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl shadow-md transition"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={submitting || !details.title}
                onClick={handleSubmit}
                className="flex items-center gap-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl shadow-lg transition"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Complaint'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
