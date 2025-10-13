import React, { useState, useEffect, useRef } from 'react';
import type { AnalysisResult, PersonalizedAdvice, LocationAnalysis, ScoreWithExplanation, UserInput, ChatMessage, TotalCostOfOwnership } from '../types';

interface ResultsProps {
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  initialUserInput: UserInput | null;
  onUpdateAdvice: (updatedFinances: Partial<UserInput>) => void;
  chatHistory: ChatMessage[];
  isChatLoading: boolean;
  onSendMessage: (message: string) => void;
}

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode, disabled?: boolean }> = ({ active, onClick, children, disabled=false }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`px-4 py-2 text-sm font-medium rounded-t-lg focus:outline-none transition-colors duration-200 ${
            active ? 'bg-slate-700 text-cyan-400' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
        } ${disabled ? 'cursor-not-allowed text-slate-600' : ''}`}
    >
        {children}
    </button>
);

const RecommendationPill: React.FC<{ recommendation: PersonalizedAdvice['recommendation'] }> = ({ recommendation }) => {
    const baseClasses = "px-4 py-1 text-sm font-bold rounded-full inline-block";
    let colorClasses = "";
    switch(recommendation) {
        case 'Good Time to Buy': colorClasses = "bg-green-500/20 text-green-300"; break;
        case 'Proceed with Caution': colorClasses = "bg-yellow-500/20 text-yellow-300"; break;
        case 'Consider Waiting': colorClasses = "bg-red-500/20 text-red-300"; break;
    }
    return <span className={`${baseClasses} ${colorClasses}`}>{recommendation}</span>
}

const ScoreDial: React.FC<{ score: number }> = ({ score }) => {
    const numericScore = score || 0;
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (numericScore / 10) * circumference;
    const color = numericScore > 7 ? 'text-green-400' : numericScore > 4 ? 'text-yellow-400' : 'text-red-400';

    return (
        <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r={radius} fill="none" strokeWidth="12" className="stroke-slate-700" />
                <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="none"
                    strokeWidth="12"
                    className={`stroke-current ${color} transition-all duration-1000 ease-out`}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    transform="rotate(-90 60 60)"
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className={`text-3xl font-bold ${color}`}>{numericScore}</span>
                <span className="text-xs text-slate-400">/ 10</span>
            </div>
        </div>
    );
};


const FinancialSimulator: React.FC<{ initialUserInput: UserInput, onUpdate: (data: Partial<UserInput>) => void, isLoading: boolean }> = ({ initialUserInput, onUpdate, isLoading }) => {
    const [finances, setFinances] = useState({
        targetHomePrice: initialUserInput.targetHomePrice ?? 0,
        downPayment: initialUserInput.downPayment ?? 0,
        monthlyDebt: initialUserInput.monthlyDebt ?? 0,
    });

    useEffect(() => {
        setFinances({
            targetHomePrice: initialUserInput.targetHomePrice ?? 0,
            downPayment: initialUserInput.downPayment ?? 0,
            monthlyDebt: initialUserInput.monthlyDebt ?? 0,
        })
    }, [initialUserInput]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFinances(prev => ({ ...prev, [e.target.name]: Number(e.target.value) }));
    }

    const handleUpdate = () => {
        onUpdate(finances);
    }

    return (
        <div className="mt-8 bg-slate-900/50 p-4 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold text-cyan-400 mb-3">"What If?" Financial Simulator</h3>
            <div className="space-y-3">
                 <div>
                    <label className="block text-xs font-medium text-slate-400">Target Home Price</label>
                    <input type="number" name="targetHomePrice" value={finances.targetHomePrice} onChange={handleChange} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 text-white text-sm" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-400">Down Payment</label>
                    <input type="number" name="downPayment" value={finances.downPayment} onChange={handleChange} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 text-white text-sm" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-400">Monthly Debt</label>
                    <input type="number" name="monthlyDebt" value={finances.monthlyDebt} onChange={handleChange} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 text-white text-sm" />
                </div>
                <button onClick={handleUpdate} disabled={isLoading} className="w-full text-sm py-2 px-3 border border-transparent rounded-md shadow-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-500">
                    {isLoading ? 'Updating...' : 'Update Advice'}
                </button>
            </div>
        </div>
    );
}

const TotalCostView: React.FC<{ costs: TotalCostOfOwnership, piths: number }> = ({ costs, piths }) => (
    <div className="mt-8">
        <h3 className="text-lg font-semibold text-cyan-400 mb-3">Estimated Total Cost of Ownership</h3>
        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-400">Mortgage, Tax, Heat (PITH)</span><span>${(piths || 0).toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Est. Home Insurance</span><span>${(costs.estimatedInsurance || 0).toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Est. Utilities</span><span>${(costs.estimatedUtilities || 0).toFixed(2)}</span></div>
            <div className="flex justify-between border-b border-slate-700 pb-2"><span className="text-slate-400">Est. Maintenance Fund</span><span>${(costs.estimatedMaintenance || 0).toFixed(2)}</span></div>
            <div className="flex justify-between font-bold pt-2 text-base"><span className="text-cyan-400">Total Estimated Monthly Cost</span><span>${(costs.totalMonthlyCost || 0).toFixed(2)}</span></div>
        </div>
    </div>
);


const PersonalizedAdviceView: React.FC<{ advice: PersonalizedAdvice; initialUserInput: UserInput; onUpdateAdvice: (data: Partial<UserInput>) => void; isLoading: boolean }> = ({ advice, initialUserInput, onUpdateAdvice, isLoading }) => {
    const { recommendation, score, summary, pros, cons, nextSteps, totalCostOfOwnership, estimatedMonthlyHousingCost } = advice;

    return (
        <>
            <div className="flex flex-col md:flex-row items-center justify-between mb-6 border-b border-slate-700 pb-6">
                <div className='flex-1 mb-4 md:mb-0'>
                    <h2 className="text-2xl font-bold text-cyan-400 mb-2">Your Personal Fit</h2>
                    {recommendation && <RecommendationPill recommendation={recommendation} />}
                </div>
                <div className='flex-shrink-0'>
                    <ScoreDial score={score} />
                </div>
            </div>
            
            {summary && <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Summary</h3>
                <p className="text-slate-300 leading-relaxed">{summary}</p>
            </div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {Array.isArray(pros) && pros.length > 0 && <div>
                    <h3 className="text-lg font-semibold text-green-400 mb-2">Pros</h3>
                    <ul className="space-y-2">
                        {pros.map((pro, index) => (
                            <li key={index} className="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                <span className="text-slate-300">{pro}</span>
                            </li>
                        ))}
                    </ul>
                </div>}
                {Array.isArray(cons) && cons.length > 0 && <div>
                    <h3 className="text-lg font-semibold text-red-400 mb-2">Cons</h3>
                     <ul className="space-y-2">
                        {cons.map((con, index) => (
                            <li key={index} className="flex items-start">
                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-10.707a1 1 0 00-1.414-1.414L10 8.586 7.707 6.293a1 1 0 00-1.414 1.414L8.586 10l-2.293 2.293a1 1 0 101.414 1.414L10 11.414l2.293 2.293a1 1 0 001.414-1.414L11.414 10l2.293-2.293z" clipRule="evenodd" /></svg>
                                <span className="text-slate-300">{con}</span>
                            </li>
                        ))}
                    </ul>
                </div>}
            </div>

            {totalCostOfOwnership && <TotalCostView costs={totalCostOfOwnership} piths={estimatedMonthlyHousingCost} />}

            {Array.isArray(nextSteps) && nextSteps.length > 0 && <div className="mt-8">
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">Suggested Next Steps</h3>
                <ul className="space-y-2">
                    {nextSteps.map((step, index) => (
                        <li key={index} className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400 mr-2 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            <span className="text-slate-300">{step}</span>
                        </li>
                    ))}
                </ul>
            </div>}
            
            <FinancialSimulator initialUserInput={initialUserInput} onUpdate={onUpdateAdvice} isLoading={isLoading} />
        </>
    );
};

const ScoreBar: React.FC<{ score: number; label: string }> = ({ score, label }) => {
    const numericScore = score || 0;
    const color = numericScore > 7 ? 'bg-green-500' : numericScore > 4 ? 'bg-yellow-500' : 'bg-red-500';
    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-slate-300">{label}</span>
                <span className="text-sm font-bold text-white">{numericScore}/10</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2.5">
                <div className={`${color} h-2.5 rounded-full`} style={{ width: `${numericScore * 10}%` }}></div>
            </div>
        </div>
    );
};

const ScoreItem: React.FC<{ label: string; scoreData: ScoreWithExplanation }> = ({ label, scoreData }) => {
    if (!scoreData) return null;
    return (
        <div>
            <ScoreBar label={label} score={scoreData.score} />
            <p className="text-xs text-slate-400 mt-1.5 pl-1">{scoreData.explanation}</p>
        </div>
    );
};


const LocationAnalysisView: React.FC<{ analysis: LocationAnalysis }> = ({ analysis }) => {
    const { keyMetrics, neighborhoodVibe, goodFor, scores } = analysis;
    return (
        <>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Location Deep Dive</h2>
            
            {keyMetrics && <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-center">
                <div className="bg-slate-900 p-4 rounded-lg"><div className="text-sm text-slate-400">Population</div><div className="text-xl font-bold">{keyMetrics.population}</div></div>
                <div className="bg-slate-900 p-4 rounded-lg"><div className="text-sm text-slate-400">Median Income</div><div className="text-xl font-bold">{keyMetrics.medianIncome}</div></div>
                <div className="bg-slate-900 p-4 rounded-lg"><div className="text-sm text-slate-400">Avg. Age</div><div className="text-xl font-bold">{keyMetrics.dominantAgeGroup}</div></div>
            </div>}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {neighborhoodVibe && <div>
                    <h3 className="text-lg font-semibold mb-2">Neighborhood Vibe</h3>
                    <p className="text-slate-300 leading-relaxed bg-slate-900 p-4 rounded-lg">{neighborhoodVibe}</p>
                </div>}
                {Array.isArray(goodFor) && goodFor.length > 0 && <div>
                    <h3 className="text-lg font-semibold mb-2">Ideal For</h3>
                    <div className="flex flex-wrap gap-2 bg-slate-900 p-4 rounded-lg">
                        {goodFor.map((item, i) => <span key={i} className="bg-cyan-500/20 text-cyan-300 text-xs font-medium px-2.5 py-1 rounded-full">{item}</span>)}
                    </div>
                </div>}
            </div>
            
            {scores && <div>
                 <h3 className="text-lg font-semibold text-cyan-400 mb-3">Location Scorecard</h3>
                 <div className="space-y-5">
                     <ScoreItem label="Affordability" scoreData={scores.affordability} />
                     <ScoreItem label="Job Market" scoreData={scores.jobMarket} />
                     <ScoreItem label="Safety" scoreData={scores.safety} />
                     <ScoreItem label="Schools" scoreData={scores.schools} />
                     <ScoreItem label="Amenities" scoreData={scores.amenities} />
                 </div>
            </div>}
        </>
    );
};

const ChatView: React.FC<{ history: ChatMessage[], isLoading: boolean, onSendMessage: (message: string) => void }> = ({ history, isLoading, onSendMessage }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    
    useEffect(() => {
        scrollToBottom();
    }, [history, isLoading]);
    
    const handleSend = () => {
        if (input.trim()) {
            onSendMessage(input);
            setInput('');
        }
    };

    return (
        <div className="flex flex-col h-[600px]">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Chat with AI</h2>
            <div className="flex-grow bg-slate-900/50 rounded-lg p-4 overflow-y-auto mb-4 border border-slate-700 flex flex-col space-y-4">
                {history.map((msg, index) => (
                    <div key={index} className={`flex items-start ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                         <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }} className={`max-w-md px-4 py-3 rounded-xl ${msg.role === 'user' ? 'bg-cyan-600' : 'bg-slate-700'} text-white`}>
                           {msg.content}
                        </div>
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex justify-start">
                        <div className="px-4 py-3 rounded-xl bg-slate-700 text-white">
                           <div className="flex items-center justify-center space-x-1.5">
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                           </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="flex">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                    className="flex-grow bg-slate-700 border-slate-600 rounded-l-md py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                    placeholder="Ask a follow-up question..."
                    disabled={isLoading}
                />
                <button onClick={handleSend} disabled={isLoading} className="bg-cyan-600 text-white px-4 py-2 rounded-r-md hover:bg-cyan-700 disabled:bg-slate-500">Send</button>
            </div>
        </div>
    );
};

const Results: React.FC<ResultsProps> = ({ result, isLoading, error, initialUserInput, onUpdateAdvice, chatHistory, isChatLoading, onSendMessage }) => {
  const [activeTab, setActiveTab] = useState<'advice' | 'location' | 'chat'>('advice');

  if (isLoading && !result) {
      return (
      <div className="bg-slate-800 p-8 rounded-lg shadow-lg flex flex-col items-center justify-center text-center min-h-[300px]">
        <svg className="animate-spin h-10 w-10 text-cyan-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <h3 className="text-xl font-semibold text-white">Generating Your Personalized Analysis...</h3>
        <p className="text-slate-400 mt-2">The AI is crunching the numbers. This might take a moment.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/50 border border-red-700 text-red-300 p-6 rounded-lg shadow-lg text-center min-h-[300px] flex flex-col items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
        <h3 className="text-xl font-semibold">Analysis Failed</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!result || !initialUserInput) {
    return (
      <div className="bg-slate-800 p-8 rounded-lg shadow-lg flex flex-col items-center justify-center text-center min-h-[300px]">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-xl font-semibold text-white">Awaiting Your Details</h3>
        <p className="text-slate-400 mt-2">Fill out your financial profile to get started.</p>
      </div>
    );
  }
  
  useEffect(() => {
    setActiveTab('advice');
  }, [result]);


  return (
    <div className="bg-slate-800 rounded-lg shadow-lg animate-fade-in">
        <div className="flex border-b border-slate-700 px-4">
            <TabButton active={activeTab === 'advice'} onClick={() => setActiveTab('advice')}>Your Fit</TabButton>
            <TabButton active={activeTab === 'location'} onClick={() => setActiveTab('location')}>The Place</TabButton>
            <TabButton active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} disabled={!result}>Chat with AI</TabButton>
        </div>
        <div className="p-6">
            {activeTab === 'advice' && <PersonalizedAdviceView advice={result.personalizedAdvice} initialUserInput={initialUserInput} onUpdateAdvice={onUpdateAdvice} isLoading={isLoading} />}
            {activeTab === 'location' && <LocationAnalysisView analysis={result.locationAnalysis} />}
            {activeTab === 'chat' && <ChatView history={chatHistory} isLoading={isChatLoading} onSendMessage={onSendMessage} />}
        </div>
    </div>
  );
};

export default Results;