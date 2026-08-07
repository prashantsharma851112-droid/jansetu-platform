import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Wrench, User, CheckCircle2, MapPin, ArrowRight, Activity, Users,
  Layers, Sparkles, Phone, Mail, Send, Info, Eye, Check, Camera, Bell, Star,
  GitCommit, Network, Zap, CheckSquare, Compass
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

const flowGraphNodes = [
  {
    id: 1,
    step: '01',
    title: 'Geo-Spatial Capture',
    desc: 'Citizen captures issue photos with auto-reverse geocoding & live GPS pin drop.',
    icon: MapPin,
    color: 'border-teal-500 text-teal-400 bg-teal-950/60',
    lineColor: '#14b8a6',
  },
  {
    id: 2,
    step: '02',
    title: 'Automated Routing',
    desc: 'JanSetu engine classifies category & auto-dispatches ticket to targeted department.',
    icon: Zap,
    color: 'border-cyan-500 text-cyan-400 bg-cyan-950/60',
    lineColor: '#06b6d4',
  },
  {
    id: 3,
    step: '03',
    title: 'Field Officer Proof',
    desc: 'Municipal worker claims ticket & uploads mandatory ground after-action photo.',
    icon: Wrench,
    color: 'border-amber-500 text-amber-400 bg-amber-950/60',
    lineColor: '#f59e0b',
  },
  {
    id: 4,
    step: '04',
    title: 'SLA Audit & Closure',
    desc: 'Real-time timeline completes, citizen rates quality, & admin logs executive analytics.',
    icon: Shield,
    color: 'border-indigo-500 text-indigo-400 bg-indigo-950/60',
    lineColor: '#6366f1',
  },
];

const complaintSteps = [
  {
    stepNum: 'Step 1',
    title: 'Pick Issue Category & Attach Photo',
    desc: 'Select from 12 civic categories (Road Potholes, Water Leakage, Drainage, Garbage, Streetlights) and upload photo evidence.',
    icon: Camera,
    color: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
  },
  {
    stepNum: 'Step 2',
    title: 'Pin Location on OpenStreetMap',
    desc: 'Drop a pin on interactive Google/OpenStreetMap or tap "My Location" to auto-fill street address & landmark.',
    icon: MapPin,
    color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  },
  {
    stepNum: 'Step 3',
    title: 'Track Live Progress Timeline',
    desc: 'Receive tracking code to monitor stage-by-stage updates (Submitted ➔ Assigned ➔ In Progress ➔ Resolved).',
    icon: Activity,
    color: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  },
  {
    stepNum: 'Step 4',
    title: 'Verify Ground Photo & Rate Service',
    desc: 'Inspect mandatory after-photos uploaded by field officers and provide 5-star resolution feedback.',
    icon: Star,
    color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
  },
];

export default function LandingPage() {
  const [activeRoleIndex, setActiveRoleIndex] = useState(0);
  const [activeNode, setActiveNode] = useState(1);
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

  const handleDragEnd = (event, info) => {
    if (info.offset.x < -40) {
      handleNext();
    } else if (info.offset.x > 40) {
      handlePrev();
    }
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
      {/* 1. 3D SWIPEABLE TOUCH ORBIT CAROUSEL (NO SIDE ARROWS) */}
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

          <p className="text-[11px] text-teal-400 font-semibold flex items-center justify-center gap-1.5 animate-pulse">
            👆 Swipe with finger or drag with mouse to switch portals
          </p>

          {/* Touch Drag Orbit Wheel Container */}
          <div className="relative py-8 flex items-center justify-center min-h-[460px] perspective-1000 select-none">
            <div className="absolute w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

            <div className="relative w-full max-w-lg h-[400px] flex items-center justify-center cursor-grab active:cursor-grabbing">
              <AnimatePresence mode="popLayout">
                {roleCards.map((card, idx) => {
                  const position = (idx - activeRoleIndex + roleCards.length) % roleCards.length;
                  const IconComp = card.icon;

                  let xOffset = 0;
                  let scale = 1;
                  let opacity = 1;
                  let zIndex = 30;
                  let rotateY = 0;

                  if (position === 0) {
                    xOffset = 0;
                    scale = 1.05;
                    opacity = 1;
                    zIndex = 30;
                    rotateY = 0;
                  } else if (position === 1) {
                    xOffset = 180;
                    scale = 0.82;
                    opacity = 0.45;
                    zIndex = 10;
                    rotateY = -25;
                  } else {
                    xOffset = -180;
                    scale = 0.82;
                    opacity = 0.45;
                    zIndex = 10;
                    rotateY = 25;
                  }

                  return (
                    <motion.div
                      key={card.id}
                      drag={position === 0 ? "x" : false}
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.2}
                      onDragEnd={handleDragEnd}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{
                        x: xOffset,
                        scale,
                        opacity,
                        zIndex,
                        rotateY,
                      }}
                      transition={{ duration: 0.4, type: 'spring', stiffness: 120 }}
                      onClick={() => setActiveRoleIndex(idx)}
                      className={`absolute w-full p-6 sm:p-8 rounded-3xl bg-slate-900/95 backdrop-blur-xl border ${
                        position === 0 ? `${card.borderColor} ring-2 ${card.ringColor} shadow-2xl ${card.glowColor}` : 'border-slate-800'
                      } text-left space-y-4 touch-pan-x`}
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

      {/* 2. FLOW GRAPH PIPELINE (ABOUT JANSETU CONNECTED NODES) */}
      <section className="py-16 md:py-24 border-t border-slate-900 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest font-bold text-teal-400 flex items-center justify-center gap-1.5">
            <Network className="w-4 h-4" /> System Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">How JanSetu Architecture Flows</h2>
          <p className="text-slate-400 text-sm">
            Connected data nodes linked by real-time WebSockets and spatial geocoding logic.
          </p>
        </div>

        {/* Connected SVG Flow Line Grid */}
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-6 z-10">
          {flowGraphNodes.map((node, index) => {
            const IconComp = node.icon;
            const isActive = activeNode === node.id;
            return (
              <div
                key={node.id}
                onMouseEnter={() => setActiveNode(node.id)}
                onClick={() => setActiveNode(node.id)}
                className={`relative p-6 rounded-3xl bg-slate-900/90 border transition-all duration-300 cursor-pointer space-y-4 group ${
                  isActive
                    ? `${node.color} ring-2 ring-teal-500/20 shadow-xl scale-[1.02]`
                    : 'border-slate-800/80 hover:border-slate-700 bg-slate-900/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center font-black">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-black opacity-60">NODE_{node.step}</span>
                </div>

                <div>
                  <h4 className="text-base font-black text-white group-hover:text-teal-400 transition">{node.title}</h4>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{node.desc}</p>
                </div>

                <div className="pt-2 flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold text-slate-500">
                  <GitCommit className="w-3.5 h-3.5 text-teal-400" /> Linked Data Pipeline
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. STEP-BY-STEP USER COMPLAINT GUIDE (HOW TO FILE ANY COMPLAINT) */}
      <section className="py-16 md:py-24 border-t border-slate-900 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-slate-950">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest font-bold text-emerald-400 flex items-center justify-center gap-1.5">
            <Compass className="w-4 h-4" /> Easy User Guide
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">4 Simple Steps to Raise Any Civic Issue</h2>
          <p className="text-slate-400 text-sm">
            Filing a civic grievance takes under 60 seconds with transparent stage-by-stage tracking.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {complaintSteps.map((s, idx) => {
            const IconComp = s.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-teal-500/40 transition-all duration-300 space-y-4 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-black px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-teal-400">
                    {s.stepNum}
                  </span>
                  <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center ${s.color}`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-base font-black text-white leading-snug group-hover:text-teal-300 transition">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. CONTACT & SUPPORT SECTION */}
      <section className="py-16 md:py-24 border-t border-slate-900 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs uppercase tracking-widest font-bold text-emerald-400">Get in Touch</span>
          <h2 className="text-3xl font-black text-white">Contact & Municipal Support</h2>
          <p className="text-slate-400 text-sm">Have questions or need emergency municipal assistance? Reach out to our team.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
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
