
import React from 'react';
// FIX: Corrected import path for types.
import type { AnalysisResult } from '../src/types';

interface CompareProps {
    onClose: () => void;
    analyses: AnalysisResult[];
}

const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 });

const CompareStat: React.FC<{ label: string; value1: string | number; value2: string | number; isBetter?: 'v1' | 'v2' | 'none' }> = ({ label, value1, value2, isBetter = 'none' }) => {
    const v1Class = isBetter === 'v1' ? 'text-green-400 font-bold' : 'text-white';
    const v2Class = isBetter === 'v2' ? 'text-green-400 font-bold' : 'text-white';

    return (
        <div className="grid grid-cols-3 items-center text-center py-3 border-b border-slate-700 last:border-b-0">
            <p className={v1Class}>{value1}</p>
            <p className="text-slate-400 text-sm">{label}</p>
            <p className={v2Class}>{value2}</p>
        </div>
    );
};


const Compare: React.FC<CompareProps> = ({ analyses, onClose }) => {
    if (!analyses || analyses.length < 2) {
        return (
             <div className="text-center py-20 animate-fade-in">
                <h2 className="text-2xl font-bold text-white">Not enough items to compare</h2>
                <p className="text-slate-400 mt-4">Please select at least two analyses from your dashboard to compare them.</p>
                <button onClick={onClose} className="mt-6 bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-6 rounded-lg">
                    &larr; Back to Dashboard
                </button>
            </div>
        );
    }

    const analysis1 = analyses[0];
    const analysis2 = analyses[1];

    const a1 = analysis1;
    const a2 = analysis2;
    
    return (
        <div className="animate-fade-in">
             <button onClick={onClose} className="text-sm text-purple-400 hover:text-purple-300 mb-6">
                &larr; Back to Dashboard
            </button>
            <div className="p-2 sm:p-4 max-w-4xl w-full mx-auto bg-black/20 border border-purple-500/10 rounded-xl">
                <h2 className="text-2xl font-bold text-purple-400 text-center mb-4">Comparison View</h2>
                <div>
                    <div className="grid grid-cols-3 items-center text-center font-bold mb-4">
                        <div className="text-white">
                            <p>{a1.userInput.city}</p>
                            <p className="text-xs text-slate-400">{currencyFormatter.format(a1.userInput.targetHomePrice)}</p>
                        </div>
                        <div></div>
                        <div className="text-white">
                            <p>{a2.userInput.city}</p>
                            <p className="text-xs text-slate-400">{currencyFormatter.format(a2.userInput.targetHomePrice)}</p>
                        </div>
                    </div>
                    
                    <CompareStat label="Readiness Score" value1={a1.personalBuyingReadinessScore.toFixed(1)} value2={a2.personalBuyingReadinessScore.toFixed(1)} isBetter={a1.personalBuyingReadinessScore > a2.personalBuyingReadinessScore ? 'v1' : 'v2'} />
                    <CompareStat label="Max Affordable Price" value1={currencyFormatter.format(a1.affordability.maxAffordableHomePrice)} value2={currencyFormatter.format(a2.affordability.maxAffordableHomePrice)} isBetter={a1.affordability.maxAffordableHomePrice > a2.affordability.maxAffordableHomePrice ? 'v1' : 'v2'} />
                    <CompareStat label="Total Monthly Cost" value1={currencyFormatter.format(a1.totalCostOfOwnership.totalMonthlyCost)} value2={currencyFormatter.format(a2.totalCostOfOwnership.totalMonthlyCost)} isBetter={a1.totalCostOfOwnership.totalMonthlyCost < a2.totalCostOfOwnership.totalMonthlyCost ? 'v1' : 'v2'} />
                    <CompareStat label="Location Score" value1={a1.locationAnalysis.overallLocationScore.toFixed(1)} value2={a2.locationAnalysis.overallLocationScore.toFixed(1)} isBetter={a1.locationAnalysis.overallLocationScore > a2.locationAnalysis.overallLocationScore ? 'v1' : 'v2'} />
                    <CompareStat label="Market Health" value1={a1.marketAnalysis.marketHealthIndex.toFixed(1)} value2={a2.marketAnalysis.marketHealthIndex.toFixed(1)} isBetter={a1.marketAnalysis.marketHealthIndex < a2.marketAnalysis.marketHealthIndex ? 'v1' : 'v2'} />
                    <CompareStat label="Break-Even Point" value1={`${a1.breakEvenAnalysis.breakEvenPoint.toFixed(1)} yrs`} value2={`${a2.breakEvenAnalysis.breakEvenPoint.toFixed(1)} yrs`} isBetter={a1.breakEvenAnalysis.breakEvenPoint < a2.breakEvenAnalysis.breakEvenPoint ? 'v1' : 'v2'} />
                    {a1.locationAnalysis.commuteAnalysis && a2.locationAnalysis.commuteAnalysis && (
                        <CompareStat label="Commute Time" value1={`${a1.locationAnalysis.commuteAnalysis.time} min`} value2={`${a2.locationAnalysis.commuteAnalysis.time} min`} isBetter={a1.locationAnalysis.commuteAnalysis.time < a2.locationAnalysis.commuteAnalysis.time ? 'v1' : 'v2'} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Compare;