import React, { useState, useEffect } from 'react';

const loadingMessages = [
    "Connecting to real-time market data...",
    "Analyzing your financial profile...",
    "Evaluating neighborhood safety scores...",
    "Assessing local school ratings...",
    "Forecasting home price trends...",
    "Calculating total cost of ownership...",
    "Synthesizing your personalized report...",
    "Almost there..."
];

const LoadingAnalysis: React.FC = () => {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
        }, 2500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-center py-20 animate-fade-in">
            <style>
                {`
                    @keyframes pulse {
                        0%, 100% { opacity: 1; transform: scale(1); }
                        50% { opacity: 0.7; transform: scale(1.05); }
                    }
                    .animate-pulse-logo {
                        animation: pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                    }
                    .dot {
                        animation: pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                    }
                `}
            </style>
            <div className="relative w-48 h-48 mb-8">
                <svg width="192" height="192" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-pulse-logo">
                    <path d="M12 2L2 7V21H22V7L12 2Z" fill="url(#logo-gradient)"/>
                    <path d="M7 12H10V15H7V12Z" fill="rgba(26, 26, 61, 0.7)"/>
                    <path d="M10.5 12H13.5V18H10.5V12Z" fill="rgba(26, 26, 61, 0.7)"/>
                    <path d="M14 8H17V15H14V8Z" fill="rgba(26, 26, 61, 0.7)"/>
                    <defs>
                        <linearGradient id="logo-gradient" x1="2" y1="2" x2="22" y2="21" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#a855f7"/>
                            <stop offset="1" stopColor="#3b82f6"/>
                        </linearGradient>
                    </defs>
                </svg>
                {/* Animated data nodes */}
                <div className="absolute top-4 left-4 w-3 h-3 bg-purple-400 rounded-full dot" style={{ animationDelay: '0.2s' }}></div>
                <div className="absolute top-1/2 -left-2 w-3 h-3 bg-blue-400 rounded-full dot" style={{ animationDelay: '0.4s' }}></div>
                <div className="absolute bottom-4 right-4 w-3 h-3 bg-purple-400 rounded-full dot" style={{ animationDelay: '0.6s' }}></div>
                <div className="absolute -top-2 left-1/2 w-3 h-3 bg-blue-400 rounded-full dot" style={{ animationDelay: '0.8s' }}></div>
                <div className="absolute bottom-1/2 -right-2 w-3 h-3 bg-purple-400 rounded-full dot" style={{ animationDelay: '1s' }}></div>
            </div>

            <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">
                Crafting Your Property Analysis...
            </h2>
            <div className="h-6">
                 <p className="text-lg text-slate-300 transition-opacity duration-500">
                    {loadingMessages[currentMessageIndex]}
                </p>
            </div>
        </div>
    );
};

export default LoadingAnalysis;