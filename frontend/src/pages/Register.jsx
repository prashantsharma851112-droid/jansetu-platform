import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Phone, MapPin, Eye, EyeOff, Loader2, Navigation, Map, KeyRound, CheckCircle2, ShieldCheck } from 'lucide-react';
import PinPickerMap from '../components/map/PinPickerMap';
import axios from 'axios';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('');

  // OTP State for Registration
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [demoOtp, setDemoOtp] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [detectingLoc, setDetectingLoc] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  const { user, register, sendOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') navigate('/admin', { replace: true });
      else if (user.role === 'WORKER') navigate('/worker', { replace: true });
      else navigate('/citizen', { replace: true });
    }
  }, [user, navigate]);

  const handleSendRegOtp = async () => {
    if (!phone || phone.trim().length < 10) {
      alert('Please enter a valid 10-digit mobile phone number first.');
      return;
    }
    try {
      setVerifyingOtp(true);
      const res = await sendOtp(phone);
      if (res.success) {
        setOtpSent(true);
        if (res.otp) setDemoOtp(res.otp);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error sending OTP');
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleVerifyRegOtp = async () => {
    if (!phone || !otpCode) return;
    try {
      setVerifyingOtp(true);
      const res = await verifyOtp({ phone, otp: otpCode, name, area });
      if (res?.user) {
        setPhoneVerified(true);
        setOtpSent(false);
        navigate('/citizen');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Invalid OTP code');
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setDetectingLoc(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
          );
          if (res.data) {
            const detectedArea =
              res.data.address?.suburb ||
              res.data.address?.city_district ||
              res.data.address?.neighbourhood ||
              res.data.address?.county ||
              res.data.address?.city ||
              'Central Zone';
            setArea(detectedArea);
            setAddress(res.data.display_name || '');
          }
        } catch (err) {
          setArea(`Lat: ${lat.toFixed(3)}, Lng: ${lng.toFixed(3)}`);
        } finally {
          setDetectingLoc(false);
        }
      },
      (err) => {
        setDetectingLoc(false);
        alert('Could not access live location. Please allow browser location access or select manually on map.');
      }
    );
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    try {
      setSubmitting(true);
      const res = await register({ name, email, password, phone, address, area: area || 'Central Zone' });
      if (res?.user) {
        navigate('/citizen');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      alert(`Registration Error: ${msg}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 font-black text-2xl flex items-center justify-center mx-auto shadow-lg shadow-teal-500/20">
            JS
          </div>
          <h2 className="text-2xl font-black text-white">Create Citizen Account</h2>
          <p className="text-xs text-slate-400">Join JanSetu to report and track municipal civic issues</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="Rohan Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 text-xs text-white rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="rohan@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 text-xs text-white rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2 bg-slate-950 border border-slate-800 text-xs text-white rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition focus:outline-none"
                title={showPassword ? 'Hide Password' : 'Show Password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Phone Number Field with OTP Verification */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-300">Phone Number</label>
              {phoneVerified ? (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> Verified OTP
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleSendRegOtp}
                  disabled={verifyingOtp || !phone}
                  className="text-[10px] font-bold text-teal-400 hover:text-teal-300 bg-teal-950/80 hover:bg-teal-900 border border-teal-800/80 px-2 py-0.5 rounded flex items-center gap-1 transition"
                >
                  {verifyingOtp ? <Loader2 className="w-3 h-3 animate-spin" /> : <KeyRound className="w-3 h-3 text-teal-400" />}
                  Verify OTP
                </button>
              )}
            </div>

            <div className="relative">
              <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 text-xs text-white rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
              />
            </div>

            {/* In-Line OTP Box if Sent */}
            {otpSent && !phoneVerified && (
              <div className="mt-2 p-2.5 bg-slate-950 border border-teal-800/80 rounded-xl space-y-2">
                {demoOtp && (
                  <div className="text-[10px] text-teal-400 font-mono font-bold flex items-center justify-between">
                    <span>SMS OTP: {demoOtp}</span>
                    <span className="text-[9px] text-slate-500">Demo Code</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 text-xs text-white rounded-lg text-center font-mono outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyRegOtp}
                    disabled={verifyingOtp || otpCode.length < 6}
                    className="px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-lg transition shrink-0"
                  >
                    Verify
                  </button>
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-300">Residential Area / Ward</label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={detectingLoc}
                  className="text-[10px] font-bold text-teal-400 hover:text-teal-300 bg-teal-950/80 hover:bg-teal-900 border border-teal-800/80 px-2 py-0.5 rounded-lg flex items-center gap-1 transition"
                >
                  {detectingLoc ? <Loader2 className="w-3 h-3 animate-spin" /> : <Navigation className="w-3 h-3 text-teal-400" />}
                  My Location
                </button>
                <button
                  type="button"
                  onClick={() => setShowMapModal(true)}
                  className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-800/80 px-2 py-0.5 rounded-lg flex items-center gap-1 transition"
                >
                  <Map className="w-3 h-3 text-indigo-400" />
                  Map
                </button>
              </div>
            </div>

            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="e.g. Connaught Place Ward 12"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 text-xs text-white rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 mt-2"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="text-teal-400 font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>

      {/* Map Location Picker Modal */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 relative">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-400" /> Select Residential Location on Map
            </h3>

            <PinPickerMap
              onLocationChange={({ address, area: detectedArea }) => {
                if (detectedArea) setArea(detectedArea);
                if (address) setAddress(address);
              }}
            />

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowMapModal(false)}
                className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow"
              >
                Confirm Location
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
