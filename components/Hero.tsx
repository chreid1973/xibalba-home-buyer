import React from 'react';

interface HeroProps {
  onStartAnalysis: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStartAnalysis }) => {
  return (
    <div className="text-center py-20 px-4 animate-fade-in">
      <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
        Unlock Your Dream Home with <br />
        <span className="text-purple-400">AI-Powered Insights</span>
      </h2>
      <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-300">
        Property Scout analyzes your finances, the market, and location data to give you a personalized, comprehensive report on your home-buying readiness.
      </p>
      <div className="mt-10">
        <button
          onClick={onStartAnalysis}
          className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 px-12 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/30 hover:shadow-purple-400/40"
        >
          Start Your Free Analysis
        </button>
      </div>
    </div>
  );
};

export default Hero;
