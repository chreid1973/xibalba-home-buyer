
import React from 'react';
import type { AnalysisResult } from '../src/types';
import AnalysisSummaryCard from './AnalysisSummaryCard';

interface DashboardProps {
  analyses: AnalysisResult[];
  onView: (analysis: AnalysisResult) => void;
  onDelete: (analysisId: string) => void;
  onNewAnalysis: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ analyses, onView, onDelete, onNewAnalysis }) => {
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">My Dashboard</h2>
        <button 
          onClick={onNewAnalysis} 
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md text-sm transition-all duration-200 transform hover:scale-105 shadow-lg shadow-purple-500/20"
        >
          + New Analysis
        </button>
      </div>

      {analyses.length === 0 ? (
        <div className="text-center py-20 bg-black/20 border border-purple-500/10 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-4 text-xl font-semibold text-white">No Saved Analyses</h3>
          <p className="mt-2 text-slate-400">Get started by creating your first property analysis.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {analyses.map(analysis => (
            <AnalysisSummaryCard 
              key={analysis.id}
              analysis={analysis}
              onView={onView}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
