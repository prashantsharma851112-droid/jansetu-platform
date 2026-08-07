import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from './NotificationBell';
import UserProfileModal from './UserProfileModal';
import { Building2, LogOut, Shield, Wrench, User, PlusCircle, MapPin } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return <span className="bg-indigo-900/80 text-indigo-200 border border-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Shield className="w-3 h-3" /> Admin</span>;
      case 'WORKER':
        return <span className="bg-amber-900/80 text-amber-200 border border-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Wrench className="w-3 h-3" /> Field Worker</span>;
      default:
        return <span className="bg-teal-900/80 text-teal-200 border border-teal-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><User className="w-3 h-3" /> Citizen</span>;
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
              JS
            </div>
            <div>
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-teal-400 bg-clip-text text-transparent">
                JanSetu
              </span>
              <span className="block text-[9px] uppercase tracking-widest text-teal-400 font-bold -mt-1">
                Civic Resolution
              </span>
            </div>
          </Link>

          {/* Dynamic Navigation Links based on role */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {user?.role === 'CITIZEN' && (
              <>
                <Link to="/citizen" className="hover:text-teal-400 transition">My Complaints</Link>
                <Link to="/citizen/raise" className="bg-teal-600 hover:bg-teal-500 text-white px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 shadow-md shadow-teal-600/30 transition">
                  <PlusCircle className="w-4 h-4" /> Raise Issue
                </Link>
              </>
            )}

            {user?.role === 'WORKER' && (
              <Link to="/worker" className="text-amber-400 font-semibold hover:underline flex items-center gap-1.5">
                <Wrench className="w-4 h-4" /> Operations Portal
              </Link>
            )}

            {user?.role === 'ADMIN' && (
              <Link to="/admin" className="text-indigo-400 font-semibold hover:underline flex items-center gap-1.5">
                <Shield className="w-4 h-4" /> Command Center
              </Link>
            )}
          </nav>

          {/* User Info & Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <NotificationBell />
                <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                  <button
                    onClick={() => setShowProfile(true)}
                    className="flex items-center gap-2 hover:bg-slate-800 p-1 rounded-xl transition text-left"
                    title="View My Profile"
                  >
                    <img
                      src={user.avatar || 'https://i.pravatar.cc/150'}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border border-slate-700 object-cover"
                    />
                    <div className="hidden sm:block text-left">
                      <span className="block text-xs font-bold text-slate-200 line-clamp-1 hover:text-teal-400">{user.name}</span>
                      {getRoleBadge(user.role)}
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                    title="Logout"
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition ml-1"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition">
                Sign In
              </Link>
              <Link to="/register" className="text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white px-3.5 py-1.5 rounded-lg transition shadow-md">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
    {showProfile && <UserProfileModal user={user} onClose={() => setShowProfile(false)} />}
    </>
  );
}
