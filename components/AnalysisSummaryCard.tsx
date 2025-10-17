
import React from 'react';
import type { AnalysisResult } from '../src/types';

interface AnalysisSummaryCardProps {
  analysis: AnalysisResult;
  onView: (analysis: AnalysisResult) => void;
  onDelete: (analysisId: string) => void;
}

const getRecommendationStyle = (recommendation: string): { color: string, text: string } => {
    const lowerRec = recommendation.toLowerCase();
    if (lowerRec.includes('good') || lowerRec.includes('proceed')) {
        return { color: 'bg-green-500/20 text-green-300 border-green-500/30', text: 'Good to Buy' };
    }
    if (lowerRec.includes('caution')) {
        return { color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', text: 'Caution' };
    }
    if (lowerRec.includes('strengthen') || lowerRec.includes('wait')) {
        return { color: 'bg-red-500/20 text-red-300 border-red-500/30', text: 'Strengthen Finances' };
    }
    return { color: 'bg-sky-500/20 text-sky-300 border-sky-500/30', text: 'Advice' };
};


const AnalysisSummaryCard: React.FC<AnalysisSummaryCardProps> = ({ analysis, onView, onDelete }) => {
    const { userInput, personalBuyingReadinessScore, financialAdvice, savedAt } = analysis;
    const recommendationStyle = getRecommendationStyle(financialAdvice.overallRecommendation);

    return (
        <div className="bg-black/20 border border-purple-500/10 rounded-lg shadow-lg p-6 flex flex-col justify-between h-full transition-all duration-300 hover:border-purple-500/30 hover:shadow-purple-500/10">
            <div>
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-white pr-4">{userInput.city}, {userInput.postalCode}</h3>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${recommendationStyle.color}`}>
                        {recommendationStyle.text}
                    </span>
                </div>
                <p className="text-sm text-slate-400 mt-1">Saved on {new Date(savedAt).toLocaleDateString()}</p>
            </div>
            
            <div className="my-6 space-y-3">
                <div className="flex justify-between items-baseline">
                    <span className="text-slate-400">Target Price:</span>
                    <span className="text-xl font-bold text-white">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(userInput.targetHomePrice)}</span>
                </div>
                 <div className="flex justify-between items-baseline">
                    <span className="text-slate-400">Readiness Score:</span>
                    <span className="text-xl font-bold text-white">{personalBuyingReadinessScore.toFixed(1)}/10</span>
                </div>
            </div>

            <div className="flex space-x-2">
                <button 
                    onClick={() => onView(analysis)}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md text-sm transition-all duration-200"
                >
                    View
                </button>
                <button 
                    onClick={() => onDelete(analysis.id)}
                    className="flex-shrink-0 bg-slate-700 hover:bg-red-500/50 text-slate-300 hover:text-white font-semibold py-2 px-3 rounded-md text-sm transition-all duration-200"
                    aria-label="Delete analysis"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default AnalysisSummaryCard;
