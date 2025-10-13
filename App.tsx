import React, { useState } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import Charts from './components/Charts';
import Results from './components/Results';
import Footer from './components/Footer';
import { getHousingAdvice, getUpdatedPersonalizedAdvice, startChatSession } from './src/services/geminiService';
import type { UserInput, AnalysisResult, MarketData, ChatMessage, PersonalizedAdvice } from './src/types';
import type { Chat } from '@google/genai';

const App: React.FC = () => {
  const [userInput, setUserInput] = useState<UserInput | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Chat State
  const [chat, setChat] = useState<Chat | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);


  const handleAnalysis = async (input: UserInput) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setMarketData(null);
    setChat(null);
    setChatHistory([]);
    setUserInput(input);

    try {
      const result = await getHousingAdvice(input);
      setAnalysisResult(result);
      setMarketData(result.marketData);
      
      // Start a new chat session with the analysis context
      const chatSession = await startChatSession(result);
      setChat(chatSession);

    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching the analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAdvice = async (updatedFinances: Partial<UserInput>) => {
    if (!userInput || !analysisResult) return;
    
    setIsLoading(true); // Reuse main loading indicator for simplicity
    setError(null);

    const updatedUserInput = { ...userInput, ...updatedFinances };
    setUserInput(updatedUserInput);

    try {
      const updatedAdvice = await getUpdatedPersonalizedAdvice(
        updatedUserInput,
        analysisResult.locationAnalysis,
        analysisResult.marketData
      );
      // Update only the personalized advice part of the result
      setAnalysisResult(prevResult => prevResult ? { ...prevResult, personalizedAdvice: updatedAdvice } : null);

    } catch (err) {
      console.error(err);
      setError('An error occurred while updating the analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!chat) return;

    const userMessage: ChatMessage = { role: 'user', content: message };
    setChatHistory(prev => [...prev, userMessage]);
    setIsChatLoading(true);

    try {
      const response = await chat.sendMessage({ message });
      const modelMessage: ChatMessage = { role: 'model', content: response.text };
      setChatHistory(prev => [...prev, modelMessage]);
    } catch (err) {
       console.error(err);
       const errorMessage: ChatMessage = { role: 'model', content: 'Sorry, I encountered an error. Please try again.' };
       setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
             <InputForm onAnalyze={handleAnalysis} isLoading={isLoading} />
          </div>
          <div className="lg:col-span-3">
            {marketData && <Charts marketData={marketData} />}
            <Results 
              result={analysisResult} 
              isLoading={isLoading} 
              error={error}
              onUpdateAdvice={handleUpdateAdvice}
              chatHistory={chatHistory}
              isChatLoading={isChatLoading}
              onSendMessage={handleSendMessage}
              initialUserInput={userInput}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;