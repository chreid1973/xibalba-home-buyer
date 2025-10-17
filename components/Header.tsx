import React from 'react';
import UserMenu from './UserMenu';
// FIX: Corrected import path
import type { AppUser } from '../src/services/authService';

interface HeaderProps {
  user: AppUser | null;
  onLoginClick: () => void;
  onLogout: () => void;
  onShowDashboard: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLoginClick, onLogout, onShowDashboard }) => {
  return (
    <header className="py-4 px-6 md:px-12 flex justify-between items-center bg-transparent backdrop-blur-sm sticky top-0 z-40 border-b border-purple-500/10">
      <div className="flex items-center">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
            <path d="M12 2L2 7V21H22V7L12 2Z" fill="url(#logo-gradient-header)"/>
            <defs>
                <linearGradient id="logo-gradient-header" x1="2" y1="2" x2="22" y2="21" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#a855f7"/>
                    <stop offset="1" stopColor="#3b82f6"/>
                </linearGradient>
            </defs>
        </svg>
        <h1 className="text-2xl font-bold text-white tracking-tight">Property Scout</h1>
      </div>
      <nav>
        {user ? (
          <UserMenu userEmail={user.email!} onLogout={onLogout} onShowDashboard={onShowDashboard} />
        ) : (
          <button 
            onClick={onLoginClick}
            className="bg-purple-600/50 hover:bg-purple-600 text-white font-semibold py-2 px-5 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Login
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;