import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useTime, useTransform } from 'framer-motion';
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
    allowRegister: true,
    icon: User,
    color: 'from-teal-500 to-emerald-400',
    borderColor: 'border-teal-500/50',
    ringColor: 'ring-teal-500/30',
    glowColor: 'shadow-teal-500/30',
    path: '/citizen',
    description: 'Report local municipal problems with pin-drop Leaflet maps, multi-photo evidence uploads, upvote nearby community concerns, and track live courier-style timeline updates.',
    features: ['5-Step Animated Wizard', 'Interactive Pin-Drop Map', '1-Click Community Upvoting', 'Courier Timeline'],
  },
  {
    id: 'WORKER',
    title: 'Field Worker Operations App',
    badge: 'Operations Staff',
    role: 'Municipal Worker',
    allowRegister: false,
    icon: Wrench,
    color: 'from-amber-500 to-yellow-400',
    borderColor: 'border-amber-500/50',
    ringColor: 'ring-amber-500/30',
    glowColor: 'shadow-amber-500/30',
    path: '/worker',
    description: 'Ground workforce dashboard to view assigned tickets, claim unassigned departmental tasks, upload mandatory proof-of-work after-photos, and update stage remarks.',
    features: ['My Tasks & Pool', '1-Click Ticket Claim', 'Mandatory After Proof', 'Real-time Resolution Stats'],
  },
  {
    id: 'ADMIN',
    title: 'Executive Command Center',
    badge: 'City Administration',
    role: 'Municipal Admin',
    allowRegister: false,
    icon: Shield,
    color: 'from-indigo-500 to-cyan-400',
    borderColor: 'border-indigo-500/50',
    ringColor: 'ring-indigo-500/30',
    glowColor: 'shadow-indigo-500/30',
    path: '/admin',
    description: 'Administrative command center equipped with city spatial heatmaps, dynamic category customizers, SLA overdue ticket escalation engine, and 1-click CSV report exports.',
    features: ['KPI Analytics', 'Spatial Heatmap & Density', 'Dynamic Category Manager', 'SLA Overdue Engine'],
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

const stepItems = [
  {
    id: 1,
    badge: 'STEP_01',
    title: 'Pick Category & Photo Evidence',
    desc: 'Choose from 12 civic categories (Roads, Water, Sanitation) and upload photo evidence.',
    icon: Camera,
    borderColor: 'border-teal-500/40 hover:border-teal-400',
    glowColor: 'shadow-teal-500/20',
    tagColor: 'text-teal-400',
    tagBg: 'bg-teal-950',
    tagBorder: 'border-teal-800',
    iconBg: 'bg-teal-500/10',
    iconColor: 'text-teal-400',
    iconBorder: 'border-teal-500/30',
  },
  {
    id: 2,
    badge: 'STEP_02',
    title: 'Interactive Pin Drop & GPS',
    desc: 'Drop pin on OpenStreetMap or tap "My Location" for precise reverse geocoding.',
    icon: MapPin,
    borderColor: 'border-cyan-500/40 hover:border-cyan-400',
    glowColor: 'shadow-cyan-500/20',
    tagColor: 'text-cyan-400',
    tagBg: 'bg-cyan-950',
    tagBorder: 'border-cyan-800',
    iconBg: 'bg-cyan-500/10',
    iconColor: 'text-cyan-400',
    iconBorder: 'border-cyan-500/30',
  },
  {
    id: 3,
    badge: 'STEP_03',
    title: 'Live Courier Timeline Progress',
    desc: 'Watch ticket status move stage by stage with real-time Socket.io notifications.',
    icon: Activity,
    borderColor: 'border-amber-500/40 hover:border-amber-400',
    glowColor: 'shadow-amber-500/20',
    tagColor: 'text-amber-400',
    tagBg: 'bg-amber-950',
    tagBorder: 'border-amber-800',
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-400',
    iconBorder: 'border-amber-500/30',
  },
  {
    id: 4,
    badge: 'STEP_04',
    title: 'Inspect Photo Proof & Rate',
    desc: 'Inspect mandatory ground after-photos uploaded by field officers and rate feedback.',
    icon: Star,
    borderColor: 'border-indigo-500/40 hover:border-indigo-400',
    glowColor: 'shadow-indigo-500/20',
    tagColor: 'text-indigo-400',
    tagBg: 'bg-indigo-950',
    tagBorder: 'border-indigo-800',
    iconBg: 'bg-indigo-500/10',
    iconColor: 'text-indigo-400',
    iconBorder: 'border-indigo-500/30',
  },
];

function RoleOrbitCarousel({ isMobile }) {
  const [isPaused, setIsPaused] = useState(false);
  const [manualAngle, setManualAngle] = useState(0);

  const rawTime = useTime();
  const pauseStartRef = useRef(null);
  const totalPausedTimeRef = useRef(0);

  const effectiveTime = useTransform(rawTime, (t) => {
    if (isPaused) {
      if (pauseStartRef.current === null) {
        pauseStartRef.current = t;
      }
      return pauseStartRef.current - totalPausedTimeRef.current;
    } else {
      if (pauseStartRef.current !== null) {
        totalPausedTimeRef.current += t - pauseStartRef.current;
        pauseStartRef.current = null;
      }
      return t - totalPausedTimeRef.current;
    }
  });

  const handleDrag = (event, info) => {
    setManualAngle((prev) => prev + info.delta.x * 0.7);
  };

  return (
    <div
      onClick={() => setIsPaused((prev) => !prev)}
      className="relative py-1 flex flex-col items-center justify-center min-h-[310px] sm:min-h-[350px] select-none cursor-pointer"
    >


      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDrag={handleDrag}
        className="relative w-full max-w-xs sm:max-w-md h-[290px] sm:h-[330px] flex items-center justify-center z-10 touch-pan-x cursor-grab active:cursor-grabbing"
      >
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

        {roleCards.map((card, idx) => (
          <RoleOrbitCard
            key={card.id}
            card={card}
            idx={idx}
            time={effectiveTime}
            manualAngle={manualAngle}
            isMobile={isMobile}
            isPaused={isPaused}
            setIsPaused={setIsPaused}
          />
        ))}
      </motion.div>
    </div>
  );
}

function RoleOrbitCard({ card, idx, time, manualAngle, isMobile, isPaused, setIsPaused }) {
  const IconComp = card.icon;
  const radius = isMobile ? 90 : 180;
  const period = 12000;

  const phase = (idx * 2 * Math.PI) / 3;

  const angleRad = useTransform(time, (t) => (t / period) * 2 * Math.PI + phase + (manualAngle * Math.PI) / 180);

  const x = useTransform(angleRad, (a) => Math.sin(a) * radius);
  const cosVal = useTransform(angleRad, (a) => Math.cos(a));
  const scale = useTransform(cosVal, (c) => 0.82 + (c + 1) * 0.115);
  const opacity = useTransform(cosVal, (c) => 0.45 + (c + 1) * 0.275);
  const zIndex = useTransform(cosVal, (c) => Math.round((c + 1) * 20));

  return (
    <motion.div
      style={{
        x,
        scale,
        opacity,
        zIndex,
      }}
      onClick={(e) => {
        e.stopPropagation();
        setIsPaused((prev) => !prev);
      }}
      className={`absolute w-[88%] sm:w-full p-4 sm:p-6 rounded-3xl bg-slate-900/95 backdrop-blur-xl border ${
        isPaused ? 'border-amber-500/80 ring-2 ring-amber-500/30 shadow-amber-500/20' : 'border-teal-500/40 shadow-teal-500/20'
      } shadow-2xl text-left space-y-2.5 sm:space-y-3 transform-gpu cursor-pointer`}
    >
      <div className="flex items-center justify-between">
        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr ${card.color} text-slate-950 flex items-center justify-center font-bold shadow-lg`}>
          <IconComp className="w-5 h-5" />
        </div>
        <span className="text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
          {card.badge}
        </span>
      </div>

      <div>
        <h3 className="text-base sm:text-lg font-black text-white">{card.title}</h3>
        <p className="text-[11px] sm:text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">{card.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-1.5 pt-1">
        {card.features.map((feat, fIdx) => (
          <div key={fIdx} className="text-[9px] sm:text-[10px] font-semibold text-slate-300 bg-slate-950/60 p-1.5 rounded-lg border border-slate-800 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-teal-400 shrink-0" />
            <span className="line-clamp-1">{feat}</span>
          </div>
        ))}
      </div>

      <div className="pt-1.5 flex gap-2">
        <Link
          to="/login"
          onClick={(e) => e.stopPropagation()}
          className={`flex-1 py-2 rounded-xl bg-gradient-to-r ${card.color} text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg hover:scale-[1.02] transition`}
        >
          Sign In <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        {card.allowRegister && (
          <Link
            to="/register"
            onClick={(e) => e.stopPropagation()}
            className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs border border-slate-700 transition"
          >
            Register
          </Link>
        )}
      </div>
    </motion.div>
  );
}

function WorkflowVerticalLoop({ isMobile }) {
  const [isPaused, setIsPaused] = useState(false);
  const [manualAngle, setManualAngle] = useState(0);

  const rawTime = useTime();
  const pauseStartRef = useRef(null);
  const totalPausedTimeRef = useRef(0);

  const effectiveTime = useTransform(rawTime, (t) => {
    if (isPaused) {
      if (pauseStartRef.current === null) {
        pauseStartRef.current = t;
      }
      return pauseStartRef.current - totalPausedTimeRef.current;
    } else {
      if (pauseStartRef.current !== null) {
        totalPausedTimeRef.current += t - pauseStartRef.current;
        pauseStartRef.current = null;
      }
      return t - totalPausedTimeRef.current;
    }
  });

  const handleDrag = (event, info) => {
    setManualAngle((prev) => prev - info.delta.y * 0.7);
  };

  return (
    <div
      onClick={() => setIsPaused((prev) => !prev)}
      className="relative py-1 flex flex-col items-center justify-center min-h-[310px] sm:min-h-[350px] select-none cursor-pointer"
    >


      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.1}
        onDrag={handleDrag}
        className="relative w-full max-w-xs sm:max-w-xl h-[290px] sm:h-[330px] flex items-center justify-center z-10 touch-pan-y cursor-grab active:cursor-grabbing"
      >
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

        {verticalFlowNodes.map((node, idx) => (
          <WorkflowNodeCard
            key={node.id}
            node={node}
            idx={idx}
            time={effectiveTime}
            manualAngle={manualAngle}
            isMobile={isMobile}
            isPaused={isPaused}
            setIsPaused={setIsPaused}
          />
        ))}
      </motion.div>
    </div>
  );
}

function WorkflowNodeCard({ node, idx, time, manualAngle, isMobile, isPaused, setIsPaused }) {
  const IconComp = node.icon;
  const radius = isMobile ? 100 : 135;
  const period = 14000;

  const phase = (idx * Math.PI) / 2;

  const angleRad = useTransform(time, (t) => (t / period) * 2 * Math.PI + phase + (manualAngle * Math.PI) / 180);

  const y = useTransform(angleRad, (a) => Math.sin(a) * radius);
  const cosVal = useTransform(angleRad, (a) => Math.cos(a));
  const scale = useTransform(cosVal, (c) => 0.82 + (c + 1) * 0.115);
  const opacity = useTransform(cosVal, (c) => 0.4 + (c + 1) * 0.3);
  const zIndex = useTransform(cosVal, (c) => Math.round((c + 1) * 20));

  return (
    <motion.div
      style={{
        y,
        scale,
        opacity,
        zIndex,
      }}
      onClick={(e) => {
        e.stopPropagation();
        setIsPaused((prev) => !prev);
      }}
      className={`absolute w-[90%] sm:w-full p-4 sm:p-6 rounded-3xl bg-slate-900/95 backdrop-blur-2xl border ${
        isPaused ? 'border-amber-500/80 ring-2 ring-amber-500/30 shadow-amber-500/20' : `${node.color} ring-2 ring-teal-500/30 ${node.glow}`
      } shadow-2xl text-left space-y-2.5 transform-gpu cursor-pointer`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-black shadow shrink-0">
            <IconComp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-mono uppercase font-bold text-teal-400 tracking-wider block">
              {node.badge}
            </span>
            <h3 className="text-sm sm:text-base font-black text-white">{node.title}</h3>
          </div>
        </div>
        <span className="text-[10px] font-mono font-black text-slate-500 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800">
          {node.step} / 04
        </span>
      </div>

      <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
        {node.desc}
      </p>

      <div className="flex items-center justify-between text-[10px] font-bold pt-0.5">
        <span className="text-teal-400 flex items-center gap-1.5">
          <GitCommit className="w-3 h-3" /> Energy Thread Connected
        </span>
        <span className="text-slate-400 text-[9px]">{isPaused ? 'Paused — Click to Resume' : 'Click to Freeze & Read'}</span>
      </div>
    </motion.div>
  );
}

function StepsWaveCarousel({ isMobile }) {
  const [isPaused, setIsPaused] = useState(false);
  const rawTime = useTime();
  const pauseStartRef = useRef(null);
  const totalPausedTimeRef = useRef(0);

  const effectiveTime = useTransform(rawTime, (t) => {
    if (isPaused) {
      if (pauseStartRef.current === null) pauseStartRef.current = t;
      return pauseStartRef.current - totalPausedTimeRef.current;
    } else {
      if (pauseStartRef.current !== null) {
        totalPausedTimeRef.current += t - pauseStartRef.current;
        pauseStartRef.current = null;
      }
      return t - totalPausedTimeRef.current;
    }
  });

  const [activeCategoryIdx, setActiveCategoryIdx] = useState(0);
  const [progressVal, setProgressVal] = useState(75);

  useEffect(() => {
    const catInterval = setInterval(() => {
      setActiveCategoryIdx((prev) => (prev + 1) % 4);
    }, 2500);
    const progInterval = setInterval(() => {
      setProgressVal((prev) => (prev >= 100 ? 25 : prev + 25));
    }, 3000);

    return () => {
      clearInterval(catInterval);
      clearInterval(progInterval);
    };
  }, []);

  return (
    <div
      onClick={() => setIsPaused((prev) => !prev)}
      className="relative py-1 flex flex-col items-center justify-center select-none cursor-pointer"
    >


      <div className="relative w-full max-w-7xl min-h-[300px] flex items-center justify-center z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
          {stepItems.map((step, idx) => (
            <StepWaveCard
              key={step.id}
              step={step}
              idx={idx}
              time={effectiveTime}
              isPaused={isPaused}
              setIsPaused={setIsPaused}
              activeCategoryIdx={activeCategoryIdx}
              progressVal={progressVal}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function StepWaveCard({ step, idx, time, isPaused, setIsPaused, activeCategoryIdx, progressVal }) {
  const IconComp = step.icon;

  const phase = (idx * Math.PI) / 2;
  const period = 5000;

  const waveVal = useTransform(time, (t) => Math.sin((t / period) * 2 * Math.PI + phase));
  const cosVal = useTransform(time, (t) => Math.cos((t / period) * 2 * Math.PI + phase));

  const y = useTransform(waveVal, (v) => v * 12);
  const rotateZ = useTransform(cosVal, (c) => c * 1.8);
  const scale = useTransform(waveVal, (v) => 1 + v * 0.02);

  const categories = [
    { name: '🛠️ Potholes', color: 'bg-teal-950 text-teal-300 border-teal-800' },
    { name: '💧 Water Leak', color: 'bg-cyan-950 text-cyan-300 border-cyan-800' },
    { name: '⚡ Power Out', color: 'bg-amber-950 text-amber-300 border-amber-800' },
    { name: '🚮 Sanitation', color: 'bg-indigo-950 text-indigo-300 border-indigo-800' },
  ];

  return (
    <motion.div
      style={{
        y,
        rotateZ,
        scale,
      }}
      onClick={(e) => {
        e.stopPropagation();
        setIsPaused((prev) => !prev);
      }}
      className={`p-3.5 sm:p-4 rounded-2xl bg-slate-900/95 backdrop-blur-xl border ${
        isPaused ? 'border-amber-500/80 ring-2 ring-amber-500/30 shadow-amber-500/20' : `${step.borderColor} ${step.glowColor}`
      } shadow-xl transition-colors duration-300 space-y-2.5 group relative overflow-hidden transform-gpu cursor-pointer text-left`}
    >
      <div className="flex items-center justify-between">
        <span className={`text-[10px] font-mono font-black ${step.tagColor} px-2.5 py-0.5 rounded-lg ${step.tagBg} border ${step.tagBorder}`}>
          {step.badge}
        </span>
        <div className={`w-8 h-8 rounded-xl ${step.iconBg} ${step.iconColor} border ${step.iconBorder} flex items-center justify-center font-bold shadow`}>
          <IconComp className="w-4 h-4" />
        </div>
      </div>

      <div>
        <h3 className="text-sm sm:text-base font-black text-white group-hover:text-teal-300 transition">
          {step.title}
        </h3>
        <p className="text-[11px] sm:text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
          {step.desc}
        </p>
      </div>

      {step.id === 1 && (
        <div className="p-2 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
          <span className="text-[9px] uppercase font-bold text-slate-500 block flex items-center justify-between">
            <span>Auto Category Select</span>
            <span className="text-teal-400 font-mono">Live Sync</span>
          </span>
          <div className="flex items-center gap-1 flex-wrap">
            {categories.map((cat, cIdx) => (
              <span
                key={cIdx}
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded border transition-all duration-500 ${
                  activeCategoryIdx === cIdx ? `${cat.color} scale-105 shadow-md` : 'bg-slate-900 text-slate-500 border-slate-800 opacity-60'
                }`}
              >
                {cat.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {step.id === 2 && (
        <div className="p-2 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[9px] font-bold text-slate-300">OpenStreetMap GPS</span>
          </div>
          <span className="text-[9px] font-mono text-cyan-400 font-bold animate-pulse">28.6139° N, 77.2090° E</span>
        </div>
      )}

      {step.id === 3 && (
        <div className="p-2 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-[9px] font-bold">
            <span className="text-amber-400">
              {progressVal <= 25 ? 'Submitted' : progressVal <= 50 ? 'Dispatched' : progressVal <= 75 ? 'Worker Assigned' : 'Resolved ✅'}
            </span>
            <span className="text-slate-400 font-mono">{progressVal}%</span>
          </div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${progressVal}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full shadow-lg shadow-amber-500/50"
            />
          </div>
        </div>
      )}

      {step.id === 4 && (
        <div className="p-2 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between">
          <span className="text-[9px] font-bold text-slate-400">Citizen SLA Rating</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-3 h-3 text-yellow-400 fill-yellow-400 animate-pulse"
              />
            ))}
            <span className="text-[9px] font-mono font-bold text-yellow-400 ml-1">5.0</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function ContactKineticBeacon({ contactForm, setContactForm, contactSubmitted, handleContactSubmit }) {
  const [isPaused, setIsPaused] = useState(false);
  const rawTime = useTime();
  const pauseStartRef = useRef(null);
  const totalPausedTimeRef = useRef(0);

  const effectiveTime = useTransform(rawTime, (t) => {
    if (isPaused) {
      if (pauseStartRef.current === null) pauseStartRef.current = t;
      return pauseStartRef.current - totalPausedTimeRef.current;
    } else {
      if (pauseStartRef.current !== null) {
        totalPausedTimeRef.current += t - pauseStartRef.current;
        pauseStartRef.current = null;
      }
      return t - totalPausedTimeRef.current;
    }
  });

  const c1X = useTransform(effectiveTime, (t) => Math.sin((t / 3500) * 2 * Math.PI) * 8);
  const c1Y = useTransform(effectiveTime, (t) => Math.cos((t / 3500) * 2 * Math.PI) * 4);

  const c2X = useTransform(effectiveTime, (t) => Math.sin((t / 3500) * 2 * Math.PI + Math.PI) * 8);
  const c2Y = useTransform(effectiveTime, (t) => Math.cos((t / 3500) * 2 * Math.PI + Math.PI) * 4);

  const c3Y = useTransform(effectiveTime, (t) => Math.sin((t / 4000) * 2 * Math.PI + Math.PI / 2) * 6);

  return (
    <div
      onClick={() => setIsPaused((prev) => !prev)}
      className="relative w-full flex flex-col items-center justify-center select-none cursor-pointer space-y-2"
    >


      <div className="grid md:grid-cols-3 gap-4 w-full">
        <div className="space-y-3">
          <motion.div
            style={{ x: c1X, y: c1Y }}
            onClick={(e) => {
              e.stopPropagation();
              setIsPaused((prev) => !prev);
            }}
            className={`p-3.5 rounded-2xl bg-slate-900/95 border ${
              isPaused ? 'border-amber-500/80 ring-2 ring-amber-500/30' : 'border-teal-500/40 shadow-teal-500/10'
            } border shadow-xl flex items-center justify-between gap-3 transform-gpu cursor-pointer text-left`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30 flex items-center justify-center shrink-0 font-bold shadow">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[9px] text-slate-400 uppercase font-bold block">Toll-Free Helpline</span>
                <span className="text-xs sm:text-sm font-bold text-white">1800-11-JANSETU</span>
              </div>
            </div>
            <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800 shrink-0 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> 24x7 Active
            </span>
          </motion.div>

          <motion.div
            style={{ x: c2X, y: c2Y }}
            onClick={(e) => {
              e.stopPropagation();
              setIsPaused((prev) => !prev);
            }}
            className={`p-3.5 rounded-2xl bg-slate-900/95 border ${
              isPaused ? 'border-amber-500/80 ring-2 ring-amber-500/30' : 'border-cyan-500/40 shadow-cyan-500/10'
            } border shadow-xl flex items-center justify-between gap-3 transform-gpu cursor-pointer text-left`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0 font-bold shadow">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[9px] text-slate-400 uppercase font-bold block">Official Support Email</span>
                <span className="text-xs sm:text-sm font-bold text-white">support@jansetu.gov.in</span>
              </div>
            </div>
            <span className="text-[9px] font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded-full border border-cyan-800 shrink-0 flex items-center gap-1">
              <Zap className="w-2.5 h-2.5" /> &lt;15m Response
            </span>
          </motion.div>

          <motion.div
            style={{ y: c3Y }}
            onClick={(e) => {
              e.stopPropagation();
              setIsPaused((prev) => !prev);
            }}
            className={`p-3.5 rounded-2xl bg-slate-900/95 border ${
              isPaused ? 'border-amber-500/80 ring-2 ring-amber-500/30' : 'border-indigo-500/40 shadow-indigo-500/10'
            } border shadow-xl flex items-center justify-between gap-3 transform-gpu cursor-pointer text-left`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0 font-bold shadow">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[9px] text-slate-400 uppercase font-bold block">Central Headquarters</span>
                <span className="text-xs sm:text-sm font-bold text-white">Civic Center, ND</span>
              </div>
            </div>
            <span className="text-[9px] font-mono font-bold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded-full border border-indigo-800 shrink-0 flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5" /> Live GPS HQ
            </span>
          </motion.div>
        </div>

        <div
          onClick={(e) => e.stopPropagation()}
          className="md:col-span-2 bg-slate-900/95 border border-slate-800 hover:border-teal-500/50 rounded-3xl p-4 sm:p-5 space-y-2.5 shadow-2xl relative overflow-hidden text-left cursor-default transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-teal-400" /> Send Inquiry / Public Feedback
            </h3>
            <span className="text-[9px] font-mono text-emerald-400 font-bold px-2 py-0.5 bg-emerald-950 rounded-lg border border-emerald-800">
              Direct Desk Dispatch
            </span>
          </div>

          {contactSubmitted ? (
            <div className="p-4 bg-emerald-950/60 border border-emerald-800 rounded-2xl text-center space-y-1">
              <Check className="w-6 h-6 text-emerald-400 mx-auto animate-bounce" />
              <h4 className="text-xs font-bold text-emerald-300">Message Received!</h4>
              <p className="text-[10px] text-slate-400">Thank you for reaching out. Our municipal desk will respond shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-300 block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Sharma"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full text-xs p-2 bg-slate-950 border border-slate-800 text-white rounded-xl outline-none focus:ring-1 focus:ring-teal-500 transition"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-300 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@gmail.com"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full text-xs p-2 bg-slate-950 border border-slate-800 text-white rounded-xl outline-none focus:ring-1 focus:ring-teal-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-300 block mb-1">Message / Suggestion</label>
                <textarea
                  rows={2}
                  required
                  placeholder="How can we assist you?"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full text-xs p-2 bg-slate-950 border border-slate-800 text-white rounded-xl outline-none focus:ring-1 focus:ring-teal-500 transition"
                />
              </div>

              <button
                type="submit"
                className="bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-black text-xs px-4 py-2 rounded-xl shadow-lg transition flex items-center justify-center gap-2 group"
              >
                Send Inquiry <Send className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState(0);
  const [hoverRating, setHoverRating] = useState(5);
  const [stats, setStats] = useState({ total: 50, resolved: 32, rate: '92.4%' });
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 640 : false);

  const containerRef = useRef(null);
  const isScrolling = useRef(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Wheel & Touch Elevator Section Switcher
  useEffect(() => {
    let touchStartY = 0;

    const handleWheel = (e) => {
      e.preventDefault();
      if (isScrolling.current) return;

      if (e.deltaY > 20) {
        isScrolling.current = true;
        setActiveSection((prev) => Math.min(prev + 1, 3));
        setTimeout(() => { isScrolling.current = false; }, 750);
      } else if (e.deltaY < -20) {
        isScrolling.current = true;
        setActiveSection((prev) => Math.max(prev - 1, 0));
        setTimeout(() => { isScrolling.current = false; }, 750);
      }
    };

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      if (isScrolling.current) return;
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;

      if (diff > 35) {
        isScrolling.current = true;
        setActiveSection((prev) => Math.min(prev + 1, 3));
        setTimeout(() => { isScrolling.current = false; }, 750);
      } else if (diff < -35) {
        isScrolling.current = true;
        setActiveSection((prev) => Math.max(prev - 1, 0));
        setTimeout(() => { isScrolling.current = false; }, 750);
      }
    };

    const handleKeyDown = (e) => {
      if (isScrolling.current) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        isScrolling.current = true;
        setActiveSection((prev) => Math.min(prev + 1, 3));
        setTimeout(() => { isScrolling.current = false; }, 750);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        isScrolling.current = true;
        setActiveSection((prev) => Math.max(prev - 1, 0));
        setTimeout(() => { isScrolling.current = false; }, 750);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      container.addEventListener('touchstart', handleTouchStart, { passive: true });
      container.addEventListener('touchend', handleTouchEnd, { passive: true });
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchend', handleTouchEnd);
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    try {
      await API.post('/admin/inquiry/public', contactForm);
      setContactSubmitted(true);
      setTimeout(() => {
        setContactForm({ name: '', email: '', message: '' });
        setContactSubmitted(false);
      }, 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send inquiry. Please try again.');
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[calc(100vh-4rem)] overflow-hidden bg-slate-950 text-white selection:bg-teal-500 selection:text-slate-950 font-sans select-none"
    >
      {/* RIGHT SIDE SECTION INDICATOR DOTS */}
      <div className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2.5 items-center">
        {[0, 1, 2, 3].map((idx) => (
          <button
            key={idx}
            onClick={() => setActiveSection(idx)}
            className={`w-2.5 rounded-full transition-all duration-500 ${
              activeSection === idx
                ? 'bg-gradient-to-b from-teal-400 to-emerald-400 h-7 shadow-lg shadow-teal-500/50'
                : 'bg-slate-800 hover:bg-slate-700 h-2.5'
            }`}
            title={`Go to Section ${idx + 1}`}
          />
        ))}
      </div>

      {/* 1. REGISTER / LOGIN ROLE PORTAL CAROUSEL SECTION */}
      <motion.section
        initial={false}
        animate={{
          y: activeSection === 0 ? '0px' : activeSection > 0 ? '-40px' : '50px',
          scale: activeSection === 0 ? 1 : activeSection > 0 ? 0.94 : 1.04,
          opacity: activeSection === 0 ? 1 : 0,
          filter: activeSection === 0 ? 'blur(0px) brightness(1)' : 'blur(12px) brightness(0.2)',
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          zIndex: activeSection === 0 ? 30 : 10,
          pointerEvents: activeSection === 0 ? 'auto' : 'none',
        }}
        className="absolute inset-0 w-full h-full bg-slate-950 flex flex-col justify-start sm:justify-center px-4 sm:px-8 pt-16 sm:pt-20 pb-6 transform-gpu overflow-y-auto custom-scrollbar"
      >
        <div className="max-w-6xl mx-auto px-2 sm:px-6 lg:px-8 text-center space-y-3 w-full">
          {/* Section 1 Header */}
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest font-mono font-black text-teal-400 px-3 py-0.5 rounded-full bg-teal-950/80 border border-teal-800/80 inline-flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-teal-400" /> Portal Access & Registration
            </span>
            <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
              Select Role & Launch Portal (Sign In / Register)
            </h2>
          </div>

          {/* Continuous Un-mirrored 2D Planar Orbital Trajectory Carousel */}
          <RoleOrbitCarousel isMobile={isMobile} />
        </div>
      </motion.section>

      {/* 2. JANSETU RESOLUTION WORKFLOW SECTION */}
      <motion.section
        initial={false}
        animate={{
          y: activeSection === 1 ? '0px' : activeSection > 1 ? '-40px' : '50px',
          scale: activeSection === 1 ? 1 : activeSection > 1 ? 0.94 : 1.04,
          opacity: activeSection === 1 ? 1 : 0,
          filter: activeSection === 1 ? 'blur(0px) brightness(1)' : 'blur(12px) brightness(0.2)',
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          zIndex: activeSection === 1 ? 30 : 10,
          pointerEvents: activeSection === 1 ? 'auto' : 'none',
        }}
        className="absolute inset-0 w-full h-full bg-slate-950 flex flex-col justify-start sm:justify-center px-4 sm:px-8 pt-16 sm:pt-20 pb-6 transform-gpu overflow-y-auto custom-scrollbar"
      >
        <div className="max-w-5xl mx-auto px-2 sm:px-6 lg:px-8 w-full text-center space-y-3">
          {/* Section 2 Header */}
          <div className="max-w-2xl mx-auto space-y-1">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest font-mono font-black text-teal-400 px-3 py-0.5 rounded-full bg-teal-950/80 border border-teal-800/80 inline-flex items-center gap-1.5">
              <GitCommit className="w-3.5 h-3.5 text-teal-400" /> Architecture Pipeline
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
              JanSetu Resolution Workflow
            </h2>
          </div>

          {/* Continuous Upright Vertical Loop */}
          <WorkflowVerticalLoop isMobile={isMobile} />
        </div>
      </motion.section>

      {/* 3. 4 SIMPLE STEPS TO RESOLVE ANY GRIEVANCE SECTION */}
      <motion.section
        initial={false}
        animate={{
          y: activeSection === 2 ? '0px' : activeSection > 2 ? '-40px' : '50px',
          scale: activeSection === 2 ? 1 : activeSection > 2 ? 0.94 : 1.04,
          opacity: activeSection === 2 ? 1 : 0,
          filter: activeSection === 2 ? 'blur(0px) brightness(1)' : 'blur(12px) brightness(0.2)',
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          zIndex: activeSection === 2 ? 30 : 10,
          pointerEvents: activeSection === 2 ? 'auto' : 'none',
        }}
        className="absolute inset-0 w-full h-full bg-slate-950 flex flex-col justify-start sm:justify-center px-4 sm:px-8 pt-16 sm:pt-20 pb-6 transform-gpu overflow-y-auto custom-scrollbar"
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 w-full space-y-4">
          {/* Section 3 Header */}
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest font-mono font-black text-teal-400 px-3 py-0.5 rounded-full bg-teal-950/80 border border-teal-800/80 inline-flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-teal-400" /> Citizen Resolution Guide
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
              4 Simple Steps to Resolve Any Grievance
            </h2>
          </div>

          {/* Dynamic 3D Levitating Wave Holographic Pipeline */}
          <StepsWaveCarousel isMobile={isMobile} />
        </div>
      </motion.section>

      {/* 4. CONTACT & MUNICIPAL SUPPORT SECTION */}
      <motion.section
        initial={false}
        animate={{
          y: activeSection === 3 ? '0px' : '50px',
          scale: activeSection === 3 ? 1 : 1.04,
          opacity: activeSection === 3 ? 1 : 0,
          filter: activeSection === 3 ? 'blur(0px) brightness(1)' : 'blur(12px) brightness(0.2)',
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          zIndex: activeSection === 3 ? 30 : 10,
          pointerEvents: activeSection === 3 ? 'auto' : 'none',
        }}
        className="absolute inset-0 w-full h-full bg-slate-950 flex flex-col justify-between px-4 sm:px-8 pt-16 sm:pt-20 pb-4 transform-gpu overflow-y-auto custom-scrollbar"
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 w-full space-y-4">
          {/* Section 4 Header */}
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest font-mono font-black text-emerald-400 px-3 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/80 inline-flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" /> Public Helpline & Assistance
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
              Contact & Municipal Support
            </h2>
          </div>

          {/* Kinetic Support Beacon Component */}
          <ContactKineticBeacon
            contactForm={contactForm}
            setContactForm={setContactForm}
            contactSubmitted={contactSubmitted}
            handleContactSubmit={handleContactSubmit}
          />
        </div>

        {/* Footer inside Section 4 */}
        <footer className="border-t border-slate-900/80 pt-2 text-center text-[10px] text-slate-600">
          JanSetu Civic Tech Platform © 2026 — Bridging Citizens & Municipal Governance.
        </footer>
      </motion.section>
    </div>
  );
}
