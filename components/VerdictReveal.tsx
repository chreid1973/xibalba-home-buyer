import React from 'react';
import { AnalysisResult } from '../src/types';
import CheckIcon from './icons/CheckIcon';
import WarningIcon from './icons/WarningIcon';
import StopIcon from './icons/StopIcon';
import VerdictExplainer from './VerdictExplainer';

interface VerdictRevealProps {
  verdict: AnalysisResult['verdict'];
}

const verdictConfig = {
  good: {
    title: "Good Deal",
    Icon: CheckIcon,
    color: "green",
    bgClass: "bg-green-500/10 border-green-500/30",
    textClass: "text-green-300",
    iconBgClass: "bg-green-500/20"
  },
  borderline: {
    title: "Borderline",
    Icon: WarningIcon,
    color: "yellow",
    bgClass: "bg-yellow-500/10 border-yellow-500/30",
    textClass: "text-yellow-300",
    iconBgClass: "bg-yellow-500/20"
  },
  bad: {
    title: "Bad Deal",
    Icon: StopIcon,
    color: "red",
    bgClass: "bg-red-500/10 border-red-500/30",
    textClass: "text-red-300",
    iconBgClass: "bg-red-500/20"
  },
};

const VerdictReveal: React.FC<VerdictRevealProps> = ({ verdict }) => {
  const config = verdictConfig[verdict.decision];

  return (
    <div className={`p-8 rounded-lg border ${config.bgClass}`}>
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className={`p-4 rounded-full ${config.iconBgClass}`}>
          <config.Icon className={`w-16 h-16 ${config.textClass}`} />
        </div>
        <div className="text-center md:text-left">
          <p className={`text-xl font-semibold ${config.textClass}`}>The AI Verdict is:</p>
          <h1 className="text-5xl font-extrabold text-white">{config.title}</h1>
        </div>
      </div>
      <p className="mt-6 text-slate-300 text-lg">{verdict.summary}</p>
      
      <VerdictExplainer pros={verdict.pros} cons={verdict.cons} />
    </div>
  );
};

export default VerdictReveal;
