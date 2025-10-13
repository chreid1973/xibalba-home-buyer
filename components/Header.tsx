
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          HomeBuyer <span className="text-cyan-400">AI Advisor</span>
        </h1>
      </div>
    </header>
  );
};

export default Header;
