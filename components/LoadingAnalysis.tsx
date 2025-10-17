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
                    .bar {
                        transform-box: fill-box;
                        transform-origin: bottom;
                        animation-iteration-count: infinite;
                        animation-timing-function: ease-in-out;
                    }
                    .bar-1 { animation-name: live-data-1; animation-duration: 1.5s; }
                    .bar-2 { animation-name: live-data-2; animation-duration: 1.8s; animation-delay: -0.5s; }
                    .bar-3 { animation-name: live-data-3; animation-duration: 1.2s; animation-delay: -0.2s; }
                    
                    @keyframes live-data-1 {
                      0%, 100% { transform: scaleY(0.3); }
                      50% { transform: scaleY(1); }
                    }
                    @keyframes live-data-2 {
                      0%, 100% { transform: scaleY(0.9); }
                      50% { transform: scaleY(0.2); }
                    }
                    @keyframes live-data-3 {
                      0%, 100% { transform: scaleY(0.5); }
                      50% { transform: scaleY(0.8); }
                    }
                    
                    .node {
                        animation-iteration-count: infinite;
                        animation-timing-function: ease-in-out;
                    }
                    .node-1 { animation: orbit-1 4s infinite; }
                    .node-2 { animation: orbit-2 4s infinite; animation-delay: -1s; }
                    .node-3 { animation: orbit-3 4s infinite; animation-delay: -2s; }
                    .node-4 { animation: orbit-4 4s infinite; animation-delay: -3s; }

                    @keyframes orbit-1 {
                        0%, 100% { transform: translate(0, 0) scale(1); }
                        25% { transform: translate(14px, 4px) scale(1.2); }
                        50% { transform: translate(10px, 14px) scale(0.8); }
                        75% { transform: translate(-4px, 10px) scale(1.1); }
                    }
                     @keyframes orbit-2 {
                        0%, 100% { transform: translate(0, 0) scale(1); }
                        25% { transform: translate(-12px, -3px) scale(0.8); }
                        50% { transform: translate(-8px, 8px) scale(1.2); }
                        75% { transform: translate(5px, 5px) scale(0.9); }
                    }
                     @keyframes orbit-3 {
                        0%, 100% { transform: translate(0, 0) scale(1); }
                        25% { transform: translate(12px, -2px) scale(1.1); }
                        50% { transform: translate(5px, -10px) scale(0.9); }
                        75% { transform: translate(-10px, -8px) scale(1.2); }
                    }
                     @keyframes orbit-4 {
                        0%, 100% { transform: translate(0, 0) scale(1); }
                        25% { transform: translate(-15px, -5px) scale(1.2); }
                        50% { transform: translate(-10px, -12px) scale(0.8); }
                        75% { transform: translate(5px, -8px) scale(1); }
                    }
                `}
            </style>
            <div className="relative w-48 h-48 mb-8">
                <svg width="192" height="192" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7V21H22V7L12 2Z" fill="url(#logo-gradient)"/>
                    
                    <g>
                        <path className="bar bar-1" d="M7 12H10V15H7V12Z" fill="rgba(26, 26, 61, 0.9)"/>
                        <path className="bar bar-2" d="M10.5 12H13.5V18H10.5V12Z" fill="rgba(26, 26, 61, 0.9)"/>
                        <path className="bar bar-3" d="M14 8H17V15H14V8Z" fill="rgba(26, 26, 61, 0.9)"/>
                    </g>
                    
                    {/* Orbiting Data Nodes */}
                    <circle className="node node-1" cx="5" cy="5" r="1.2" fill="#818cf8" />
                    <circle className="node node-2" cx="19" cy="8" r="1" fill="#c084fc" />
                    <circle className="node node-3" cx="6" cy="18" r="1.5" fill="#38bdf8" />
                    <circle className="node node-4" cx="20" cy="16" r="1.2" fill="#a78bfa" />


                    <defs>
                        <linearGradient id="logo-gradient" x1="2" y1="2" x2="22" y2="21" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#a855f7"/>
                            <stop offset="1" stopColor="#3b82f6"/>
                        </linearGradient>
                    </defs>
                </svg>
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