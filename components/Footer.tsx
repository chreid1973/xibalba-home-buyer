import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-slate-400 mt-12">
      <div className="container mx-auto px-4 py-6 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} RealtyAnalyst AI. All rights reserved.</p>
        <p className="mt-2">
          This analysis is powered by Google's Gemini API and is for informational purposes only. It does not constitute financial advice.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
