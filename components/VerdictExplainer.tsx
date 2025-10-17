import React from 'react';
import Modal from './Modal';

interface VerdictExplainerProps {
  isOpen: boolean;
  onClose: () => void;
  readinessScore: number;
  marketHealthIndex: number;
  marketForecast: string;
  locationScore: number;
  locationSummary: string;
}

const getMarketHealth = (index: number): { text: string; color: string } => {
    if (index <= 4) return { text: "Buyer's Market", color: 'text-green-400' };
    if (index <= 6) return { text: 'Balanced Market', color: 'text-yellow-400' };
    return { text: "Seller's Market", color: 'text-red-400' };
};

const getTrendIcon = (forecast: string): React.ReactNode => {
    const lowerForecast = forecast.toLowerCase();
    if (lowerForecast.includes('increas') || lowerForecast.includes('ris')) {
        return <span className="text-red-400 ml-2">↗</span>;
    }
    if (lowerForecast.includes('decreas') || lowerForecast.includes('fall') || lowerForecast.includes('declin')) {
        return <span className="text-green-400 ml-2">↘</span>;
    }
    return <span className="text-yellow-400 ml-2">→</span>;
};

const ScoreCircle: React.FC<{ score: number }> = ({ score }) => {
    let color = 'border-yellow-400 text-yellow-300';
    if (score >= 7) color = 'border-green-400 text-green-300';
    if (score <= 4) color = 'border-red-400 text-red-300';

    return (
        <div className={`w-16 h-16 flex items-center justify-center rounded-full border-2 ${color} bg-white/5`}>
            <span className="text-xl font-bold">{score.toFixed(1)}</span>
        </div>
    )
}

const VerdictExplainer: React.FC<VerdictExplainerProps> = ({ 
    isOpen, 
    onClose,
    readinessScore,
    marketHealthIndex,
    marketForecast,
    locationScore,
    locationSummary
}) => {

    const marketHealth = getMarketHealth(marketHealthIndex);

    const factors = [
        {
            title: "Your Readiness (Can You?)",
            scoreComponent: <ScoreCircle score={readinessScore} />,
            description: "A measure of your personal financial strength for this specific purchase."
        },
        {
            title: "Market Health",
            scoreComponent: (
                <div className="text-center">
                    <p className={`text-xl font-bold ${marketHealth.color}`}>{marketHealth.text}</p>
                    <p className="text-xs text-slate-400">({marketHealthIndex.toFixed(1)}/10)</p>
                </div>
            ),
            description: "An index indicating whether it's currently a buyer's or seller's market."
        },
        {
            title: "Market Forecast",
             scoreComponent: (
                <div className="text-center">
                    <p className="text-lg font-semibold text-slate-200 flex items-center justify-center">
                        {marketForecast.split(' ')[0]} {getTrendIcon(marketForecast)}
                    </p>
                </div>
            ),
            description: marketForecast
        },
        {
            title: "Location Score",
            scoreComponent: <ScoreCircle score={locationScore} />,
            description: locationSummary
        }
    ];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-2">
        <h2 className="text-2xl font-bold text-purple-400 text-center">The Strategic Verdict</h2>
        <p className="text-center text-slate-400 mt-2 text-sm max-w-md mx-auto">
            Our overall recommendation weighs your personal financial readiness against key external factors to answer the question: "Should you buy this home, right now?"
        </p>

        <div className="mt-6 space-y-4">
            {factors.map((factor, index) => (
                <div key={index} className="flex items-center bg-black/20 p-4 rounded-lg border border-purple-500/10">
                    <div className="flex-shrink-0 w-24 flex justify-center">{factor.scoreComponent}</div>
                    <div className="ml-4">
                        <h4 className="font-semibold text-white">{factor.title}</h4>
                        <p className="text-sm text-slate-400">{factor.description}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </Modal>
  );
};

export default VerdictExplainer;