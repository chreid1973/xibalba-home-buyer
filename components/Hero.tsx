import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="text-center my-12">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
        Is It A Good Deal? <span className="text-cyan-400">AI-Powered Real Estate Analysis.</span>
      </h1>
      <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
        Stop guessing. Input property and financial details below to get an instant, data-driven verdict on your next real estate investment, powered by Gemini.
      </p>
    </div>
  );
};

export default Hero;
