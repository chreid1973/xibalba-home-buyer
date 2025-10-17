import React, { useState, useEffect } from 'react';
// FIx: Corrected import path
import type { AnalysisResult, UserInput } from '../types';

// Import all the visualization components
import MarketGauge from './MarketGauge';
import OwnershipCostChart from './OwnershipCostChart';
import LocationRadarChart from './LocationRadarChart';
import MarketForecastChart from './Charts';
import TrendChart from './TrendChart';
import CommuteAnalysis from './CommuteAnalysis';
import AffordabilityIndex from './AffordabilityIndex';
import SchoolInfo from './SchoolInfo';
import NeighborhoodMap from './NeighborhoodMap';
// Fix: Import from the newly created component file
import ScenarioSimulator from './ScenarioSimulator';
// Fix: Import from the newly created component file
import BreakEvenAnalysis from './BreakEvenAnalysis';
import Modal from './Modal';
import Citation from './Citation';

// Import calculation utility
// Fix: Import from the newly created utility file and correct path
import { calculateMonthlyMortgage } from '../src/utils/financialCalculations';

interface ResultsProps {
  error: string | null;
  result: AnalysisResult | null;
  userInput: UserInput | null;
}

// A component for displaying lists (pros, cons, steps)
const InfoList: React.FC<{ title: string; items: string[]; icon: React.ReactNode; color: string; delay: number }> = ({ title, items, icon, color, delay }) => (
  <div className="bg-black/20 border border-purple-500/10 p-4 rounded-lg">
    <h3 className={`text-lg font-semibold mb-3 flex items-center ${color}`}>
      {icon}
      <span className="ml-2">{title}</span>
    </h3>
    <ul className="space-y-2 animate-stagger-in">
      {items.map((item, index) => (
        <li key={index} className="flex items-start text-sm text-slate-300" style={{ animationDelay: `${delay + index * 100}ms` }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);


const Results: React.FC<ResultsProps> = ({ error, result, userInput }) => {
    
    // State for the scenario simulator
    const [simulatedInput, setSimulatedInput] = useState<{
        homePrice: number;
        downPayment: number;
        interestRate: number;
    } | null>(null);

    // State for the modal
    const [isMapModalOpen, setMapModalOpen] = useState(false);
    
    // Derived state for display, based on original result or simulated data
    const [displayData, setDisplayData] = useState<AnalysisResult | null>(result);
    const [readinessGaugeText, setReadinessGaugeText] = useState('');


    useEffect(() => {
        if (result && userInput) {
            // Set initial state for simulator and display data
            const initialSimState = {
                homePrice: userInput.targetHomePrice,
                downPayment: userInput.downPayment,
                interestRate: result.marketAnalysis.interestRateForecast[0]?.rate || 5.5,
            };
            setSimulatedInput(initialSimState);
            setDisplayData(result);
            setReadinessGaugeText(result.financialAdvice.chartInsights.readinessGauge);
        }
    }, [result, userInput]);

    // Recalculate parts of the analysis when simulator values change
    useEffect(() => {
        if (!simulatedInput || !result || !userInput) {
            setDisplayData(result);
            return;
        }

        // Create a deep copy to avoid mutating original result
        const newDisplayData = JSON.parse(JSON.stringify(result));
        
        // Recalculate affordability and TCO based on simulated inputs
        const loanAmount = simulatedInput.homePrice - simulatedInput.downPayment;
        const monthlyMortgage = calculateMonthlyMortgage(loanAmount, simulatedInput.interestRate, 30); // Assuming 30-year fixed

        newDisplayData.totalCostOfOwnership.principalAndInterest = monthlyMortgage;
        
        // A simple recalculation of total monthly cost
        newDisplayData.totalCostOfOwnership.totalMonthlyCost =
            monthlyMortgage +
            newDisplayData.totalCostOfOwnership.estimatedTaxes +
            newDisplayData.totalCostOfOwnership.estimatedInsurance +
            newDisplayData.totalCostOfOwnership.estimatedUtilities +
            newDisplayData.totalCostOfOwnership.estimatedMaintenance;
        
        newDisplayData.affordability.monthlyPITH = monthlyMortgage + newDisplayData.totalCostOfOwnership.estimatedTaxes + newDisplayData.totalCostOfOwnership.estimatedInsurance;
        
        // Recalculate readiness score based on how simulated price compares to max affordable price
        const originalScore = result.personalBuyingReadinessScore;
        const affordabilityRatio = result.affordability.maxAffordableHomePrice / simulatedInput.homePrice;
        // Simple heuristic: adjust score by up to +/- 1.5 based on affordability
        let scoreAdjustment = (affordabilityRatio - 1) * 5; 
        scoreAdjustment = Math.max(-1.5, Math.min(1.5, scoreAdjustment));
        const newScore = Math.max(1, Math.min(10, originalScore + scoreAdjustment));
        newDisplayData.personalBuyingReadinessScore = newScore;

        // Update the readiness gauge text
        const originalText = result.financialAdvice.chartInsights.readinessGauge;
        const isDifferent = Math.abs(newScore - originalScore) >= 0.1;
        if (isDifferent) {
            const changeDirection = newScore > originalScore ? 'improved' : 'decreased';
            
            const originalScoreText = originalScore.toFixed(1).replace('.', '\\.');
            
            // This regex is designed to be flexible and robustly find various ways the AI might phrase the score
            // at the beginning of the sentence, specifically targeting the original score value.
            const scoreRemovalRegex = new RegExp(
                `^(?:(?:Your|The|A)\\s+)?(?:\\w+\\s+)?(?:readiness\\s+)?score(?:\\s+of)?\\s+${originalScoreText}\\s*`,
                'i'
            );

            // Replace the old score phrase only if it's found, otherwise use the original text.
            const cleanedOriginalText = originalText.replace(scoreRemovalRegex, 'This score ');

            setReadinessGaugeText(`With these adjustments, your score has ${changeDirection} to ${newScore.toFixed(1)}. ${cleanedOriginalText}`);
        } else {
            setReadinessGaugeText(originalText);
        }

        setDisplayData(newDisplayData);

    }, [simulatedInput, result, userInput]);


    if (error) {
        return (
            <div className="text-center py-20 animate-fade-in bg-red-900/20 border border-red-500/30 p-8 rounded-lg">
                <h2 className="text-3xl font-bold text-red-400 mb-4">Analysis Failed</h2>
                <p className="text-slate-300 mb-6">We encountered an error while generating your report. Please try again later.</p>
                <pre className="text-left bg-slate-900 p-4 rounded-md text-sm text-red-300 overflow-x-auto">
                    <code>{error}</code>
                </pre>
            </div>
        );
    }

    if (!displayData || !userInput) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-slate-300">No analysis data available.</h2>
                <p className="text-slate-400">Please start a new analysis to see results.</p>
            </div>
        );
    }

    const { financialAdvice, affordability, marketAnalysis, locationAnalysis, totalCostOfOwnership, personalBuyingReadinessScore, breakEvenAnalysis, methodology } = displayData;

    return (
        <div className="animate-fade-in space-y-8">
            {/* Header Summary */}
            <header className="bg-black/20 border border-purple-500/20 p-6 rounded-lg text-center shadow-lg">
                <p className="text-purple-400 font-semibold">Overall Recommendation</p>
                <h2 className="text-4xl font-extrabold text-white my-2">{financialAdvice.overallRecommendation}</h2>
                <p className="text-slate-300 max-w-3xl mx-auto">{financialAdvice.chartInsights.readinessGauge}</p>
            </header>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <aside className="lg:col-span-1 space-y-8">
                    {simulatedInput && result && (
                         <div className="bg-black/20 border border-purple-500/10 p-6 rounded-lg shadow-lg">
                             <ScenarioSimulator
                                homePrice={simulatedInput.homePrice}
                                downPayment={simulatedInput.downPayment}
                                interestRate={simulatedInput.interestRate}
                                minHomePrice={result.affordability.maxAffordableHomePrice * 0.7}
                                maxHomePrice={result.affordability.maxAffordableHomePrice * 1.3}
                                minDownPayment={userInput.downPayment * 0.5}
                                maxDownPayment={userInput.downPayment * 2}
                                onScenarioChange={setSimulatedInput}
                                onReset={() => setSimulatedInput({
                                    homePrice: userInput.targetHomePrice,
                                    downPayment: userInput.downPayment,
                                    interestRate: result.marketAnalysis.interestRateForecast[0]?.rate || 5.5
                                })}
                            />
                         </div>
                    )}
                   
                    <InfoList title="Pros" items={financialAdvice.pros} icon={<span className="text-green-400">👍</span>} color="text-green-400" delay={0} />
                    <InfoList title="Cons" items={financialAdvice.cons} icon={<span className="text-red-400">👎</span>} color="text-red-400" delay={200} />
                    <InfoList title="Actionable Next Steps" items={financialAdvice.actionableSteps} icon={<span className="text-purple-400">🚀</span>} color="text-purple-400" delay={400} />
                    
                    <div className="bg-black/20 border border-purple-500/10 p-6 rounded-lg shadow-lg">
                        <AffordabilityIndex 
                            priceToIncomeRatio={affordability.priceToIncomeRatio} 
                            methodology={methodology.affordability}
                        />
                    </div>
                </aside>

                {/* Right Column (Charts) */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md text-slate-800 flex flex-col justify-between min-h-[300px]">
                        <div className="flex justify-center items-center">
                            <h3 className="font-bold text-center text-slate-700">Personal Buying Readiness</h3>
                            <Citation title="Methodology" content={methodology.readinessScore} />
                        </div>
                        <MarketGauge score={personalBuyingReadinessScore} />
                        <p className="text-xs text-slate-500 text-center mt-2 px-4">{readinessGaugeText}</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md text-slate-800 flex flex-col min-h-[300px]">
                        <OwnershipCostChart tco={totalCostOfOwnership} pith={affordability.monthlyPITH} methodology={methodology.totalCostOfOwnership} />
                         <p className="text-xs text-slate-500 text-center mt-2 px-4">{financialAdvice.chartInsights.ownershipCost}</p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-md text-slate-800 flex flex-col min-h-[300px]">
                       <LocationRadarChart scores={locationAnalysis.scores} dataSource={locationAnalysis.dataSources.scores} />
                       <p className="text-xs text-slate-500 text-center mt-2 px-4">{financialAdvice.chartInsights.locationRadar}</p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-md text-slate-800 flex flex-col min-h-[300px]">
                       <CommuteAnalysis commuteAnalysis={locationAnalysis.commuteAnalysis} />
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md text-slate-800 flex flex-col min-h-[300px]">
                        <MarketForecastChart 
                            marketData={marketAnalysis} 
                            tooltipText={financialAdvice.chartInsights.homePriceForecast}
                            dataSource={marketAnalysis.dataSource}
                        />
                    </div>

                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-md text-slate-800 flex flex-col min-h-[250px]">
                            <TrendChart data={marketAnalysis.interestRateForecast} dataKey="rate" xAxisKey="quarter" title="Interest Rate Forecast" formatter={(val) => `${val.toFixed(2)}%`} tooltipText={financialAdvice.chartInsights.interestRateForecast} />
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md text-slate-800 flex flex-col min-h-[250px]">
                            <TrendChart data={marketAnalysis.inventoryLevels} dataKey="level" xAxisKey="quarter" title="Housing Inventory Levels" formatter={(val) => val.toLocaleString()} tooltipText={financialAdvice.chartInsights.inventoryLevels} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Full-width Section */}
            <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-3">
                        <NeighborhoodMap center={locationAnalysis.neighborhoodCoords} amenities={locationAnalysis.amenities} dataSource={locationAnalysis.dataSources.amenities} />
                    </div>
                    <div className="lg:col-span-2">
                        <SchoolInfo schools={locationAnalysis.topSchools} dataSource={locationAnalysis.dataSources.schools} />
                    </div>
                </div>

                {breakEvenAnalysis && <BreakEvenAnalysis data={breakEvenAnalysis} methodology={methodology.breakEvenAnalysis} />}

            </div>

            <Modal isOpen={isMapModalOpen} onClose={() => setMapModalOpen(false)}>
                 <div className="h-[80vh] w-full">
                    <NeighborhoodMap center={locationAnalysis.neighborhoodCoords} amenities={locationAnalysis.amenities} dataSource={locationAnalysis.dataSources.amenities} />
                 </div>
            </Modal>
        </div>
    );
};

export default Results;