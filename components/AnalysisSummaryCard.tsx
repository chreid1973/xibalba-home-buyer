import React from 'react';

// Placeholder for a card that summarizes a past analysis on the dashboard.

interface AnalysisSummaryCardProps {
    analysis: {
        id: string;
        location: string;
        verdict: 'good' | 'borderline' | 'bad';
        date: string;
    };
}

const AnalysisSummaryCard: React.FC<AnalysisSummaryCardProps> = ({ analysis }) => {
    return (
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <h3 className="font-bold text-lg">{analysis.location}</h3>
            <p>Verdict: <span className="font-semibold">{analysis.verdict}</span></p>
            <p className="text-sm text-slate-400">{analysis.date}</p>
        </div>
    );
};

export default AnalysisSummaryCard;
