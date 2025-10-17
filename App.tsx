
import React, { useState, useEffect } from 'react';
import { getAIAnalysis } from './src/services/geminiService';
import { authService } from './src/services/authService';
import { analysisService } from './src/services/analysisService';
import type { User, UserInput, AnalysisResult } from './src/types';

// Import Firebase
// Fix: Update Firebase imports to v8 namespaced API.
import firebase from 'firebase/app';
import 'firebase/auth';

// Import components
import Header from './components/Header';
import Hero from './components/Hero';
import InputForm from './components/InputForm';
import LoadingAnalysis from './components/LoadingAnalysis';
import Results from './components/Results';
import Footer from './components/Footer';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Compare from './components/Compare';

type View = 'home' | 'form' | 'loading' | 'results' | 'dashboard' | 'compare';

function App() {
  const [view, setView] = useState<View>('home');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [savedAnalyses, setSavedAnalyses] = useState<AnalysisResult[]>([]);
  const [analysesToCompare, setAnalysesToCompare] = useState<AnalysisResult[]>([]);
  const [isCurrentResultSaved, setIsCurrentResultSaved] = useState(false);

  useEffect(() => {
    // Fix: Use v8 namespaced API for authentication.
    const auth = firebase.auth();
    // onAuthStateChanged is the real-time listener for auth state.
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        // User is signed in.
        const appUser: User = { uid: firebaseUser.uid, email: firebaseUser.email! };
        setCurrentUser(appUser);
        loadDashboard(appUser);
      } else {
        // User is signed out.
        setCurrentUser(null);
        setSavedAnalyses([]);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const loadDashboard = async (user: User) => {
    const analyses = await analysisService.getAnalysesForUser(user);
    setSavedAnalyses(analyses);
  };
  
  const handleStartAnalysis = () => {
    setView('form');
    setAnalysisResult(null);
    setError(null);
  };

  const handleAnalyze = async (data: UserInput) => {
    setIsLoading(true);
    setError(null);
    setView('loading');
    try {
      const result = await getAIAnalysis(data);
      setAnalysisResult(result);
      setIsCurrentResultSaved(false);
      setView('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setView('results'); // Show error on results page
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleShowAuth = () => {
    setIsAuthModalOpen(true);
  };

  const handleLogin = (user: User) => {
    // The onAuthStateChanged listener will handle setting the user and loading the dashboard.
    setCurrentUser(user); // Optimistically set user for faster UI feedback
    setIsAuthModalOpen(false);
    loadDashboard(user);
  };
  
  const handleSignup = (user: User) => {
    // The onAuthStateChanged listener will handle setting the user.
    setCurrentUser(user); // Optimistically set user
    setIsAuthModalOpen(false);
  };

  const handleLogout = async () => {
    await authService.logout();
    // The onAuthStateChanged listener will handle clearing user state.
    if (view === 'dashboard' || view === 'compare') {
      setView('home');
    }
  };
  
  const handleShowDashboard = () => {
    if (currentUser) {
        loadDashboard(currentUser);
        setView('dashboard');
    } else {
        handleShowAuth();
    }
  };
  
  const handleSaveAnalysis = async (resultToSave: AnalysisResult) => {
    if (currentUser && resultToSave) {
        try {
            const savedAnalysis = await analysisService.saveAnalysis(currentUser, resultToSave);
            setAnalysisResult(savedAnalysis); // Update result with new ID and savedAt
            setIsCurrentResultSaved(true);
            await loadDashboard(currentUser);
        } catch (error) {
            console.error("Failed to save analysis:", error);
        }
    } else if (!currentUser) {
        handleShowAuth();
    }
  };
  
  const handleDeleteAnalysis = async (analysisId: string) => {
    if (currentUser && analysisId) {
        await analysisService.deleteAnalysis(currentUser, analysisId);
        await loadDashboard(currentUser); // Refresh dashboard
    }
  };
  
  const handleViewAnalysis = (analysis: AnalysisResult) => {
      setAnalysisResult(analysis);
      setIsCurrentResultSaved(true); // Since it comes from dashboard, it's saved
      setView('results');
  };

  const handleCompare = (analysisIds: string[]) => {
      const toCompare = savedAnalyses.filter(a => a.id && analysisIds.includes(a.id));
      setAnalysesToCompare(toCompare);
      setView('compare');
  };

  const renderContent = () => {
    switch (view) {
      case 'home':
        return <Hero onStartAnalysis={handleStartAnalysis} />;
      case 'form':
        return <InputForm onAnalyze={handleAnalyze} isLoading={isLoading} />;
      case 'loading':
        return <LoadingAnalysis />;
      case 'results':
        return <Results result={analysisResult} error={error} currentUser={currentUser} onSave={handleSaveAnalysis} isSaved={isCurrentResultSaved} />;
      case 'dashboard':
        return <Dashboard 
                  analyses={savedAnalyses}
                  onView={handleViewAnalysis}
                  onDelete={handleDeleteAnalysis}
                  onNewAnalysis={handleStartAnalysis}
                  onCompare={handleCompare}
                />;
      case 'compare':
        return <Compare analyses={analysesToCompare} onBack={handleShowDashboard} />;
      default:
        return <Hero onStartAnalysis={handleStartAnalysis} />;
    }
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen font-sans bg-gradient-to-br from-indigo-950 via-slate-900 to-black">
      <Header 
        showNewAnalysisButton={view !== 'home' && view !== 'form'}
        onNewAnalysis={handleStartAnalysis}
        currentUser={currentUser}
        onShowAuth={handleShowAuth}
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
        onLoginSuccess={handleLogin}
        onSignupSuccess={handleSignup}
      />
    </div>
  );
}

export default App;
