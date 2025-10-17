import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import InputForm from './components/InputForm';
import LoadingAnalysis from './components/LoadingAnalysis';
import Results from './components/Results';
import Footer from './components/Footer';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Compare from './components/Compare';
// Fix: Corrected import paths for services and types
import { getAIAnalysis } from './src/services/geminiService';
import { saveAnalysis, getSavedAnalyses, deleteAnalysis } from './src/services/analysisService';
import { onAuthChange, logOut, AppUser } from './src/services/authService';
import type { UserInput, AnalysisResult } from './src/types';

type View = 'home' | 'form' | 'loading' | 'results' | 'dashboard' | 'compare';

const App: React.FC = () => {
    const [view, setView] = useState<View>('home');
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const [user, setUser] = useState<AppUser | null>(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [savedAnalyses, setSavedAnalyses] = useState<AnalysisResult[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [analysesToCompare, setAnalysesToCompare] = useState<AnalysisResult[]>([]);
    
    useEffect(() => {
        const unsubscribe = onAuthChange((appUser) => {
        setUser(appUser);
        if (appUser) {
            fetchSavedAnalyses(appUser.uid);
        } else {
            setSavedAnalyses([]);
        }
        });
        return () => unsubscribe();
    }, []);

    const fetchSavedAnalyses = async (userId: string) => {
        try {
        const analyses = await getSavedAnalyses(userId);
        setSavedAnalyses(analyses);
        } catch (e) {
        console.error("Error fetching saved analyses:", e);
        setError("Could not load your saved analyses.");
        }
    };

    const handleFormSubmit = async (data: UserInput) => {
        setView('loading');
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);
        setIsSaved(false);
        try {
        const result = await getAIAnalysis(data);
        setAnalysisResult(result);
        setView('results');
        } catch (e: any) {
        setError(e.message || 'An unexpected error occurred during analysis.');
        setView('form'); // Go back to form on error
        } finally {
        setIsLoading(false);
        }
    };
    
    const handleSaveAnalysis = async () => {
        if (!user) {
        setIsAuthModalOpen(true);
        return;
        }
        if (!analysisResult) return;

        setIsSaving(true);
        try {
        const savedResult = await saveAnalysis(user.uid, analysisResult);
        setAnalysisResult(savedResult); // Update result with ID and savedAt
        setSavedAnalyses(prev => [savedResult, ...prev.filter(a => a.id !== savedResult.id)]);
        setIsSaved(true);
        } catch (e) {
        console.error("Error saving analysis:", e);
        setError("Failed to save your analysis.");
        } finally {
        setIsSaving(false);
        }
    };
    
    const handleDeleteAnalysis = async (id: string) => {
        if (!user) return;
        setIsDeleting(id);
        try {
            await deleteAnalysis(user.uid, id);
            await fetchSavedAnalyses(user.uid);
        } catch (e) {
            console.error("Error deleting analysis:", e);
            setError("Failed to delete analysis.");
        } finally {
            setIsDeleting(null);
        }
    };

    const handleStartCompare = (selectedAnalyses: AnalysisResult[]) => {
        setAnalysesToCompare(selectedAnalyses);
        setView('compare');
    };

    const handleNewAnalysis = () => {
        setAnalysisResult(null);
        setIsSaved(false);
        setView('form');
    };

    const renderView = () => {
        switch(view) {
        case 'home':
            return <Hero onStartAnalysis={() => setView('form')} />;
        case 'form':
            return <InputForm onSubmit={handleFormSubmit} isLoading={isLoading} />;
        case 'loading':
            return <LoadingAnalysis />;
        case 'results':
            if (analysisResult) {
            return <Results 
                        result={analysisResult} 
                        onSave={handleSaveAnalysis} 
                        isSaving={isSaving}
                        isSaved={isSaved}
                        user={user}
                        onNewAnalysis={handleNewAnalysis}
                    />;
            }
            return <p>Error: No analysis result found.</p>;
        case 'dashboard':
            return <Dashboard 
                    analyses={savedAnalyses}
                    onSelectAnalysis={(analysis) => { setAnalysisResult(analysis); setIsSaved(true); setView('results'); }}
                    onDeleteAnalysis={handleDeleteAnalysis}
                    onStartCompare={handleStartCompare}
                    onNewAnalysis={handleNewAnalysis}
                    isDeleting={isDeleting}
                />;
        case 'compare':
            return <Compare analyses={analysesToCompare} onClose={() => setView('dashboard')} />;
        default:
            return <Hero onStartAnalysis={() => setView('form')} />;
        }
    };
    
    const handleLogout = async () => {
        await logOut();
        setView('home'); // Go to home on logout
    };
    
    return (
        <div className="bg-slate-900 min-h-screen text-white font-sans bg-grid">
            <style>{`
            .bg-grid {
                background-image: linear-gradient(to right, rgba(168, 85, 247, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(168, 85, 247, 0.1) 1px, transparent 1px);
                background-size: 3rem 3rem;
            }
            `}</style>
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/80 to-transparent"></div>
            <div className="relative z-10">
                <Header 
                user={user}
                onLoginClick={() => setIsAuthModalOpen(true)}
                onLogout={handleLogout}
                onShowDashboard={() => setView('dashboard')}
                />
                <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {error && <div className="bg-red-500/20 border border-red-500/30 text-red-300 p-4 rounded-lg mb-8 text-center" onClick={() => setError(null)}>{error}</div>}
                {renderView()}
                </main>
                <Footer />
            </div>
            <Auth 
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            onAuthSuccess={() => {
                setIsAuthModalOpen(false);
                if (view === 'results' && analysisResult && !isSaved) {
                    handleSaveAnalysis();
                }
            }}
            />
        </div>
    );
};

export default App;
