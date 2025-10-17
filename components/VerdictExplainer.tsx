import React from 'react';
import CheckIcon from './icons/CheckIcon';
import StopIcon from './icons/StopIcon';

interface VerdictExplainerProps {
  pros: string[];
  cons: string[];
}

const VerdictExplainer: React.FC<VerdictExplainerProps> = ({ pros, cons }) => {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Pros */}
      <div>
        <h3 className="text-xl font-bold text-green-400 mb-4">Pros</h3>
        <ul className="space-y-3">
          {pros.map((pro, index) => (
            <li key={index} className="flex items-start">
              <CheckIcon className="w-5 h-5 mr-3 mt-1 text-green-400 flex-shrink-0" />
              <span className="text-slate-300">{pro}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Cons */}
      <div>
        <h3 className="text-xl font-bold text-red-400 mb-4">Cons</h3>
        <ul className="space-y-3">
          {cons.map((con, index) => (
            <li key={index} className="flex items-start">
              <StopIcon className="w-5 h-5 mr-3 mt-1 text-red-400 flex-shrink-0" />
              <span className="text-slate-300">{con}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VerdictExplainer;
