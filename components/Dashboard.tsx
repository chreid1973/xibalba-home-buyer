
import React, { useState } from 'react';
// FIX: Corrected import path for types.
import type { AnalysisResult } from '../src/types';
import AnalysisSummaryCard from './AnalysisSummaryCard';

interface DashboardProps {
    analyses: AnalysisResult[];
    onSelectAnalysis: (analysis: AnalysisResult) => void;
    onDeleteAnalysis: (id: string) => void;
    onStartCompare: (selectedAnalyses: AnalysisResult[]) => void;
    onNewAnalysis: () => void;
    isDeleting: string | null;
}

const Dashboard: React.FC<DashboardProps> = ({ analyses, onSelectAnalysis, onDeleteAnalysis, onStartCompare, onNewAnalysis, isDeleting }) => {
    const [selectedToCompare, setSelectedToCompare] = useState<string[]>([]);

    const handleToggleCompare = (id: string) => {
        setSelectedToCompare(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const handleCompareClick = () => {
        const selectedAnalyses = analyses.filter(a => a.id! && selectedToCompare.includes(a.id!));
        if (selectedAnalyses.length > 1) {
            onStartCompare(selectedAnalyses);
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <h2 className="text-3xl font-bold text-white">My Dashboard</h2>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleCompareClick}
                        disabled={selectedToCompare.length < 2}
                        className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-5 rounded-lg transition-all duration-300 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed"
                    >
                        Compare Selected ({selectedToCompare.length})
                    </button>
                    <button onClick={onNewAnalysis} className="bg-purple-600/50 hover:bg-purple-600 text-white font-semibold py-2 px-5 rounded-lg transition-all duration-300">
                        + New Analysis
                    </button>
                </div>
            </div>
            {analyses.length > 0 ? (
                <div className="space-y-4">
                    {analyses.map(analysis => (
                       <AnalysisSummaryCard
                            key={analysis.id}
                            analysis={analysis}
                            onSelect={() => onSelectAnalysis(analysis)}
                            onDelete={() => onDeleteAnalysis(analysis.id!)}
                            onCompare={() => handleToggleCompare(analysis.id!)}
                            isDeleting={isDeleting === analysis.id}
                            isSelectedForCompare={selectedToCompare.includes(analysis.id!)}
                       />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-black/20 border border-purple-500/10 rounded-lg">
                    <h3 className="text-xl font-semibold text-white">No Saved Analyses Yet</h3>
                    <p className="text-slate-400 mt-2">Your saved property reports will appear here.</p>
                     <button onClick={onNewAnalysis} className="mt-6 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105">
                        Start Your First Analysis
                    </button>
                </div>
            )}
        </div>
    );
};

export default Dashboard;