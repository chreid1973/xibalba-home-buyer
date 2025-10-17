import React from 'react';
import InfoTooltip from './InfoTooltip';
import Citation from './Citation';

interface MarketGaugeProps {
  score: number; // A value from 1 to 10
  title: string;
  tooltipText: string;
  methodology: string;
}

const MarketGauge: React.FC<MarketGaugeProps> = ({ score, title, tooltipText, methodology }) => {
  const percentage = Math.max(0, Math.min(10, score)) * 10;
  
  let color = '#facc15'; // yellow-400
  if (score >= 7) color = '#4ade80'; // green-400
  if (score <= 4) color = '#f87171'; // red-400

  return (
    <div className="flex flex-col items-center flex-grow h-full">
      <div className="flex justify-center items-center">
        <h3 className="font-bold text-center text-purple-400">{title}</h3>
        <InfoTooltip text={tooltipText} />
        <Citation title="Methodology" content={methodology} isDarkTheme={true}/>
      </div>
      <div className="relative mt-2" style={{ width: '150px', height: '75px' }}>
        <svg viewBox="0 0 100 50" className="w-full h-full">
          <path
            d="M10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="#374151"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${(percentage * Math.PI * 40) / 100}, ${Math.PI * 40}`}
            style={{ transition: 'stroke-dasharray 0.5s ease-in-out' }}
          />
        </svg>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
          <span className="text-3xl font-bold text-white">{score.toFixed(1)}</span>
          <span className="text-sm text-slate-400">/10</span>
        </div>
      </div>
    </div>
  );
};

export default MarketGauge;
