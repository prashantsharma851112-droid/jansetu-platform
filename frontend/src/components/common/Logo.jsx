import React from 'react';

export default function Logo({ size = 'md', className = '' }) {
  const dimensions = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }[size] || 'w-10 h-10';

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${dimensions} ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logo-home-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#14b8a6" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
          <filter id="home-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#14b8a6" floodOpacity="0.4" />
          </filter>
        </defs>
        
        {/* Modern House / Home Icon Shape */}
        <path
          d="M 50 7
             C 52.5 7, 54.5 8.5, 56.5 10.2
             L 89 36.5
             C 93 39.8, 93.5 45.5, 89.5 48.8
             C 87.5 50.5, 84.5 50.5, 82 48.5
             L 80 47
             L 80 82
             C 80 88.5, 74.5 94, 68 94
             L 32 94
             C 25.5 94, 20 88.5, 20 82
             L 20 47
             L 18 48.5
             C 15.5 50.5, 12.5 50.5, 10.5 48.8
             C 6.5 45.5, 7 39.8, 11 36.5
             L 43.5 10.2
             C 45.5 8.5, 47.5 7, 50 7 Z"
          fill="url(#logo-home-gradient)"
          filter="url(#home-glow)"
        />
        
        {/* JS Text Centered Inside Home Icon */}
        <text
          x="50"
          y="66"
          textAnchor="middle"
          fill="#020617"
          fontWeight="900"
          fontSize="31"
          letterSpacing="-0.5"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          JS
        </text>
      </svg>
    </div>
  );
}
