import React from 'react';
import type { LocationAnalysis } from '../src/types';
import InfoTooltip from './InfoTooltip';

interface CommuteAnalysisProps {
  commuteAnalysis?: LocationAnalysis['commuteAnalysis'];
}

const CommuteAnalysis: React.FC<CommuteAnalysisProps> = ({ commuteAnalysis }) => {
  if (!commuteAnalysis) {
    return (
       <div className="flex flex-col justify-center items-center text-center flex-grow h-full">
            <div className="flex justify-center items-center mb-2">
                <h3 className="font-bold text-purple-400">Commute Analysis</h3>
                <InfoTooltip text="Provide a work address in the input form to get a personalized commute analysis for this location." />
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <p className="text-sm text-slate-400 mt-2">No work address provided.</p>
        </div>
    );
  }

  const { time, score, summary } = commuteAnalysis;

  return (
    <div className="flex flex-col justify-center text-center flex-grow h-full">
        <div className="flex justify-center items-center mb-2">
            <h3 className="font-bold text-purple-400">Commute Analysis</h3>
             <InfoTooltip text={`Based on your provided work address, this is an AI-estimated commute time and score (1-10) from the target area.`} />
        </div>
        <div className="my-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-500 mx-auto" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
             <p className="text-4xl font-bold text-white mt-2">{time}<span className="text-xl font-medium text-slate-400"> min</span></p>
             <p className="text-sm font-semibold text-slate-300 mt-1">Commute Score: {score}/10</p>
        </div>
        <p className="text-sm text-slate-400">{summary}</p>
    </div>
  );
};

export default CommuteAnalysis;