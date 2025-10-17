import React from 'react';
// FIX: Corrected import path
import type { AnalysisResult } from '../src/types';
import MarketGauge from './MarketGauge';
import LocationRadarChart from './LocationRadarChart';
import OwnershipCostChart from './OwnershipCostChart';
import TrendChart from './TrendChart';
import CommuteAnalysis from './CommuteAnalysis';
import AffordabilityIndex from './AffordabilityIndex';
import SchoolInfo from './SchoolInfo';
import NeighborhoodMap from './NeighborhoodMap';
import BreakEvenAnalysis from './BreakEvenAnalysis';
import VerdictReveal from './VerdictReveal';
import { IdeaIcon } from './icons/IdeaIcon';
// FIX: Corrected import path
import type { AppUser } from '../src/services/authService';

interface ResultsProps {
  result: AnalysisResult;
  onSave: () => void;
  isSaving: boolean;
  isSaved: boolean;
  user: AppUser | null;
  onNewAnalysis: () => void;
}

const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 });

const Results: React.FC<ResultsProps> = ({ result, onSave, isSaving, isSaved, user, onNewAnalysis }) => {
  const { 
    personalBuyingReadinessScore, 
    affordability, 
    marketAnalysis, 
    locationAnalysis, 
    totalCostOfOwnership, 
    financialAdvice, 
    breakEvenAnalysis,
    methodology
  } = result;
  
  const homePriceData = marketAnalysis.averageHomePrice.map(d => ({ ...d, price: d.price / 1000 }));
  const interestRateData = marketAnalysis.interestRateForecast;
  const inventoryData = marketAnalysis.inventoryLevels;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
        
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-extrabold text-white">Your Property Analysis Report</h2>
            <div>
                 <button onClick={onNewAnalysis} className="text-sm text-purple-400 hover:text-purple-300 mr-4">
                    &larr; Start New Analysis
                 </button>
                {user && (
                    <button 
                        onClick={onSave}
                        disabled={isSaving || isSaved}
                        className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed"
                    >
                        {isSaved ? 'Saved!' : (isSaving ? 'Saving...' : 'Save Report')}
                    </button>
                )}
            </div>
        </div>

      {/* Section 1: Top-level Verdict */}
      <VerdictReveal 
        recommendation={financialAdvice.overallRecommendation}
        readinessScore={personalBuyingReadinessScore}
        marketHealthIndex={marketAnalysis.marketHealthIndex}
        marketForecast={marketAnalysis.forecastSummary}
        locationScore={locationAnalysis.overallLocationScore}
        locationSummary={locationAnalysis.overallSummary}
        insight={financialAdvice.chartInsights.readinessGauge}
      />
      
      {/* Section 2: Key Metrics Grid */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-black/20 border border-purple-500/10 p-6 rounded-lg shadow-lg">
          <MarketGauge score={personalBuyingReadinessScore} title="Personal Buying Readiness" tooltipText="An overall score (1-10) indicating your readiness to buy, considering your finances and market conditions." methodology={methodology.readinessScore} />
        </div>
        <div className="bg-black/20 border border-purple-500/10 p-6 rounded-lg shadow-lg">
          <MarketGauge score={marketAnalysis.marketHealthIndex} title="Market Health Index" tooltipText="A score (1-10) indicating market health. Low scores favor buyers, high scores favor sellers." methodology={""} />
        </div>
        <div className="bg-black/20 border border-purple-500/10 p-6 rounded-lg shadow-lg">
          <MarketGauge score={locationAnalysis.overallLocationScore} title="Overall Location Score" tooltipText="A weighted score (1-10) for the location based on affordability, safety, schools, and more." methodology={""} />
        </div>
      </div>
      
       {/* Section 3: Affordability & Ownership Cost */}
       <div className="mt-12">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Your Financial Picture</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-black/20 border border-purple-500/10 p-6 rounded-lg shadow-lg">
                    <h4 className="font-bold text-purple-400 text-center mb-4">Affordability Analysis</h4>
                    <div className="text-center mb-4">
                        <span className="text-slate-400 text-sm">Max Affordable Home Price</span>
                        <p className="text-4xl font-bold text-white">{currencyFormatter.format(affordability.maxAffordableHomePrice)}</p>
                    </div>
                    <div className="text-sm space-y-2 text-slate-300">
                        <div className="flex justify-between"><span>Monthly PITH:</span><span className="font-semibold text-white">{currencyFormatter.format(affordability.monthlyPITH)}</span></div>
                        <div className="flex justify-between"><span>TDS Ratio:</span><span className="font-semibold text-white">{affordability.tdsRatio.toFixed(1)}%</span></div>
                    </div>
                    <AffordabilityIndex priceToIncomeRatio={affordability.priceToIncomeRatio} methodology={methodology.affordability} />
                </div>
                <div className="lg:col-span-2 bg-black/20 border border-purple-500/10 p-6 rounded-lg shadow-lg">
                    <OwnershipCostChart tco={totalCostOfOwnership} pith={affordability.monthlyPITH} methodology={methodology.totalCostOfOwnership}/>
                    <p className="text-xs text-slate-400 text-center mt-4 italic">{financialAdvice.chartInsights.ownershipCost}</p>
                </div>
            </div>
            <div className="mt-8 bg-black/20 border border-purple-500/10 p-6 rounded-lg shadow-lg">
                <h4 className="font-bold text-purple-400 mb-2">Recommendations</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                    {affordability.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                </ul>
            </div>
       </div>

      {/* Section 4: Market Analysis */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">Local Market Analysis for {result.userInput.city}</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-black/20 border border-purple-500/10 p-6 rounded-lg shadow-lg">
            <TrendChart data={homePriceData} dataKey="price" xAxisKey="quarter" title="Average Home Price" tooltipText="Historical and forecasted home prices. Forecasts are for the next 2 quarters." dataSource={marketAnalysis.dataSource} color="#a855f7" formatter={(val) => currencyFormatter.format(val * 1000)} />
            <p className="text-xs text-slate-400 text-center mt-2 italic">{financialAdvice.chartInsights.homePriceForecast}</p>
          </div>
          <div className="bg-black/20 border border-purple-500/10 p-6 rounded-lg shadow-lg">
            <TrendChart data={interestRateData} dataKey="rate" xAxisKey="quarter" title="Interest Rate Forecast" tooltipText="Forecasted mortgage interest rates for the next 4 quarters." dataSource={marketAnalysis.dataSource} color="#818cf8" formatter={(val) => `${val.toFixed(2)}%`} />
            <p className="text-xs text-slate-400 text-center mt-2 italic">{financialAdvice.chartInsights.interestRateForecast}</p>
          </div>
          <div className="bg-black/20 border border-purple-500/10 p-6 rounded-lg shadow-lg">
            <TrendChart data={inventoryData} dataKey="level" xAxisKey="quarter" title="Housing Inventory Levels" tooltipText="Number of active listings. Higher inventory may mean less competition." dataSource={marketAnalysis.dataSource} color="#38bdf8" chartType="bar" />
             <p className="text-xs text-slate-400 text-center mt-2 italic">{financialAdvice.chartInsights.inventoryLevels}</p>
          </div>
        </div>
      </div>
      
       {/* Section 5: Location Deep Dive */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">Location Deep Dive: {result.userInput.postalCode}</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            <div className="lg:col-span-1 bg-black/20 border border-purple-500/10 p-6 rounded-lg shadow-lg flex flex-col h-full">
                <LocationRadarChart scores={locationAnalysis.scores} dataSource={locationAnalysis.dataSources.scores} />
                <p className="text-xs text-slate-400 text-center mt-2 italic">{financialAdvice.chartInsights.locationRadar}</p>
            </div>
            <div className="lg:col-span-1 bg-black/20 border border-purple-500/10 p-6 rounded-lg shadow-lg flex flex-col h-full">
                <CommuteAnalysis commuteAnalysis={locationAnalysis.commuteAnalysis} />
            </div>
            <div className="lg:col-span-1 bg-black/20 border border-purple-500/10 p-6 rounded-lg shadow-lg flex flex-col h-full">
                <BreakEvenAnalysis analysis={breakEvenAnalysis} methodology={methodology.breakEvenAnalysis}/>
            </div>
        </div>
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
                 <NeighborhoodMap center={locationAnalysis.neighborhoodCoords} amenities={locationAnalysis.amenities} dataSource={locationAnalysis.dataSources.amenities} />
            </div>
             <div className="lg:col-span-2">
                 <SchoolInfo schools={locationAnalysis.topSchools} dataSource={locationAnalysis.dataSources.schools} />
             </div>
        </div>
      </div>
      
      {/* Section 6: Financial Advice */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">AI-Powered Financial Advice</h3>
        <div className="bg-black/20 border border-purple-500/10 p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <IdeaIcon />
                <h4 className="text-xl font-bold text-purple-400 mt-2">Actionable Next Steps</h4>
            </div>
            <ul className="list-decimal list-inside space-y-4 text-slate-300">
                {financialAdvice.actionableSteps.map((step, i) => (
                    <li key={i} className="text-lg">{step}</li>
                ))}
            </ul>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h5 className="font-bold text-green-400 mb-2">Pros</h5>
                    <ul className="list-disc list-inside space-y-2 text-slate-300">
                        {financialAdvice.pros.map((pro, i) => <li key={i}>{pro}</li>)}
                    </ul>
                </div>
                 <div>
                    <h5 className="font-bold text-red-400 mb-2">Cons</h5>
                    <ul className="list-disc list-inside space-y-2 text-slate-300">
                        {financialAdvice.cons.map((con, i) => <li key={i}>{con}</li>)}
                    </ul>
                </div>
            </div>
        </div>
      </div>
      
    </div>
  );
};

export default Results;