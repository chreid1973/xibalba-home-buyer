
import React from 'react';
// FIX: Corrected import path for types.
import type { AnalysisResult } from '../src/types';

interface AnalysisSummaryCardProps {
    analysis: AnalysisResult;
    onSelect: () => void;
    onDelete: () => void;
    onCompare: () => void;
    isDeleting: boolean;
    isSelectedForCompare?: boolean;
}

const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 });

const AnalysisSummaryCard: React.FC<AnalysisSummaryCardProps> = ({ analysis, onSelect, onDelete, onCompare, isDeleting, isSelectedForCompare }) => {
    const { userInput, personalBuyingReadinessScore, savedAt } = analysis;

    return (
        <div className={`bg-slate-800/50 p-4 rounded-lg border ${isSelectedForCompare ? 'border-purple-500 ring-2 ring-purple-500/50' : 'border-purple-500/10'} hover:border-purple-500/30 transition-all duration-300`}>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg text-white">{userInput.city}, {userInput.postalCode}</h3>
                    <p className="text-sm text-slate-400">
                        Target Price: {currencyFormatter.format(userInput.targetHomePrice)}
                    </p>
                    {savedAt && (
                         <p className="text-xs text-slate-500 mt-1">
                            Saved on: {new Date(savedAt).toLocaleDateString()}
                        </p>
                    )}
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                    <p className="text-xs text-purple-300">Readiness</p>
                    <p className="text-2xl font-bold text-white">{personalBuyingReadinessScore.toFixed(1)}/10</p>
                </div>
            </div>
            <div className="mt-4 flex justify-end items-center space-x-2">
                <button onClick={onCompare} className={`text-xs font-semibold py-1 px-3 rounded-md transition-colors ${isSelectedForCompare ? 'bg-purple-500 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'}`}>
                    {isSelectedForCompare ? '✓ Selected' : 'Compare'}
                </button>
                <button onClick={onSelect} className="text-sm bg-purple-600 hover:bg-purple-500 text-white font-bold py-1 px-4 rounded-md transition-colors">View</button>
                <button onClick={onDelete} disabled={isDeleting} className="text-xs text-red-400 hover:text-red-300 disabled:text-slate-500 disabled:cursor-not-allowed">
                    {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
            </div>
        </div>
    );
};

export default AnalysisSummaryCard;