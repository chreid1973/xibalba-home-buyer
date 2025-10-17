import React, { useState } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import Results from './components/Results';
import Footer from './components/Footer';
import Hero from './components/Hero';
import { UserInput, AnalysisResult, GroundingChunk } from './src/types';
import { getAnalysis } from './src/services/geminiService';
import LoadingAnalysis from './components/LoadingAnalysis';

function App() {
  const [userInput, setUserInput] = useState<UserInput | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [citations, setCitations] = useState<GroundingChunk[]>([]);

  const handleAnalysis = async (input: UserInput) => {
    setUserInput(input);
    setLoading(true);
    setAnalysisResult(null);
    setError(null);
    setCitations([]);

    try {
      const { analysis, citations: fetchedCitations } = await getAnalysis(input);
      setAnalysisResult(analysis);
      setCitations(fetchedCitations);
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred during analysis.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  
  const handleReset = () => {
    setUserInput(null);
    setAnalysisResult(null);
    setLoading(false);
    setError(null);
    setCitations([]);
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen flex flex-col font-sans">
      <Header onReset={handleReset} />
      <main className="flex-grow container mx-auto px-4 py-8">
        {!analysisResult && !loading && (
          <>
            <Hero />
            <InputForm onAnalysis={handleAnalysis} loading={loading} />
          </>
        )}
        {loading && <LoadingAnalysis />}
        {error && <div className="bg-red-900 border border-red-600 text-red-300 px-4 py-3 rounded-lg text-center my-4">
          <p><strong>Error:</strong> {error}</p>
          <p>Please check the console for more details and try again.</p>
        </div>}
        {analysisResult && userInput && (
          <Results result={analysisResult} citations={citations} onReset={handleReset} userInput={userInput} />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
