
import React, { useState, useEffect } from 'react';
import type { UserInput, AnalysisResult, User } from './src/types';
import { getAIAnalysis } from './src/services/geminiService';
import { authService } from './src/services/authService';
import { analysisService } from './src/services/analysisService';

import Header from './components/Header';
import Hero from './components/Hero';
import InputForm from './components/InputForm';
import Results from './components/Results';
import Footer from './components/Footer';
import LoadingAnalysis from './components/LoadingAnalysis';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [view, setView] = useState<'hero' | 'form' | 'loading' | 'results' | 'dashboard'>('hero');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [savedAnalyses, setSavedAnalyses] = useState<AnalysisResult[]>([]);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      fetchAnalyses(user);
    }
  }, []);
  
  const fetchAnalyses = async (user: User) => {
    const analyses = await analysisService.getAnalysesForUser(user);
    setSavedAnalyses(analyses);
  };

  const handleStartAnalysis = () => {
    setView('form');
    setAnalysisResult(null);
    setError(null);
  };

  const handleNewAnalysis = () => {
    setView('form');
    setAnalysisResult(null);
    setError(null);
  };

  const handleAnalyze = async (data: UserInput) => {
    setView('loading');
    setError(null);

    try {
      const result = await getAIAnalysis(data);
      setAnalysisResult(result);
      setView('results');
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`An error occurred while analyzing your data. Please try again. Details: ${errorMessage}`);
      setView('results');
    }
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    fetchAnalyses(user);
    if(view === 'hero') {
      setView('dashboard');
    }
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setSavedAnalyses([]);
    setView('hero');
  };

  const handleShowDashboard = () => {
    if(currentUser) {
        fetchAnalyses(currentUser);
        setView('dashboard');
    }
  };

  const handleViewAnalysis = (analysis: AnalysisResult) => {
    setAnalysisResult(analysis);
    setView('results');
  };

  const handleDeleteAnalysis = async (analysisId: string) => {
    if (currentUser) {
      await analysisService.deleteAnalysis(currentUser, analysisId);
      fetchAnalyses(currentUser); // Refresh list
    }
  };

  const handleSaveAnalysis = async (result: AnalysisResult) => {
      if (currentUser) {
          await analysisService.saveAnalysis(currentUser, result);
          await fetchAnalyses(currentUser);
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
                    <InputForm onAnalyze={handleAnalyze} isLoading={false} />
                </div>
                <div className="md:col-span-1 text-slate-300 p-6 bg-black/20 border border-purple-500/20 rounded-lg hidden md:block">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">How It Works</h3>
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
      case 'loading':
          return <LoadingAnalysis />;
      case 'results':
        return <Results 
                    error={error} 
                    result={analysisResult}
                    currentUser={currentUser}
                    onSave={handleSaveAnalysis}
                    isSaved={!!analysisResult?.id}
                />;
      case 'dashboard':
        return <Dashboard 
                 analyses={savedAnalyses}
                 onView={handleViewAnalysis}
                 onDelete={handleDeleteAnalysis}
                 onNewAnalysis={handleNewAnalysis}
               />;
      default:
        return <Hero onStartAnalysis={handleStartAnalysis} />;
    }
  };

  return (
    <div className="bg-transparent text-white min-h-screen font-sans antialiased">
      <Header 
        showNewAnalysisButton={view === 'results' || view === 'dashboard'} 
        onNewAnalysis={handleNewAnalysis}
        currentUser={currentUser}
        onShowAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onShowDashboard={handleShowDashboard}
      />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
      <Footer />
      <Auth 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onSignupSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default App;
