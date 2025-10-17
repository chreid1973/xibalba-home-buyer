import React from 'react';
import type { AnalysisResult } from '../../src/types';
import InfoTooltip from './InfoTooltip';

interface AffordabilityIndexProps {
    priceToIncomeRatio: AnalysisResult['affordability']['priceToIncomeRatio'];
    methodology: string;
}

const AffordabilityIndex: React.FC<AffordabilityIndexProps> = ({ priceToIncomeRatio, methodology }) => {
    const { user, cityAverage, summary } = priceToIncomeRatio;

    return (
        <div className="mt-6 text-center">
            <h5 className="text-sm font-semibold text-slate-300 mb-2 flex items-center justify-center">
                Price-to-Income Ratio
                <InfoTooltip text="Compares the target home price to your annual income. A lower ratio is generally better." methodology={methodology} />
            </h5>
            <div className="flex justify-around items-end">
                <div className="w-1/2">
                    <p className="text-xs text-purple-300">Your Ratio</p>
                    <p className="text-2xl font-bold text-white">{user.toFixed(1)}x</p>
                </div>
                <div className="w-1/2">
                    <p className="text-xs text-slate-400">City Average</p>
                    <p className="text-2xl font-bold text-slate-300">{cityAverage.toFixed(1)}x</p>
                </div>
            </div>
            <p className="text-xs text-slate-400 mt-3 italic">{summary}</p>
        </div>
    );
};

export default AffordabilityIndex;
