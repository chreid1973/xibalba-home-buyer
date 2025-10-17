import React from 'react';
import { AnalysisResult, GroundingChunk, UserInput } from '../src/types';
import VerdictReveal from './VerdictReveal';
import MarketGauge from './MarketGauge';
import LocationRadarChart from './LocationRadarChart';
import OwnershipCostChart from './OwnershipCostChart';
import AffordabilityIndex from './AffordabilityIndex';
import BreakEvenAnalysis from './BreakEvenAnalysis';
import CommuteAnalysis from './CommuteAnalysis';
import Citation from './Citation';

interface ResultsProps {
  result: AnalysisResult;
  citations: GroundingChunk[];
  onReset: () => void;
  userInput: UserInput;
}

const Results: React.FC<ResultsProps> = ({ result, citations, onReset, userInput }) => {
  return (
    <div className="space-y-12">
      <VerdictReveal verdict={result.verdict} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AffordabilityIndex affordability={result.affordability} />
        <MarketGauge marketAnalysis={result.marketAnalysis} />
        <BreakEvenAnalysis breakEven={result.breakEven} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-slate-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-cyan-400">Total Monthly Ownership Cost</h2>
          <OwnershipCostChart ownershipCost={result.ownershipCost} />
        </div>
        <div className="lg:col-span-2 bg-slate-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-cyan-400">Location Score</h2>
          <LocationRadarChart locationScore={result.locationScore} />
        </div>
      </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <CommuteAnalysis commute={result.commute} from={userInput.propertyLocation} to={userInput.workLocation} />
         {/* Placeholder for another chart, e.g. TrendChart if data is available */}
      </div>


      {citations.length > 0 && <Citation citations={citations} />}

      <div className="text-center mt-12">
        <button
          onClick={onReset}
          className="py-3 px-12 border border-cyan-600 text-cyan-400 font-medium rounded-md hover:bg-cyan-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-slate-900 transition-colors duration-200"
        >
          Analyze Another Property
        </button>
      </div>
    </div>
  );
};

export default Results;
