import React from 'react';
import InfoTooltip from './InfoTooltip';

interface MarketGaugeProps {
  score: number;
}

const MarketGauge: React.FC<MarketGaugeProps> = ({ score }) => {
  const normalizedScore = Math.max(0, Math.min(10, score || 0));
  const angle = (normalizedScore / 10) * 180 - 90;

  let readinessCondition = 'Good Position';
  let color = 'text-yellow-500';
  if (normalizedScore <= 4) {
    readinessCondition = "Proceed with Caution";
    color = "text-red-500";
  }
  if (normalizedScore >= 7) {
    readinessCondition = "Excellent Position";
    color = "text-green-500";
  }

  return (
    <div className="flex flex-col items-center flex-grow">
        <div className="flex justify-center items-center">
            <h3 className="font-bold text-center text-slate-700">Personal Buying Readiness</h3>
            <InfoTooltip text="This score (1-10) evaluates your personal financial readiness combined with current market conditions. A higher score indicates you are in a stronger position to buy." />
        </div>
        <div className="relative w-64 h-32 mt-2">
            <svg viewBox="0 0 100 50" className="w-full absolute top-0">
                <defs>
                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f87171" /> 
                        <stop offset="50%" stopColor="#facc15" />
                        <stop offset="100%" stopColor="#4ade80" />
                    </linearGradient>
                </defs>
                <path d="M 5 50 A 45 45 0 0 1 95 50" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                <path
                    d="M 5 50 A 45 45 0 0 1 95 50"
                    fill="none"
                    stroke="url(#gaugeGradient)"
                    strokeWidth="10"
                    strokeDasharray="141.37"
                    strokeDashoffset={141.37 * (1 - (normalizedScore) / 10)}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                />
            </svg>
            <div
                className="absolute bottom-4 left-1/2 w-0.5 h-16 bg-slate-600 transition-transform duration-1000 ease-out origin-bottom"
                style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
            >
                <div className="w-4 h-4 rounded-full bg-slate-600 absolute -top-2 -left-[7px]"></div>
            </div>
            <div className="absolute bottom-[9px] left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-4 border-slate-600 rounded-full z-10"></div>
        </div>
        <div className="text-center">
             <span className={`text-2xl font-bold ${color}`}>{normalizedScore.toFixed(1)} / 10</span>
             <p className="text-sm font-semibold text-slate-600">{readinessCondition}</p>
        </div>
         <div className="w-full flex justify-between px-4 text-xs text-slate-400 mt-1">
            <span>Less Ready</span>
            <span>Well Prepared</span>
        </div>
    </div>
  );
};

export default MarketGauge;