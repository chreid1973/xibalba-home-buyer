import React from 'react';

interface ScenarioSimulatorProps {
  homePrice: number;
  downPayment: number;
  interestRate: number;
  minHomePrice: number;
  maxHomePrice: number;
  minDownPayment: number;
  maxDownPayment: number;
  onScenarioChange: (data: { homePrice: number; downPayment: number; interestRate: number }) => void;
  onReset: () => void;
}

const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({
  homePrice,
  downPayment,
  interestRate,
  minHomePrice,
  maxHomePrice,
  minDownPayment,
  maxDownPayment,
  onScenarioChange,
  onReset,
}) => {

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onScenarioChange({ homePrice: Number(e.target.value), downPayment, interestRate });
  };
  
  const handleDownPaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onScenarioChange({ homePrice, downPayment: Number(e.target.value), interestRate });
  };

  const handleInterestRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onScenarioChange({ homePrice, downPayment, interestRate: Number(e.target.value) });
  };

  const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-purple-400">Scenario Simulator</h3>
        <button onClick={onReset} className="text-xs text-slate-400 hover:text-white transition-colors">Reset</button>
      </div>
      <div className="space-y-4">
        <div>
          <label htmlFor="homePrice" className="block text-sm font-medium text-slate-300 flex justify-between">
            <span>Home Price</span>
            <span className="font-bold text-white">{currencyFormatter.format(homePrice)}</span>
          </label>
          <input
            type="range"
            id="homePrice"
            name="homePrice"
            min={minHomePrice}
            max={maxHomePrice}
            step={1000}
            value={homePrice}
            onChange={handlePriceChange}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>
        <div>
          <label htmlFor="downPayment" className="block text-sm font-medium text-slate-300 flex justify-between">
            <span>Down Payment</span>
            <span className="font-bold text-white">{currencyFormatter.format(downPayment)}</span>
          </label>
          <input
            type="range"
            id="downPayment"
            name="downPayment"
            min={minDownPayment}
            max={maxDownPayment}
            step={500}
            value={downPayment}
            onChange={handleDownPaymentChange}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>
        <div>
          <label htmlFor="interestRate" className="block text-sm font-medium text-slate-300 flex justify-between">
            <span>Interest Rate</span>
            <span className="font-bold text-white">{interestRate.toFixed(2)}%</span>
          </label>
          <input
            type="range"
            id="interestRate"
            name="interestRate"
            min="1"
            max="12"
            step="0.1"
            value={interestRate}
            onChange={handleInterestRateChange}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>
      </div>
      <p className="text-xs text-slate-400 mt-4">Adjust the sliders to see how changes to the home price, down payment, or interest rate affect your analysis in real-time.</p>
    </div>
  );
};

export default ScenarioSimulator;