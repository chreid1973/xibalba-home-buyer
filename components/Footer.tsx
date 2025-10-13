
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 mt-12 py-6">
      <div className="container mx-auto px-4 text-center text-slate-400">
        <p>&copy; {new Date().getFullYear()} HomeBuyer AI Advisor. All rights reserved.</p>
        <p className="text-sm mt-2">This is an AI-generated analysis and should not be considered professional financial advice. Always consult with a qualified financial advisor.</p>
      </div>
    </footer>
  );
};

export default Footer;
