import React, { useState } from 'react';
import type { UserInput, AnalysisResult } from './src/types';
import { getAIAnalysis } from './src/services/geminiService';

import Header from './components/Header';
import Hero from './components/Hero';
import InputForm from './components/InputForm';
import Results from './components/Results';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [view, setView] = useState<'hero' | 'form' | 'results'>('hero');
  const [userInput, setUserInput] = useState<UserInput | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartAnalysis = () => setView('form');

  const handleNewAnalysis = () => {
    setView('form');
    setAnalysisResult(null);
    setUserInput(null);
    setError(null);
  };

  const handleAnalyze = async (data: UserInput) => {
    setIsLoading(true);
    setError(null);
    setUserInput(data);
    setView('results');

    try {
      const result = await getAIAnalysis(data);
      setAnalysisResult(result);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`An error occurred while analyzing your data. Please try again. Details: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderContent = () => {
    switch (view) {
      case 'hero':
        return <Hero onStartAnalysis={handleStartAnalysis} />;
      case 'form':
        return (
           <div className="max-w-4xl mx-auto animate-fade-in">
             <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="md:col-span-1">
                    <InputForm onAnalyze={handleAnalyze} isLoading={isLoading} />
                </div>
                <div className="md:col-span-1 text-slate-300 p-6 bg-slate-800/50 rounded-lg hidden md:block">
                    <h3 className="text-xl font-bold text-cyan-400 mb-4">How It Works</h3>
                    <p className="text-slate-400 mb-4">
                        Unlock expert-level insights for your home buying journey. Our AI co-pilot synthesizes complex financial data and real-time market trends into a clear, personalized strategy, empowering you to make a confident and informed decision.
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-slate-400">
                      <li><span className="font-semibold text-slate-300">Personal Finances:</span> We assess your income, debt, and savings to determine what you can realistically afford.</li>
                      <li><span className="font-semibold text-slate-300">Market Conditions:</span> We analyze current and forecasted real estate trends in your desired area.</li>
                      <li><span className="font-semibold text-slate-300">Location Score:</span> We evaluate key neighborhood metrics like safety, schools, and amenities.</li>
                      <li><span className="font-semibold text-slate-300">Actionable Advice:</span> We synthesize all this data into clear, actionable recommendations to guide your decision.</li>
                    </ul>
                </div>
            </div>
           </div>
        );
      case 'results':
        return <Results isLoading={isLoading} error={error} result={analysisResult} userInput={userInput} />;
      default:
        return <Hero onStartAnalysis={handleStartAnalysis} />;
    }
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen font-sans antialiased">
      <Header showNewAnalysisButton={view === 'results'} onNewAnalysis={handleNewAnalysis} />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
}

export default App;