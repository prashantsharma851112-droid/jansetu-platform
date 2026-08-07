import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Wrench, User, CheckCircle2, MapPin, ArrowRight, Activity, Users,
  Layers, Sparkles, Phone, Mail, Send, Info, Eye, Check, Camera, Bell, Star,
  GitCommit, Network, Zap, CheckSquare, Compass, ChevronDown, ChevronUp, MoveVertical
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

const verticalFlowNodes = [
  {
    id: 1,
    step: '01',
    title: 'Geo-Spatial Capture & Pin Drop',
    desc: 'Citizen captures issue photos with auto-reverse geocoding & live GPS pin drop on OpenStreetMap.',
    icon: MapPin,
    color: 'border-teal-500 text-teal-400 bg-teal-950/80',
    glow: 'shadow-teal-500/30',
    badge: 'Node 1: Capture',
  },
  {
    id: 2,
    step: '02',
    title: 'Automated Departmental Routing',
    desc: 'JanSetu AI engine classifies category & auto-dispatches ticket to targeted department pool.',
    icon: Zap,
    color: 'border-cyan-500 text-cyan-400 bg-cyan-950/80',
    glow: 'shadow-cyan-500/30',
    badge: 'Node 2: Dispatch',
  },
  {
    id: 3,
    step: '03',
    title: 'Field Officer Proof-of-Work',
    desc: 'Municipal worker claims ticket & uploads mandatory ground after-action photo evidence.',
    icon: Wrench,
    color: 'border-amber-500 text-amber-400 bg-amber-950/80',
    glow: 'shadow-amber-500/30',
    badge: 'Node 3: Execution',
  },
  {
    id: 4,
    step: '04',
    title: 'SLA Analytics Audit & Rating',
    desc: 'Real-time timeline completes, citizen rates resolution quality, & admin logs executive metrics.',
    icon: Shield,
    color: 'border-indigo-500 text-indigo-400 bg-indigo-950/80',
    glow: 'shadow-indigo-500/30',
    badge: 'Node 4: Governance',
  },
];

export default function LandingPage() {
  const [activeRoleIndex, setActiveRoleIndex] = useState(0);
  const [activeFlowIndex, setActiveFlowIndex] = useState(0);
  const [hoverRating, setHoverRating] = useState(5);
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

  const handleNextRole = () => {
    setActiveRoleIndex((prev) => (prev + 1) % roleCards.length);
  };

  const handlePrevRole = () => {
    setActiveRoleIndex((prev) => (prev - 1 + roleCards.length) % roleCards.length);
  };

  const handleRoleDragEnd = (event, info) => {
    if (info.offset.x < -40) {
      handleNextRole();
    } else if (info.offset.x > 40) {
      handlePrevRole();
    }
  };

  const handleFlowDragEnd = (event, info) => {
    if (info.offset.y < -30) {
      setActiveFlowIndex((prev) => (prev + 1) % verticalFlowNodes.length);
    } else if (info.offset.y > 30) {
      setActiveFlowIndex((prev) => (prev - 1 + verticalFlowNodes.length) % verticalFlowNodes.length);
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
      {/* 1. 3D SWIPEABLE TOUCH ORBIT CAROUSEL WITH CURVED ROPE CABLE */}
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

          {/* Touch Drag Orbit Container with Glowing Rope Background */}
          <div className="relative py-8 flex items-center justify-center min-h-[460px] perspective-1000 select-none">
            {/* Curved Glowing Rope SVG background passing through cards */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-60 hidden sm:block"
              viewBox="0 0 1000 400"
              preserveAspectRatio="none"
            >
              <path
                d="M 50 200 C 250 350, 450 50, 650 320 C 800 120, 900 280, 950 200"
                fill="none"
                stroke="url(#rope-gradient)"
                strokeWidth="5"
                strokeDasharray="12 8"
                className="animate-pulse"
              />
              <defs>
                <linearGradient id="rope-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#14b8a6" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </svg>

            <div className="relative w-full max-w-lg h-[400px] flex items-center justify-center cursor-grab active:cursor-grabbing z-10">
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
                      onDragEnd={handleRoleDragEnd}
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

          {/* Vertical Flow Container with Vertical Curved Rope SVG Line */}
          <div className="relative min-h-[580px] flex items-center justify-center select-none py-6">
          {/* Vertical Curved Rope SVG Line */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-70"
            viewBox="0 0 600 600"
            preserveAspectRatio="none"
          >
            <path
              d="M 300 20 C 150 150, 450 300, 300 450 C 200 520, 400 560, 300 580"
              fill="none"
              stroke="url(#vertical-rope-gradient)"
              strokeWidth="5"
              strokeDasharray="10 8"
              className="animate-pulse"
            />
            <defs>
              <linearGradient id="vertical-rope-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="33%" stopColor="#06b6d4" />
                <stop offset="66%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </svg>

          {/* Swipeable Vertical Cards Container */}
          <div className="relative w-full max-w-xl h-[420px] flex items-center justify-center cursor-grab active:cursor-grabbing z-10 touch-pan-y">
            <AnimatePresence mode="popLayout">
              {verticalFlowNodes.map((node, idx) => {
                const pos = (idx - activeFlowIndex + verticalFlowNodes.length) % verticalFlowNodes.length;
                const IconComp = node.icon;

                let yOffset = 0;
                let scale = 1;
                let opacity = 1;
                let zIndex = 30;

                if (pos === 0) {
                  yOffset = 0;
                  scale = 1.05;
                  opacity = 1;
                  zIndex = 30;
                } else if (pos === 1) {
                  yOffset = 140;
                  scale = 0.86;
                  opacity = 0.5;
                  zIndex = 10;
                } else if (pos === verticalFlowNodes.length - 1) {
                  yOffset = -140;
                  scale = 0.86;
                  opacity = 0.5;
                  zIndex = 10;
                } else {
                  yOffset = 240;
                  scale = 0.7;
                  opacity = 0;
                  zIndex = 0;
                }

                return (
                  <motion.div
                    key={node.id}
                    drag={pos === 0 ? "y" : false}
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={0.2}
                    onDragEnd={handleFlowDragEnd}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{
                      y: yOffset,
                      scale,
                      opacity,
                      zIndex,
                    }}
                    transition={{ duration: 0.4, type: 'spring', stiffness: 120 }}
                    onClick={() => setActiveFlowIndex(idx)}
                    className={`absolute w-full p-6 sm:p-8 rounded-3xl bg-slate-900/95 backdrop-blur-2xl border ${
                      pos === 0 ? `${node.color} ring-2 ring-teal-500/30 shadow-2xl ${node.glow}` : 'border-slate-800/80 opacity-60'
                    } text-left space-y-4`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center font-black shadow">
                          <IconComp className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase font-bold text-teal-400 tracking-wider block">
                            {node.badge}
                          </span>
                          <h3 className="text-lg font-black text-white">{node.title}</h3>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-black text-slate-500 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
                        {node.step} / 04
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                      {node.desc}
                    </p>

                    <div className="flex items-center justify-between text-[11px] font-bold pt-1">
                      <span className="text-teal-400 flex items-center gap-1.5">
                        <GitCommit className="w-3.5 h-3.5" /> Energy Thread Connected
                      </span>
                      {pos === 0 && (
                        <span className="text-slate-400 text-[10px]">Tap next or swipe vertical</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Step Indicator Dots */}
        <div className="flex justify-center gap-2 pt-4">
          {verticalFlowNodes.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveFlowIndex(idx)}
              className={`w-3 h-3 rounded-full transition-all ${
                activeFlowIndex === idx
                  ? 'bg-teal-400 w-8 shadow-lg shadow-teal-500/50'
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 3. MASTER-LEVEL GENIUS INTERACTIVE 4 SIMPLE STEPS SECTION */}
      <section className="py-20 md:py-28 border-t border-slate-900 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            4 Simple Steps to Resolve Any Grievance
          </h2>
        </div>

        {/* Connected Step Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {/* STEP 1 */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-teal-500/40 hover:border-teal-400 shadow-2xl hover:shadow-teal-500/20 transition-all duration-300 space-y-4 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-black text-teal-400 px-3 py-1 rounded-xl bg-teal-950 border border-teal-800">
                STEP_01
              </span>
              <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/30 flex items-center justify-center">
                <Camera className="w-5 h-5" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-black text-white group-hover:text-teal-300 transition">
                Pick Category & Photo Evidence
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Choose from 12 civic categories (Roads, Water, Sanitation) and upload photo evidence.
              </p>
            </div>

            {/* Interactive Preview Widget */}
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-2">
              <span className="text-[9px] uppercase font-bold text-slate-500 block">Interactive Preview</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-teal-950 text-teal-300 border border-teal-800">🛠️ Potholes</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800">💧 Water</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-950 text-amber-300 border border-amber-800">⚡ Power</span>
              </div>
            </div>
          </div>

          {/* STEP 2 */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-cyan-500/40 hover:border-cyan-400 shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 space-y-4 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-black text-cyan-400 px-3 py-1 rounded-xl bg-cyan-950 border border-cyan-800">
                STEP_02
              </span>
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-black text-white group-hover:text-cyan-300 transition">
                Interactive Pin Drop & GPS
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Drop pin on OpenStreetMap or tap "My Location" for precise reverse geocoding.
              </p>
            </div>

            {/* Interactive Radar Pulse Widget */}
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-[10px] font-bold text-slate-300">Live GPS Locked</span>
              </div>
              <span className="text-[9px] font-mono text-cyan-400 font-bold">28.6139° N</span>
            </div>
          </div>

          {/* STEP 3 */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-amber-500/40 hover:border-amber-400 shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 space-y-4 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-black text-amber-400 px-3 py-1 rounded-xl bg-amber-950 border border-amber-800">
                STEP_03
              </span>
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition">
                Live Courier Timeline Progress
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Watch ticket status move stage by stage with real-time Socket.io notifications.
              </p>
            </div>

            {/* Interactive Timeline Progress Bar Widget */}
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="text-amber-400">Dispatch Stage</span>
                <span className="text-slate-400">75%</span>
              </div>
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full animate-pulse" />
              </div>
            </div>
          </div>

          {/* STEP 4 */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-indigo-500/40 hover:border-indigo-400 shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 space-y-4 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-black text-indigo-400 px-3 py-1 rounded-xl bg-indigo-950 border border-indigo-800">
                STEP_04
              </span>
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                <Star className="w-5 h-5" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-black text-white group-hover:text-indigo-300 transition">
                Inspect Photo Proof & Rate Quality
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Inspect mandatory ground after-photos uploaded by field officers and provide star feedback.
              </p>
            </div>

            {/* Interactive Star Rating Widget */}
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400">Quality Rating</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    onMouseEnter={() => setHoverRating(star)}
                    className={`w-3.5 h-3.5 cursor-pointer transition ${
                      star <= hoverRating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
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
