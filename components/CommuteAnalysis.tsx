import React from 'react';
import type { AnalysisResult } from '../../src/types';

interface CommuteAnalysisProps {
  commuteAnalysis?: AnalysisResult['locationAnalysis']['commuteAnalysis'];
}

const CommuteAnalysis: React.FC<CommuteAnalysisProps> = ({ commuteAnalysis }) => {
  if (!commuteAnalysis) {
    return (
      <div className="text-center h-full flex flex-col justify-center items-center">
        <h4 className="font-bold text-purple-400 mb-2">Commute Analysis</h4>
        <p className="text-sm text-slate-400">No work address provided. Add one to get a commute analysis.</p>
      </div>
    );
  }

  const { time, score, summary } = commuteAnalysis;
  let color = 'text-yellow-300';
  if (score >= 8) color = 'text-green-300';
  if (score <= 5) color = 'text-red-300';

  return (
    <div className="text-center h-full flex flex-col justify-center">
      <h4 className="font-bold text-purple-400 mb-4">Commute Analysis</h4>
      <p className="text-5xl font-bold text-white">{time}<span className="text-2xl text-slate-400">min</span></p>
      <p className={`mt-2 font-semibold ${color}`}>Score: {score}/10</p>
      <p className="text-xs text-slate-400 mt-4 italic">{summary}</p>
    </div>
  );
};

export default CommuteAnalysis;
