import React from 'react';

interface HeroProps {
  onStartAnalysis: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStartAnalysis }) => {
  return (
    <div className="text-center animate-fade-in py-20">
      <h2 className="text-5xl font-extrabold text-white mb-4 tracking-tight">
        Unlock Your Dream Home
      </h2>
      <p className="max-w-2xl mx-auto text-lg text-slate-300 mb-8">
        Get a personalized, AI-powered analysis of your financial readiness and local market conditions to make a smarter home buying decision.
      </p>
      <button 
        onClick={onStartAnalysis} 
        className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/20"
      >
        Start Your Analysis
      </button>
    </div>
  );
};

export default Hero;