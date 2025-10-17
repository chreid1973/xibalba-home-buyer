
import React, { useState } from 'react';
import { CheckIcon } from './icons/CheckIcon';
import { WarningIcon } from './icons/WarningIcon';
import { StopIcon } from './icons/StopIcon';
import VerdictExplainer from './VerdictExplainer';

interface VerdictRevealProps {
  recommendation: string;
  readinessScore: number;
  marketHealthIndex: number;
  marketForecast: string;
  locationScore: number;
  locationSummary: string;
  insight: string;
}

const VerdictReveal: React.FC<VerdictRevealProps> = ({ 
    recommendation,
    readinessScore,
    marketHealthIndex,
    marketForecast,
    locationScore,
    locationSummary,
    insight
}) => {
  const [isExplainerOpen, setIsExplainerOpen] = useState(false);

  const lowerRec = recommendation.toLowerCase();
  let verdict: {
    title: string;
    Icon: React.FC;
    color: string;
    bgColor: string;
  };

  if (lowerRec.includes('good time') || lowerRec.includes('proceed') && !lowerRec.includes('caution')) {
    verdict = { title: "A Good Time to Buy", Icon: CheckIcon, color: "text-green-300", bgColor: "bg-green-500/10 border-green-500/20" };
  } else if (lowerRec.includes('caution')) {
    verdict = { title: "Proceed with Caution", Icon: WarningIcon, color: "text-yellow-300", bgColor: "bg-yellow-500/10 border-yellow-500/20" };
  } else {
    verdict = { title: "Strengthen Finances First", Icon: StopIcon, color: "text-red-300", bgColor: "bg-red-500/10 border-red-500/20" };
  }

  return (
    <>
      <div className={`p-8 rounded-lg shadow-lg text-center ${verdict.bgColor} border`}>
        <div className={`mx-auto w-16 h-16 mb-4 ${verdict.color}`}>
          <verdict.Icon />
        </div>
        <h3 className={`text-4xl font-extrabold ${verdict.color}`}>{verdict.title}</h3>
        <p className="max-w-2xl mx-auto text-lg text-slate-300 mt-4">
          {insight}
        </p>
        <button 
          onClick={() => setIsExplainerOpen(true)}
          className="mt-6 text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors"
        >
          How did we get this verdict? &rarr;
        </button>
      </div>

      <VerdictExplainer 
        isOpen={isExplainerOpen}
        onClose={() => setIsExplainerOpen(false)}
        readinessScore={readinessScore}
        marketHealthIndex={marketHealthIndex}
        marketForecast={marketForecast}
        locationScore={locationScore}
        locationSummary={locationSummary}
      />
    </>
  );
};

export default VerdictReveal;
