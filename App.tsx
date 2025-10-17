import React, { useState, useEffect, useCallback } from 'react';
import type { User, UserInput, AnalysisResult } from './src/types';

import Header from './components/Header';
import Hero from './components/Hero';
import InputForm from './components/InputForm';
import LoadingAnalysis from './components/LoadingAnalysis';
import Results from './components/Results';
import Footer from './components/Footer';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Compare from './components/Compare';

import { getAIAnalysis } from './services/geminiService';
import { authService } from './src/services/authService';
import { analysisService } from './src/services/analysisService';

type View = 'hero' | 'form' | 'loading' | 'results' | 'dashboard' | 'compare';

const App: React.FC = () => {
  const [view, setView] = useState<View>('hero');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const [savedAnalyses, setSavedAnalyses] = useState<AnalysisResult[]>([]);
  const [analysesToCompare, setAnalysesToCompare] = useState<AnalysisResult[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  const fetchAnalyses = useCallback(async (user: User) => {
    try {
      const analyses = await analysisService.getAnalyses(user.uid);
      setSavedAnalyses(analyses);
    } catch (err) {
      console.error("Failed to fetch analyses:", err);
      // Handle error display if necessary
    }
  }, []);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(user => {
      setCurrentUser(user);
      if (user) {
        fetchAnalyses(user);
      } else {
        setSavedAnalyses([]);
      }
    });
    return () => unsubscribe();
  }, [fetchAnalyses]);

  const handleAnalyze = async (data: UserInput) => {
    setView('loading');
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setIsSaved(false);
    try {
      const result = await getAIAnalysis(data);
      setAnalysisResult(result);
      setView('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred during analysis.');
      setView('results');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (result: AnalysisResult) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    const { id, savedAt, ...dataToSave } = result;
    try {
      const newId = await analysisService.saveAnalysis(currentUser.uid, dataToSave);
      setAnalysisResult(prev => prev ? { ...prev, id: newId, savedAt: new Date().toISOString() } : null);
      setIsSaved(true);
      await fetchAnalyses(currentUser);
    } catch (err) {
      console.error("Failed to save analysis:", err);
      // You could set an error state here to show in the UI
    }
  };

  const handleDelete = async (analysisId: string) => {
     if (!currentUser || !analysisId) return;
    try {
      await analysisService.deleteAnalysis(currentUser.uid, analysisId);
      await fetchAnalyses(currentUser);
    } catch (err) {
      console.error("Failed to delete analysis:", err);
    }
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    fetchAnalyses(user);
  };
  
  const handleSignupSuccess = (user: User) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
  };

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setSavedAnalyses([]);
    handleShowHome();
  };

  const handleShowDashboard = () => {
    setAnalysisResult(null);
    setView('dashboard');
  };
  
  const handleShowHome = () => {
    setAnalysisResult(null);
    setView('hero');
  }

  const handleStartNewAnalysis = () => {
    setAnalysisResult(null);
    setView('form');
  }

  const handleViewAnalysis = (analysis: AnalysisResult) => {
    setAnalysisResult(analysis);
    setIsSaved(true);
    setView('results');
  }
  
  const handleCompare = (analysisIds: string[]) => {
      const toCompare = savedAnalyses.filter(a => analysisIds.includes(a.id!));
      setAnalysesToCompare(toCompare);
      setView('compare');
  };

  const renderContent = () => {
    switch (view) {
      case 'hero':
        return <Hero onStartAnalysis={handleStartNewAnalysis} />;
      case 'form':
        return <InputForm onAnalyze={handleAnalyze} isLoading={isLoading} />;
      case 'loading':
        return <LoadingAnalysis />;
      case 'results':
        return <Results error={error} result={analysisResult} currentUser={currentUser} onSave={handleSave} isSaved={isSaved} />;
      case 'dashboard':
        return <Dashboard analyses={savedAnalyses} onView={handleViewAnalysis} onDelete={handleDelete} onNewAnalysis={handleStartNewAnalysis} onCompare={handleCompare} />;
      case 'compare':
        return <Compare analyses={analysesToCompare} onBack={handleShowDashboard} />;
      default:
        return <Hero onStartAnalysis={handleStartNewAnalysis} />;
    }
  };
  
  const showNewAnalysisButton = view !== 'hero' && view !== 'form' && view !== 'loading';

  return (
    <div className="bg-slate-900 text-white min-h-screen font-sans bg-grid">
       <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/50 to-slate-900 z-0"></div>
       <div className="relative z-10">
          <Header 
            showNewAnalysisButton={showNewAnalysisButton}
            onNewAnalysis={handleStartNewAnalysis}
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
            onSignupSuccess={handleSignupSuccess}
          />
       </div>
    </div>
  );
}

export default App;
