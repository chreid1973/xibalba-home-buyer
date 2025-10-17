
import React, { useState, useEffect } from 'react';
import type { AnalysisResult, User, TotalCostOfOwnership } from '../src/types';
import { CheckIcon } from './icons/CheckIcon';
import { WarningIcon } from './icons/WarningIcon';
import { StopIcon } from './icons/StopIcon';
import { IdeaIcon } from './icons/IdeaIcon';

import MarketGauge from './MarketGauge';
import OwnershipCostChart from './OwnershipCostChart';
import LocationRadarChart from './LocationRadarChart';
import Charts from './Charts';
import CommuteAnalysis from './CommuteAnalysis';
import BreakEvenAnalysis from './BreakEvenAnalysis';
import AffordabilityIndex from './AffordabilityIndex';
import NeighborhoodMap from './NeighborhoodMap';
import SchoolInfo from './SchoolInfo';
import VerdictExplainer from './VerdictExplainer';
import ScenarioSimulator from './ScenarioSimulator';

interface ResultsProps {
  error: string | null;
  result: AnalysisResult | null;
  currentUser: User | null;
  onSave: (result: AnalysisResult) => void;
  isSaved: boolean;
}

const VerdictReveal: React.FC<{ recommendation: string; onClick: () => void; }> = ({ recommendation, onClick }) => {
    let Icon = IdeaIcon;
    let color = 'from-sky-500 to-indigo-500';
    let text = "AI's Strategic Advice";
    
    if (recommendation.toLowerCase().includes('good') || recommendation.toLowerCase().includes('proceed')) {
        Icon = CheckIcon;
        color = 'from-green-500 to-emerald-500';
        text = "A Good Time to Buy";
    } else if (recommendation.toLowerCase().includes('caution')) {
        Icon = WarningIcon;
        color = 'from-yellow-500 to-amber-500';
        text = "Proceed with Caution";
    } else if (recommendation.toLowerCase().includes('strengthen') || recommendation.toLowerCase().includes('wait')) {
        Icon = StopIcon;
        color = 'from-red-500 to-rose-500';
        text = "Strengthen Finances First";
    }
    
    return (
        <div className="text-center p-6 bg-black/20 border border-purple-500/10 rounded-lg shadow-lg">
            <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br ${color} text-white mb-4`}>
                <Icon />
            </div>
            <h2 className="text-3xl font-bold text-white">{text}</h2>
            <p className="text-slate-400 mt-2">{recommendation}</p>
            <button onClick={onClick} className="text-sm text-purple-400 hover:text-purple-300 hover:underline mt-4">
                How is this calculated?
            </button>
        </div>
    );
};

const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 });

const Results: React.FC<ResultsProps> = ({ error, result: initialResult, currentUser, onSave, isSaved: isInitiallySaved }) => {
    const [isVerdictExplainerOpen, setIsVerdictExplainerOpen] = useState(false);
    const [result, setResult] = useState(initialResult);
    const [isSaved, setIsSaved] = useState(isInitiallySaved);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>(isInitiallySaved ? 'saved' : 'idle');

    useEffect(() => {
        setResult(initialResult);
        setIsSaved(isInitiallySaved);
        setSaveStatus(isInitiallySaved ? 'saved' : 'idle');
    }, [initialResult, isInitiallySaved]);

    const handleSave = async () => {
        if (result && !isSaved) {
            setSaveStatus('saving');
            await onSave(result);
            setSaveStatus('saved');
            setIsSaved(true);
        }
    };


    if (error) {
        return (
            <div className="text-center py-20 animate-fade-in bg-red-900/20 border border-red-500/30 rounded-lg p-8">
                <h2 className="text-3xl font-bold text-red-400">Analysis Failed</h2>
                <p className="text-slate-300 mt-4 max-w-2xl mx-auto">{error}</p>
                <p className="text-slate-400 mt-2 text-sm">Please try starting a new analysis. If the problem persists, the AI service might be temporarily unavailable.</p>
            </div>
        );
    }

    if (!result) {
        return (
             <div className="text-center py-20 animate-fade-in">
                <p className="text-slate-300">No analysis data available. Please start a new analysis.</p>
            </div>
        );
    }
    
    const { userInput } = result;
    
    const handleScenarioChange = (data: { homePrice: number; downPayment: number; interestRate: number }) => {
        const loanAmount = data.homePrice - data.downPayment;
        const monthlyPI = (loanAmount * (data.interestRate/100/12)) / (1 - Math.pow(1 + (data.interestRate/100/12), -30*12));
        const newTotalCost = monthlyPI + result.totalCostOfOwnership.estimatedTaxes + result.totalCostOfOwnership.estimatedInsurance + result.totalCostOfOwnership.estimatedUtilities + result.totalCostOfOwnership.estimatedMaintenance;

        const newTCO: TotalCostOfOwnership = {
            ...result.totalCostOfOwnership,
            principalAndInterest: monthlyPI,
            totalMonthlyCost: newTotalCost
        };
        
        setResult({
            ...result,
            totalCostOfOwnership: newTCO,
            userInput: {
                ...userInput,
                targetHomePrice: data.homePrice,
                downPayment: data.downPayment,
            }
        });
    };

    const handleResetScenario = () => {
        setResult(initialResult);
    };


    const { financialAdvice, personalBuyingReadinessScore, affordability, marketAnalysis, locationAnalysis, totalCostOfOwnership, breakEvenAnalysis, methodology } = result;

    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Analysis for <span className="text-purple-400">{userInput.postalCode}, {userInput.city}</span></h2>
                {currentUser && (
                    <button 
                        onClick={handleSave} 
                        disabled={saveStatus !== 'idle'}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md text-sm transition-all duration-200 transform hover:scale-105 shadow-lg shadow-purple-500/20 disabled:bg-green-600 disabled:shadow-green-500/20 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        {saveStatus === 'saved' ? 'Saved ✓' : (saveStatus === 'saving' ? 'Saving...' : 'Save This Analysis')}
                    </button>
                )}
            </div>

            <VerdictReveal recommendation={financialAdvice.overallRecommendation} onClick={() => setIsVerdictExplainerOpen(true)} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-black/20 border border-purple-500/10 p-4 rounded-lg shadow-lg">
                        <ScenarioSimulator
                          homePrice={userInput.targetHomePrice}
                          downPayment={userInput.downPayment}
                          interestRate={marketAnalysis.interestRateForecast[0]?.rate || 5.5}
                          minHomePrice={userInput.targetHomePrice * 0.8}
                          maxHomePrice={userInput.targetHomePrice * 1.2}
                          minDownPayment={userInput.downPayment * 0.5}
                          maxDownPayment={userInput.downPayment * 1.5}
                          onScenarioChange={handleScenarioChange}
                          onReset={handleResetScenario}
                        />
                    </div>

                    <div className="bg-black/20 border border-purple-500/10 p-4 rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold text-purple-400 mb-4 text-center">Your Affordability</h3>
                        <div className="space-y-3 text-center">
                            <div>
                                <p className="text-sm text-slate-400">Max Affordable Price</p>
                                <p className="text-2xl font-bold text-white">{currencyFormatter.format(affordability.maxAffordableHomePrice)}</p>
                            </div>
                             <div>
                                <p className="text-sm text-slate-400">Total Debt Service Ratio</p>
                                <p className="text-2xl font-bold text-white">{(affordability.tdsRatio).toFixed(1)}%</p>
                            </div>
                        </div>
                         <AffordabilityIndex priceToIncomeRatio={affordability.priceToIncomeRatio} methodology={methodology.affordability} />
                    </div>

                    <div className="bg-black/20 border border-purple-500/10 p-4 rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold text-purple-400 mb-2">Pros</h3>
                        <ul className="list-disc list-inside space-y-2 text-slate-300">
                            {financialAdvice.pros.map((pro, i) => <li key={i}>{pro}</li>)}
                        </ul>
                    </div>
                     <div className="bg-black/20 border border-purple-500/10 p-4 rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold text-purple-400 mb-2">Cons</h3>
                        <ul className="list-disc list-inside space-y-2 text-slate-300">
                            {financialAdvice.cons.map((con, i) => <li key={i}>{con}</li>)}
                        </ul>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-black/20 border border-purple-500/10 p-4 rounded-lg shadow-lg min-h-[220px] flex"><MarketGauge score={personalBuyingReadinessScore} title="Buying Readiness Score" tooltipText={financialAdvice.chartInsights.readinessGauge} methodology={methodology.readinessScore}/></div>
                        <div className="bg-black/20 border border-purple-500/10 p-4 rounded-lg shadow-lg min-h-[220px] flex"><OwnershipCostChart tco={totalCostOfOwnership} pith={affordability.monthlyPITH} methodology={methodology.totalCostOfOwnership} /></div>
                    </div>

                    <div>
                        <Charts marketData={marketAnalysis} insights={financialAdvice.chartInsights} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <div className="md:col-span-1 bg-black/20 border border-purple-500/10 p-4 rounded-lg shadow-lg min-h-[220px] flex"><CommuteAnalysis commuteAnalysis={locationAnalysis.commuteAnalysis} /></div>
                       <div className="md:col-span-1 bg-black/20 border border-purple-500/10 p-4 rounded-lg shadow-lg min-h-[220px] flex"><LocationRadarChart scores={locationAnalysis.scores} dataSource={locationAnalysis.dataSources.scores} /></div>
                       <div className="md:col-span-1 bg-black/20 border border-purple-500/10 p-4 rounded-lg shadow-lg min-h-[220px] flex"><BreakEvenAnalysis analysis={breakEvenAnalysis} methodology={methodology.breakEvenAnalysis} /></div>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                 <div className="lg:col-span-3">
                     <NeighborhoodMap center={locationAnalysis.neighborhoodCoords} amenities={locationAnalysis.amenities} dataSource={locationAnalysis.dataSources.amenities} />
                 </div>
                 <div className="lg:col-span-2 space-y-6">
                    <SchoolInfo schools={locationAnalysis.topSchools} dataSource={locationAnalysis.dataSources.schools} />
                    <div className="bg-black/20 border border-purple-500/10 p-4 rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold text-purple-400 mb-2">Actionable Next Steps</h3>
                        <ul className="list-disc list-inside space-y-2 text-slate-300">
                            {financialAdvice.actionableSteps.map((step, i) => <li key={i}>{step}</li>)}
                        </ul>
                    </div>
                 </div>
            </div>

            <VerdictExplainer 
                isOpen={isVerdictExplainerOpen}
                onClose={() => setIsVerdictExplainerOpen(false)}
                readinessScore={personalBuyingReadinessScore}
                marketHealthIndex={marketAnalysis.marketHealthIndex}
                marketForecast={marketAnalysis.forecastSummary}
                locationScore={locationAnalysis.overallLocationScore}
                locationSummary={locationAnalysis.overallSummary}
            />
        </div>
    );
}

export default Results;
