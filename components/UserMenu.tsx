
import React, { useState, useRef, useEffect } from 'react';

interface UserMenuProps {
  userEmail: string;
  onLogout: () => void;
  onShowDashboard: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ userEmail, onLogout, onShowDashboard }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onShowDashboard();
    setIsOpen(false);
  };
  
  const handleLogoutClick = () => {
    onLogout();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-center w-10 h-10 bg-purple-800 rounded-full text-purple-200 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900">
        {userEmail.charAt(0).toUpperCase()}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-md shadow-lg z-50 border border-purple-500/20 animate-scale-in origin-top-right">
          <div className="py-1">
            <div className="px-4 py-2 text-sm text-slate-300 border-b border-slate-700">
              <p className="font-semibold text-white">Signed in as</p>
              <p className="truncate">{userEmail}</p>
            </div>
            <button onClick={handleDashboardClick} className="block px-4 py-2 text-sm text-slate-300 hover:bg-purple-500/20 hover:text-white w-full text-left">
              My Dashboard
            </button>
            <button
              onClick={handleLogoutClick}
              className="block px-4 py-2 text-sm text-slate-300 hover:bg-purple-500/20 hover:text-white w-full text-left"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
