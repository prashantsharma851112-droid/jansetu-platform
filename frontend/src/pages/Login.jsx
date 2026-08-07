import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Wrench, User, Lock, Mail, Eye, EyeOff, ArrowRight, Loader2, Phone, KeyRound, CheckCircle2 } from 'lucide-react';

export default function Login() {
  const [loginMode, setLoginMode] = useState('PASSWORD'); // 'PASSWORD' | 'OTP'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP State
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [demoOtpCode, setDemoOtpCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { user, login, sendOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') navigate('/admin', { replace: true });
      else if (user.role === 'WORKER') navigate('/worker', { replace: true });
      else navigate('/citizen', { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      setSubmitting(true);
      const res = await login(email, password);
      if (res?.user) {
        if (res.user.role === 'ADMIN') navigate('/admin');
        else if (res.user.role === 'WORKER') navigate('/worker');
        else navigate('/citizen');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phone) return;

    try {
      setSubmitting(true);
      const res = await sendOtp(phone);
      if (res.success) {
        setOtpSent(true);
        if (res.otp) setDemoOtpCode(res.otp);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error sending OTP');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!phone || !otp) return;

    try {
      setSubmitting(true);
      const res = await verifyOtp({ phone, otp });
      if (res?.user) {
        navigate('/citizen');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Invalid or expired OTP');
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
          <h2 className="text-2xl font-black text-white">Sign In to JanSetu</h2>
          <p className="text-xs text-slate-400">Access your Citizen, Worker, or Admin account</p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setLoginMode('PASSWORD');
              setOtpSent(false);
            }}
            className={`py-2 rounded-xl transition ${
              loginMode === 'PASSWORD'
                ? 'bg-slate-800 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Password Login
          </button>
          <button
            type="button"
            onClick={() => setLoginMode('OTP')}
            className={`py-2 rounded-xl transition flex items-center justify-center gap-1 ${
              loginMode === 'OTP'
                ? 'bg-teal-500 text-slate-950 shadow font-black'
                : 'text-teal-400 hover:text-teal-300'
            }`}
          >
            📱 Citizen OTP Login
          </button>
        </div>

        {/* STANDARD PASSWORD LOGIN FORM */}
        {loginMode === 'PASSWORD' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@jansetu.gov.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 text-xs text-white rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
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
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-950 border border-slate-800 text-xs text-white rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
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

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Authenticate & Log In'}
            </button>
          </form>
        ) : (
          /* CITIZEN OTP LOGIN FORM */
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Mobile Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 text-xs text-white rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">We will send a 6-digit verification OTP to your phone.</p>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !phone}
                  className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Verification OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                {demoOtpCode && (
                  <div className="p-3 bg-teal-950/80 border border-teal-800 rounded-xl text-center space-y-1">
                    <span className="text-[10px] uppercase font-bold text-teal-400 block">📱 Live SMS OTP Alert</span>
                    <span className="text-xl font-mono font-black text-teal-200 tracking-wider">{demoOtpCode}</span>
                    <p className="text-[10px] text-slate-400">Auto-generated verification code for {phone}</p>
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Enter 6-Digit OTP Code</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="Enter 6-digit OTP..."
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 text-sm font-mono tracking-widest text-white rounded-xl focus:ring-1 focus:ring-teal-500 outline-none text-center"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || otp.length < 6}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify OTP & Sign In'}
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp('');
                    }}
                    className="text-xs text-slate-400 hover:text-white underline"
                  >
                    Change Phone Number / Resend OTP
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        <div className="text-center text-xs text-slate-500">
          New citizen user?{' '}
          <Link to="/register" className="text-teal-400 font-bold hover:underline">
            Register Account
          </Link>
        </div>
      </div>
    </div>
  );
}
