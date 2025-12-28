import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "", size = 40, glow = false }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full ${glow ? 'animate-breathe' : 'drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`}
      >
        {/* Outer Shield / Hexagon Frame */}
        <path 
          d="M50 5L90 25V75L50 95L10 75V25L50 5Z" 
          stroke="url(#logo-gradient)" 
          strokeWidth="4" 
          strokeLinejoin="round"
        />
        
        {/* Abstract 'V' and 'A' Hybrid */}
        <path 
          d="M30 35L50 75L70 35" 
          stroke="white" 
          strokeWidth="6" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        
        {/* AI Circuit Points */}
        <circle cx="50" cy="75" r="4" fill="#f59e0b" />
        <circle cx="30" cy="35" r="3" fill="white" />
        <circle cx="70" cy="35" r="3" fill="white" />
        
        {/* Inner Circuit Lines */}
        <path d="M50 5V20" stroke="url(#logo-gradient)" strokeWidth="2" strokeLinecap="round" />
        <path d="M50 95V85" stroke="url(#logo-gradient)" strokeWidth="2" strokeLinecap="round" />
        
        <defs>
          <linearGradient id="logo-gradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f59e0b" />
            <stop offset="0.5" stopColor="#fbbf24" />
            <stop offset="1" stopColor="#b45309" />
          </linearGradient>
        </defs>
      </svg>
      {/* Dynamic background glow */}
      <div className={`absolute inset-0 bg-amber-500/10 blur-[100px] rounded-full -z-10 ${glow ? 'scale-150 opacity-40 animate-pulse' : 'blur-xl'}`}></div>
    </div>
  );
};

export default Logo;