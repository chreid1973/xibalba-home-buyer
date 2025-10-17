import React from 'react';
import type { BreakEvenAnalysis as BreakEvenAnalysisType } from '../src/types';
import InfoTooltip from './InfoTooltip';
import Citation from './Citation';

interface BreakEvenAnalysisProps {
  analysis: BreakEvenAnalysisType;
  methodology: string;
}

const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 });

const BreakEvenAnalysis: React.FC<BreakEvenAnalysisProps> = ({ analysis, methodology }) => {
  const { breakEvenPoint, summary, assumptions } = analysis;

  return (
    <div className="flex flex-col text-center justify-center flex-grow h-full">
      <div className="flex justify-center items-center mb-2">
        <h3 className="font-bold text-purple-400">Buy vs. Rent Break-Even</h3>
        <InfoTooltip text="The estimated number of years it takes for the financial benefits of buying to outweigh the costs of renting." />
        <Citation title="Methodology" content={methodology} isDarkTheme={true} />
      </div>
      <div className="my-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        <p className="text-4xl font-bold text-white mt-2">
          {breakEvenPoint.toFixed(1)}
          <span className="text-xl font-medium text-slate-400"> yrs</span>
        </p>
      </div>
      <p className="text-sm text-slate-400 max-w-sm mx-auto">{summary}</p>
      <div className="text-left text-xs text-slate-400 mt-4 bg-slate-800/50 p-3 rounded-md max-w-sm mx-auto">
        <h4 className="font-semibold text-slate-300 mb-1">Key Assumptions:</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>Est. Monthly Rent: <span className="font-mono text-slate-200">{currencyFormatter.format(assumptions.estimatedRent)}</span></li>
          <li>Home Appreciation: <span className="font-mono text-slate-200">{assumptions.appreciationRate.toFixed(1)}%/yr</span></li>
          <li>Rent Increase: <span className="font-mono text-slate-200">{assumptions.rentIncreaseRate.toFixed(1)}%/yr</span></li>
        </ul>
      </div>
    </div>
  );
};

export default BreakEvenAnalysis;
