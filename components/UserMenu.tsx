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

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2">
        <span className="text-sm text-slate-300 hidden sm:block">{userEmail}</span>
        <div className="w-8 h-8 rounded-full bg-purple-500/50 flex items-center justify-center text-purple-200 font-bold">
          {userEmail.charAt(0).toUpperCase()}
        </div>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-md shadow-lg py-1 z-50 border border-purple-500/20">
          <button
            onClick={() => { onShowDashboard(); setIsOpen(false); }}
            className="block w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-700"
          >
            Dashboard
          </button>
          <button
            onClick={() => { onLogout(); setIsOpen(false); }}
            className="block w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-700"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
