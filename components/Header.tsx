import React from 'react';

interface HeaderProps {
  showNewAnalysisButton: boolean;
  onNewAnalysis: () => void;
}

const Header: React.FC<HeaderProps> = ({ showNewAnalysisButton, onNewAnalysis }) => {
  return (
    <header className="bg-slate-800/50 backdrop-blur-sm shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Property <span className="text-cyan-400">Scout</span>
          </h1>
        </div>
        {showNewAnalysisButton && (
           <button 
            onClick={onNewAnalysis} 
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-md text-sm transition-colors duration-200"
          >
            Start New Analysis
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;