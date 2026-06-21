import React from 'react';

export default function LoadingScreen({ fullScreen = true, message = "LOADING..." }) {
  const containerClasses = fullScreen 
    ? "fixed inset-0 z-50 flex items-center justify-center bg-[#0A0908]/80 backdrop-blur-sm"
    : "flex py-12 items-center justify-center w-full";

  return (
    <div className={containerClasses}>
      <div className="relative flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center w-24 h-24">
          {/* Animated rings */}
          <div className="absolute inset-0 border-t-2 border-white/70 rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-r-2 border-white rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          <div className="absolute inset-4 border-b-2 border-white rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
          
          {/* Center glowing dot */}
          <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] animate-pulse"></div>
        </div>
        
        {message && (
          <div className="mt-8 text-transparent bg-clip-text bg-gradient-to-r from-white/70 via-white to-white font-bold text-sm tracking-[0.3em] animate-pulse">
            {message}
          </div>
        )}
      </div>
    </div>
);
}
