
import React, { useState, useEffect } from 'react';
import type { User } from '../src/types';
import UserMenu from './UserMenu';

interface HeaderProps {
  showNewAnalysisButton: boolean;
  onNewAnalysis: () => void;
  currentUser: User | null;
  onShowAuth: () => void;
  onLogout: () => void;
  onShowDashboard: () => void;
}

const Header: React.FC<HeaderProps> = ({ showNewAnalysisButton, onNewAnalysis, currentUser, onShowAuth, onLogout, onShowDashboard }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-indigo-950/50 backdrop-blur-lg border-b border-purple-500/20' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3">
            <path d="M12 2L2 7V21H22V7L12 2Z" fill="url(#logo-gradient)"/>
            <path d="M7 12H10V15H7V12Z" fill="#1A1A3D"/>
            <path d="M10.5 12H13.5V18H10.5V12Z" fill="#1A1A3D"/>
            <path d="M14 8H17V15H14V8Z" fill="#1A1A3D"/>
            <defs>
              <linearGradient id="logo-gradient" x1="2" y1="2" x2="22" y2="21" gradientUnits="userSpaceOnUse">
                <stop stopColor="#a855f7"/>
                <stop offset="1" stopColor="#3b82f6"/>
              </linearGradient>
            </defs>
          </svg>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Property <span className="text-purple-400">Scout</span>
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          {showNewAnalysisButton && (
             <button 
              onClick={onNewAnalysis} 
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md text-sm transition-all duration-200 transform hover:scale-105 shadow-lg shadow-purple-500/20 hidden sm:block"
            >
              Start New Analysis
            </button>
          )}
          {currentUser ? (
            <UserMenu 
              userEmail={currentUser.email} 
              onLogout={onLogout} 
              onShowDashboard={onShowDashboard}
            />
          ) : (
            <button 
              onClick={onShowAuth}
              className="border border-purple-500 text-purple-300 hover:bg-purple-500/20 hover:text-white font-semibold py-2 px-4 rounded-md text-sm transition-all duration-200"
            >
              Login / Sign Up
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
