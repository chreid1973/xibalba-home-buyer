import React from 'react';
import InfoTooltip from './InfoTooltip';

interface MarketGaugeProps {
  score: number;
  title: string;
  tooltipText: string;
  methodology?: string;
}

const MarketGauge: React.FC<MarketGaugeProps> = ({ score, title, tooltipText, methodology }) => {
  const percentage = (score / 10) * 100;
  
  let color = '#facc15'; // yellow
  if (score >= 7) color = '#4ade80'; // green
  if (score <= 4) color = '#f87171'; // red

  return (
    <div className="text-center">
      <h4 className="font-bold text-purple-400 mb-2 flex items-center justify-center">
        {title}
        <InfoTooltip text={tooltipText} methodology={methodology}/>
      </h4>
      <div className="relative inline-block w-[150px] h-[90px]">
        <svg width="150" height="90" viewBox="0 0 150 90" className="w-full h-full">
          <path d="M 10 80 A 65 65 0 0 1 140 80" stroke="#374151" strokeWidth="15" fill="none" />
          <path
            d="M 10 80 A 65 65 0 0 1 140 80"
            stroke={color}
            strokeWidth="15"
            fill="none"
            strokeDasharray="204.2"
            strokeDashoffset={204.2 - (percentage / 100) * 204.2}
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>
        <div className="absolute bottom-0 left-0 right-0">
          <span className="text-4xl font-bold text-white">{score.toFixed(1)}</span>
          <span className="text-slate-400">/10</span>
        </div>
      </div>
    </div>
  );
};

export default MarketGauge;
