
import React from 'react';
import type { AnalysisResult } from '../src/types';

interface CompareProps {
  analyses: AnalysisResult[];
  onBack: () => void;
}

const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 });

const Compare: React.FC<CompareProps> = ({ analyses, onBack }) => {

  const MetricRow: React.FC<{ label: string; values: (string | number | React.ReactNode)[]; isHeader?: boolean }> = ({ label, values, isHeader = false }) => (
    <div className={`grid grid-cols-4 gap-4 items-center ${isHeader ? '' : 'py-4 border-b border-purple-500/10'}`}>
      <div className={`font-semibold ${isHeader ? 'text-lg text-purple-400' : 'text-slate-300'}`}>{label}</div>
      {values.map((value, index) => (
        <div key={index} className={`text-center ${isHeader ? 'text-xl font-bold text-white' : 'text-slate-200'}`}>
          {value}
        </div>
      ))}
    </div>
  );

  const ListRow: React.FC<{ label: string; values: string[][] }> = ({ label, values }) => (
     <div className="py-4 border-b border-purple-500/10">
        <p className="font-semibold text-slate-300 mb-3 col-span-4">{label}</p>
        <div className="grid grid-cols-4 gap-4 items-start">
            <div></div> {/* Placeholder for label column */}
             {values.map((list, index) => (
                <ul key={index} className="space-y-2 text-sm text-slate-400 text-center">
                    {list.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
            ))}
        </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Property Comparison</h2>
        <button 
          onClick={onBack}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md text-sm transition-all duration-200"
        >
          &larr; Back to Dashboard
        </button>
      </div>

      <div className="bg-black/20 border border-purple-500/10 rounded-lg shadow-lg p-6">
        <MetricRow 
            label="Property" 
            isHeader 
            values={analyses.map(a => `${a.userInput.city}, ${a.userInput.postalCode}`)}
        />
        <MetricRow 
            label="Target Price" 
            values={analyses.map(a => currencyFormatter.format(a.userInput.targetHomePrice))} 
        />
        <MetricRow 
            label="Readiness Score" 
            values={analyses.map(a => `${a.personalBuyingReadinessScore.toFixed(1)}/10`)} 
        />
        <MetricRow 
            label="Total Monthly Cost" 
            values={analyses.map(a => currencyFormatter.format(a.totalCostOfOwnership.totalMonthlyCost))} 
        />
        <MetricRow 
            label="Location Score" 
            values={analyses.map(a => `${a.locationAnalysis.overallLocationScore.toFixed(1)}/10`)} 
        />
         <MetricRow 
            label="Break-Even" 
            values={analyses.map(a => `${a.breakEvenAnalysis.breakEvenPoint.toFixed(1)} yrs`)} 
        />
        <ListRow
            label="Pros"
            values={analyses.map(a => a.financialAdvice.pros.slice(0, 3))}
        />
         <ListRow
            label="Cons"
            values={analyses.map(a => a.financialAdvice.cons.slice(0, 3))}
        />
      </div>
    </div>
  );
};

export default Compare;