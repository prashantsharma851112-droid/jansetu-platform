import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/common/Logo';
import { User, Mail, Lock, Phone, MapPin, Eye, EyeOff, Loader2, Navigation, Map, KeyRound, CheckCircle2, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
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

  // OTP Verification State
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [demoOtp, setDemoOtp] = useState('');
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [detectingLoc, setDetectingLoc] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  const { user, sendOtp, registerWithOtp } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') navigate('/admin', { replace: true });
      else if (user.role === 'WORKER') navigate('/worker', { replace: true });
      else navigate('/citizen', { replace: true });
    }
  }, [user, navigate]);

  const handleSendRegOtp = async () => {
    if (!name || !name.trim()) {
      alert('Please enter your Full Name before requesting OTP.');
      return;
    }
    if (!email || !email.trim()) {
      alert('Please enter your Email Address before requesting OTP.');
      return;
    }
    if (!password || password.length < 6) {
      alert('Please enter a Password of at least 6 characters before requesting OTP.');
      return;
    }
    if (!phone || phone.trim().length < 10) {
      alert('Please enter a valid 10-digit Phone Number before requesting OTP.');
      return;
    }
    if (!area || !area.trim()) {
      alert('Please enter your Residential Area / Ward before requesting OTP.');
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

  const handleCompleteRegistration = async (e) => {
    e.preventDefault();

    if (!name || !name.trim()) return alert('Full Name is required');
    if (!email || !email.trim()) return alert('Email Address is required');
    if (!password || password.length < 6) return alert('Password must be at least 6 characters');
    if (!phone || phone.trim().length < 10) return alert('Valid 10-digit Phone Number is required');
    if (!area || !area.trim()) return alert('Residential Area / Ward is required');

    if (!otpSent) {
      // Trigger OTP sending if not sent yet
      await handleSendRegOtp();
      return;
    }

    if (!otpCode || otpCode.trim().length < 6) {
      alert('Please enter the 6-digit OTP code sent to your mobile phone.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await registerWithOtp({
        name,
        email,
        password,
        phone,
        address,
        area,
        otp: otpCode,
      });

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
            if (res.data.display_name) {
              setAddress(res.data.display_name);
            }
          }
        } catch (err) {
          // Fallback
        } finally {
          setDetectingLoc(false);
        }
      },
      (err) => {
        alert('Could not get your location. Please type your area manually.');
        setDetectingLoc(false);
      }
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 py-8 relative">
      {/* Top Left Floating Back to Home Link */}
      <Link
        to="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-teal-400 bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl transition shadow"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 relative mt-12 sm:mt-0">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block group">
            <Logo size="lg" className="mx-auto" />
          </Link>
          <h2 className="text-2xl font-black text-white">Create Citizen Account</h2>
          <p className="text-xs text-slate-400">All fields & OTP Verification are required to register</p>
        </div>

        <form onSubmit={handleCompleteRegistration} className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Full Name *</label>
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
            <label className="text-xs font-bold text-slate-300 block mb-1">Email Address *</label>
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
            <label className="text-xs font-bold text-slate-300 block mb-1">Password (min 6 chars) *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                placeholder="••••••••"
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

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Phone Number *</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 text-xs text-white rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-300">Residential Area / Ward *</label>
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
                required
                placeholder="e.g. Connaught Place Ward 12"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 text-xs text-white rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
              />
            </div>
          </div>

          {/* OTP STEP */}
          {!otpSent ? (
            <button
              type="button"
              onClick={handleSendRegOtp}
              disabled={verifyingOtp || !name || !email || !password || !phone || !area}
              className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 mt-3 disabled:opacity-50"
            >
              {verifyingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : <><KeyRound className="w-4 h-4" /> Send Verification OTP & Continue</>}
            </button>
          ) : (
            <div className="space-y-3 pt-2 border-t border-slate-800">
              {demoOtp && (
                <div className="p-3 bg-teal-950/80 border border-teal-800 rounded-xl text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-teal-400 block">📱 Live SMS OTP Code</span>
                  <span className="text-xl font-mono font-black text-teal-200 tracking-wider">{demoOtp}</span>
                  <p className="text-[10px] text-slate-400">Enter this code below to confirm account creation</p>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-teal-400 block mb-1">Enter 6-Digit Verification OTP *</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-teal-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="Enter 6-digit OTP..."
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-teal-500/50 text-sm font-mono tracking-widest text-white rounded-xl focus:ring-1 focus:ring-teal-400 outline-none text-center"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || otpCode.length < 6}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ShieldCheck className="w-4 h-4" /> Verify OTP & Create Account</>}
              </button>
            </div>
          )}
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
