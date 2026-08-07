import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Wrench, User, CheckCircle2, MapPin, ArrowRight, Activity, Users,
  Layers, Sparkles, ChevronLeft, ChevronRight, Phone, Mail, Send, Info, Eye, Check
} from 'lucide-react';
import API from '../services/api';

const roleCards = [
  {
    id: 'CITIZEN',
    title: 'Citizen Resolution Portal',
    badge: 'Public Portal',
    role: 'Citizen User',
    icon: User,
    color: 'from-teal-500 to-emerald-400',
    borderColor: 'border-teal-500/50',
    ringColor: 'ring-teal-500/30',
    glowColor: 'shadow-teal-500/30',
    path: '/citizen',
    description: 'Report local municipal problems with pin-drop Leaflet maps, multi-photo evidence uploads, upvote nearby community concerns, and track live courier-style timeline updates.',
    features: ['5-Step Animated Wizard', 'Interactive Pin-Drop Map', '1-Click Community Upvoting', 'Courier-Style Timeline'],
  },
  {
    id: 'WORKER',
    title: 'Field Worker Operations App',
    badge: 'Operations Staff',
    role: 'Municipal Worker',
    icon: Wrench,
    color: 'from-amber-500 to-yellow-400',
    borderColor: 'border-amber-500/50',
    ringColor: 'ring-amber-500/30',
    glowColor: 'shadow-amber-500/30',
    path: '/worker',
    description: 'Ground workforce dashboard to view assigned tickets, claim unassigned departmental tasks, upload mandatory proof-of-work after-photos, and update stage remarks.',
    features: ['My Tasks & Unassigned Pool', '1-Click Ticket Claim', 'Mandatory After Photo Proof', 'Real-time Resolution Stats'],
  },
  {
    id: 'ADMIN',
    title: 'Executive Command Center',
    badge: 'City Administration',
    role: 'Municipal Admin',
    icon: Shield,
    color: 'from-indigo-500 to-cyan-400',
    borderColor: 'border-indigo-500/50',
    ringColor: 'ring-indigo-500/30',
    glowColor: 'shadow-indigo-500/30',
    path: '/admin',
    description: 'Administrative command center equipped with city spatial heatmaps, dynamic category customizers, SLA overdue ticket escalation engine, and 1-click CSV report exports.',
    features: ['Recharts KPI Analytics', 'Spatial Heatmap & Density', 'Dynamic Category Manager', 'SLA Overdue Escalation Engine'],
  },
];

export default function LandingPage() {
  const [activeRoleIndex, setActiveRoleIndex] = useState(0);
  const [stats, setStats] = useState({ total: 50, resolved: 32, rate: '92.4%' });
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/admin/analytics');
        if (res.data.success) {
          setStats({
            total: res.data.analytics.totalComplaints,
            resolved: res.data.analytics.resolvedComplaints,
            rate: `${res.data.analytics.resolutionRate}%`,
          });
        }
      } catch (err) {
        // Fallback default
      }
    };
    fetchStats();
  }, []);

  const handleNext = () => {
    setActiveRoleIndex((prev) => (prev + 1) % roleCards.length);
  };

  const handlePrev = () => {
    setActiveRoleIndex((prev) => (prev - 1 + roleCards.length) % roleCards.length);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactForm({ name: '', email: '', message: '' });
      setContactSubmitted(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-teal-500 selection:text-slate-950 font-sans overflow-x-hidden pt-6">
      {/* 1. 3D FLOATING IN-AIR ORBIT CAROUSEL (PURPOSE BUILT DASHBOARDS) */}
      <section className="py-16 md:py-24 border-t border-slate-900 relative overflow-hidden bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Role Pills Navigation */}
          <div className="flex justify-center gap-2 pt-2">
            {roleCards.map((rc, idx) => (
              <button
                key={rc.id}
                onClick={() => setActiveRoleIndex(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeRoleIndex === idx
                    ? 'bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 shadow-lg scale-105'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {rc.role}
              </button>
            ))}
          </div>

          {/* 3D Circular Orbit Wheel Container */}
          <div className="relative py-12 flex items-center justify-center min-h-[460px] perspective-1000">
            {/* Center Orb */}
            <div className="absolute w-40 h-40 bg-teal-500/10 rounded-full blur-2xl pointer-events-none animate-pulse" />

            {/* Orbit Navigation Controls */}
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-12 z-40 p-3 bg-slate-900/90 hover:bg-slate-800 text-white rounded-2xl border border-slate-800 shadow-2xl transition hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-12 z-40 p-3 bg-slate-900/90 hover:bg-slate-800 text-white rounded-2xl border border-slate-800 shadow-2xl transition hover:scale-110"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Floating Orbit Cards */}
            <div className="relative w-full max-w-lg h-[400px] flex items-center justify-center">
              <AnimatePresence mode="popLayout">
                {roleCards.map((card, idx) => {
                  const position = (idx - activeRoleIndex + roleCards.length) % roleCards.length;
                  const IconComp = card.icon;

                  // 3D Orbit transformations
                  let xOffset = 0;
                  let scale = 1;
                  let opacity = 1;
                  let zIndex = 30;
                  let rotateY = 0;

                  if (position === 0) {
                    // Active Front Card
                    xOffset = 0;
                    scale = 1.05;
                    opacity = 1;
                    zIndex = 30;
                    rotateY = 0;
                  } else if (position === 1) {
                    // Right Card
                    xOffset = 180;
                    scale = 0.82;
                    opacity = 0.45;
                    zIndex = 10;
                    rotateY = -25;
                  } else {
                    // Left Card
                    xOffset = -180;
                    scale = 0.82;
                    opacity = 0.45;
                    zIndex = 10;
                    rotateY = 25;
                  }

                  return (
                    <motion.div
                      key={card.id}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{
                        x: xOffset,
                        scale,
                        opacity,
                        zIndex,
                        rotateY,
                      }}
                      transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
                      onClick={() => setActiveRoleIndex(idx)}
                      className={`absolute w-full p-6 sm:p-8 rounded-3xl bg-slate-900/90 backdrop-blur-xl border ${
                        position === 0 ? `${card.borderColor} ring-2 ${card.ringColor} shadow-2xl ${card.glowColor}` : 'border-slate-800'
                      } cursor-pointer text-left space-y-4`}
                    >
                      <div className="flex items-center justify-between">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${card.color} text-slate-950 flex items-center justify-center font-bold shadow-lg`}>
                          <IconComp className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {card.badge}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xl font-black text-white">{card.title}</h3>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">{card.description}</p>
                      </div>

                      {/* Feature Pills */}
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        {card.features.map((feat, fIdx) => (
                          <div key={fIdx} className="text-[10px] font-semibold text-slate-300 bg-slate-950/60 p-2 rounded-xl border border-slate-800 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-teal-400 shrink-0" />
                            <span className="line-clamp-1">{feat}</span>
                          </div>
                        ))}
                      </div>

                      {position === 0 && (
                        <div className="pt-2">
                          <Link
                            to="/login"
                            className={`w-full py-3 rounded-xl bg-gradient-to-r ${card.color} text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] transition`}
                          >
                            Launch {card.role} Portal <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ABOUT US SECTION */}
      <section className="py-16 md:py-24 border-t border-slate-900 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-widest font-bold text-teal-400 flex items-center gap-1.5">
              <Info className="w-4 h-4" /> About JanSetu
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              Bridging Citizens & Governance with 100% Transparency
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              JanSetu ("Bridge of the People") was engineered to transform how local civic complaints are raised, assigned, and resolved. By removing bureaucratic opacity, JanSetu provides a unified digital ecosystem where citizens gain real-time visibility, field workers receive structured tasks, and city managers access predictive spatial intelligence.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <MapPin className="w-5 h-5 text-teal-400 mb-2" />
                <h4 className="text-xs font-bold text-white">Pin-Drop Mapping</h4>
                <p className="text-[11px] text-slate-400 mt-1">Precise OpenStreetMap spatial pin drop with auto reverse-geocoding.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <Activity className="w-5 h-5 text-emerald-400 mb-2" />
                <h4 className="text-xs font-bold text-white">Live Courier Timeline</h4>
                <p className="text-[11px] text-slate-400 mt-1">Watch ticket updates progress stage by stage with proof photos.</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative">
            <div className="absolute top-4 right-4 w-20 h-20 bg-teal-500/10 rounded-full blur-xl pointer-events-none" />
            <h3 className="text-lg font-bold text-white mb-4">Core Governance Pillars</h3>
            <ul className="space-y-4 text-xs text-slate-300">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 font-bold text-[10px]">1</div>
                <div>
                  <strong className="text-white block">Community Pressure & Upvoting</strong>
                  Upvote nearby public complaints to bring instant attention to urgent hazards.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 font-bold text-[10px]">2</div>
                <div>
                  <strong className="text-white block">Mandatory Proof of Work</strong>
                  Field officers must upload ground after-photos before closing any ticket.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 font-bold text-[10px]">3</div>
                <div>
                  <strong className="text-white block">SLA Overdue Escalation Engine</strong>
                  Unresolved issues auto-flag for executive review to guarantee prompt action.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. CONTACT US SECTION */}
      <section className="py-16 md:py-24 border-t border-slate-900 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs uppercase tracking-widest font-bold text-emerald-400">Get in Touch</span>
          <h2 className="text-3xl font-black text-white">Contact & Municipal Support</h2>
          <p className="text-slate-400 text-sm">Have questions or need emergency municipal assistance? Reach out to our team.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Info Card */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0 font-bold">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Toll-Free Helpline</span>
                <span className="text-sm font-bold text-white">1800-11-JANSETU (2026)</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 font-bold">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Official Support Email</span>
                <span className="text-sm font-bold text-white">support@jansetu.gov.in</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Central Headquarters</span>
                <span className="text-sm font-bold text-white">Civic Center, Connaught Place, ND</span>
              </div>
            </div>
          </div>

          {/* Quick Inquiry Form */}
          <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-white">Send Inquiry / Feedback</h3>

            {contactSubmitted ? (
              <div className="p-6 bg-emerald-950/60 border border-emerald-800 rounded-2xl text-center space-y-2">
                <Check className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-300">Message Received!</h4>
                <p className="text-xs text-slate-400">Thank you for reaching out. Our municipal desk will respond shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram Sharma"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full text-xs p-3 bg-slate-950 border border-slate-800 text-white rounded-xl outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="name@gmail.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full text-xs p-3 bg-slate-950 border border-slate-800 text-white rounded-xl outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Message / Suggestion</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="How can we assist you?"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full text-xs p-3 bg-slate-950 border border-slate-800 text-white rounded-xl outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-black text-xs px-6 py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                >
                  Send Inquiry <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 text-center text-xs text-slate-600">
        JanSetu Civic Tech Platform © 2026 — Bridging Citizens & Municipal Governance.
      </footer>
    </div>
  );
}
