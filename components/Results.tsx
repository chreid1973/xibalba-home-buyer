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

// Import calculation utility
// Fix: Import from the newly created utility file and correct path
import { calculateMonthlyMortgage } from '../src/utils/financialCalculations';

interface ResultsProps {
  isLoading: boolean;
  error: string | null;
  result: AnalysisResult | null;
  userInput: UserInput | null;
}

// A component for displaying lists (pros, cons, steps)
const InfoList: React.FC<{ title: string; items: string[]; icon: React.ReactNode; color: string }> = ({ title, items, icon, color }) => (
  <div className="bg-slate-800/50 p-4 rounded-lg">
    <h3 className={`text-lg font-semibold mb-3 flex items-center ${color}`}>
      {icon}
      <span className="ml-2">{title}</span>
    </h3>
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start text-sm text-slate-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-400 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);


const Results: React.FC<ResultsProps> = ({ isLoading, error, result, userInput }) => {
    
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
        newDisplayData.personalBuyingReadinessScore = Math.max(1, Math.min(10, originalScore + scoreAdjustment));


        setDisplayData(newDisplayData);

    }, [simulatedInput, result, userInput]);


    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center text-center py-20 animate-fade-in">
                <svg className="animate-spin h-12 w-12 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <h2 className="text-3xl font-bold text-white mt-6">Crafting Your Analysis...</h2>
                <p className="text-slate-300 mt-2">Our AI is analyzing market data, your finances, and location details. This might take a moment.</p>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="text-center py-20 animate-fade-in bg-red-900/20 border border-red-500/30 p-8 rounded-lg">
                <h2 className="text-3xl font-bold text-red-400 mb-4">Analysis Failed</h2>
                <p className="text-slate-300 mb-6">We encountered an error while generating your report. Please try again later.</p>
                <pre className="text-left bg-slate-800 p-4 rounded-md text-sm text-red-300 overflow-x-auto">
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

    const { financialAdvice, affordability, marketAnalysis, locationAnalysis, totalCostOfOwnership, personalBuyingReadinessScore, breakEvenAnalysis } = displayData;

    return (
        <div className="animate-fade-in space-y-8">
            {/* Header Summary */}
            <header className="bg-slate-800/50 p-6 rounded-lg text-center">
                <p className="text-cyan-400 font-semibold">Overall Recommendation</p>
                <h2 className="text-4xl font-extrabold text-white my-2">{financialAdvice.overallRecommendation}</h2>
                <p className="text-slate-300 max-w-3xl mx-auto">{financialAdvice.chartInsights.readinessGauge}</p>
            </header>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <aside className="lg:col-span-1 space-y-8">
                    {simulatedInput && result && (
                         <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
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
                   
                    <InfoList title="Pros" items={financialAdvice.pros} icon={<span className="text-green-400">👍</span>} color="text-green-400" />
                    <InfoList title="Cons" items={financialAdvice.cons} icon={<span className="text-red-400">👎</span>} color="text-red-400" />
                    <InfoList title="Actionable Next Steps" items={financialAdvice.actionableSteps} icon={<span className="text-cyan-400">🚀</span>} color="text-cyan-400" />
                    
                    <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
                        <AffordabilityIndex priceToIncomeRatio={affordability.priceToIncomeRatio} />
                    </div>
                </aside>

                {/* Right Column (Charts) */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md text-slate-800 flex flex-col justify-between min-h-[300px]">
                        <MarketGauge score={personalBuyingReadinessScore} />
                        <p className="text-xs text-slate-500 text-center mt-2">{financialAdvice.chartInsights.readinessGauge}</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md text-slate-800 flex flex-col min-h-[300px]">
                        <OwnershipCostChart tco={totalCostOfOwnership} pith={affordability.monthlyPITH} />
                         <p className="text-xs text-slate-500 text-center mt-2">{financialAdvice.chartInsights.ownershipCost}</p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-md text-slate-800 flex flex-col min-h-[300px]">
                       <LocationRadarChart scores={locationAnalysis.scores} />
                       <p className="text-xs text-slate-500 text-center mt-2">{financialAdvice.chartInsights.locationRadar}</p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-md text-slate-800 flex flex-col min-h-[300px]">
                       <CommuteAnalysis commuteAnalysis={locationAnalysis.commuteAnalysis} />
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md text-slate-800 flex flex-col min-h-[300px]">
                        <MarketForecastChart marketData={marketAnalysis} tooltipText={financialAdvice.chartInsights.homePriceForecast} />
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
                        <NeighborhoodMap center={locationAnalysis.neighborhoodCoords} amenities={locationAnalysis.amenities} />
                    </div>
                    <div className="lg:col-span-2">
                        <SchoolInfo schools={locationAnalysis.topSchools} />
                    </div>
                </div>

                {breakEvenAnalysis && <BreakEvenAnalysis data={breakEvenAnalysis} />}

            </div>

            <Modal isOpen={isMapModalOpen} onClose={() => setMapModalOpen(false)}>
                 <div className="h-[80vh] w-full">
                    <NeighborhoodMap center={locationAnalysis.neighborhoodCoords} amenities={locationAnalysis.amenities} />
                 </div>
            </Modal>
        </div>
    );
};

export default Results;