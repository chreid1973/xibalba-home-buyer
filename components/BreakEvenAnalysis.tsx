import React from 'react';
import type { AnalysisResult } from '../../src/types';
import InfoTooltip from './InfoTooltip';

interface BreakEvenAnalysisProps {
    analysis: AnalysisResult['breakEvenAnalysis'];
    methodology: string;
}

const BreakEvenAnalysis: React.FC<BreakEvenAnalysisProps> = ({ analysis, methodology }) => {
    const { breakEvenPoint, summary, assumptions } = analysis;
    
    const tooltipText = `Assumptions used:
- Est. Rent: $${assumptions.estimatedRent}/mo
- Appreciation: ${assumptions.appreciationRate}%/yr
- Rent Increase: ${assumptions.rentIncreaseRate}%/yr
- Buying Costs: ${assumptions.buyingCosts}%
- Selling Costs: ${assumptions.sellingCosts}%`;

    return (
        <div className="text-center h-full flex flex-col justify-center">
            <h4 className="font-bold text-purple-400 mb-4 flex items-center justify-center">
                Buy vs. Rent Break-Even
                 <InfoTooltip text={tooltipText} methodology={methodology} />
            </h4>
            <p className="text-5xl font-bold text-white">{breakEvenPoint.toFixed(1)}<span className="text-2xl text-slate-400">yrs</span></p>
            <p className="text-xs text-slate-400 mt-4 italic">{summary}</p>
        </div>
    );
};

export default BreakEvenAnalysis;
