import React from 'react';
import type { AffordabilityAnalysis } from '../src/types';
import InfoTooltip from './InfoTooltip';

interface AffordabilityIndexProps {
  priceToIncomeRatio: AffordabilityAnalysis['priceToIncomeRatio'];
}

const AffordabilityIndex: React.FC<AffordabilityIndexProps> = ({ priceToIncomeRatio }) => {
    if (!priceToIncomeRatio) return null;

    const { user, cityAverage, summary } = priceToIncomeRatio;

    const Bar = ({ label, value, isUser }: { label: string; value: number; isUser?: boolean }) => {
        const maxValue = Math.max(user, cityAverage, 1) * 1.2;
        const width = `${(value / maxValue) * 100}%`;
        return (
            <div className="mb-2">
                <div className="flex justify-between items-center mb-1 text-sm">
                    <span className="text-slate-300">{label}</span>
                    <span className={`font-bold ${isUser ? 'text-white' : 'text-slate-300'}`}>{value.toFixed(1)}x</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2.5">
                    <div className={`${isUser ? 'bg-cyan-500' : 'bg-slate-400'} h-2.5 rounded-full`} style={{ width: width, transition: 'width 0.5s ease-out' }}></div>
                </div>
            </div>
        )
    };

    return (
        <div className="mt-6">
            <div className="flex items-center mb-3">
                <h4 className="font-semibold text-slate-300">Price-to-Income Ratio</h4>
                <InfoTooltip text="This ratio compares the home price to your annual income. A lower ratio is generally better. This chart compares your ratio for your target home to the city's average." />
            </div>
            <div className="space-y-2">
                <Bar label="Your Ratio" value={user} isUser />
                <Bar label="City Average" value={cityAverage} />
            </div>
             <p className="text-xs text-slate-400 mt-3">{summary}</p>
        </div>
    );
};

export default AffordabilityIndex;