import React, { useState } from 'react';
import type { BreakEvenAnalysis as BreakEvenAnalysisData } from '../src/types';
import InfoTooltip from './InfoTooltip';

interface BreakEvenAnalysisProps {
  data: BreakEvenAnalysisData;
}

const BreakEvenAnalysis: React.FC<BreakEvenAnalysisProps> = ({ data }) => {
  const [showAssumptions, setShowAssumptions] = useState(false);

  if (!data) {
    return null;
  }

  const { breakEvenPoint, summary, assumptions } = data;

  const currencyFormatter = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

  const AssumptionRow: React.FC<{ label: string; value: string; tooltip: string; }> = ({ label, value, tooltip }) => (
      <li className="flex justify-between items-center">
          <div className="flex items-center">
              <span>{label}:</span>
              <InfoTooltip text={tooltip} />
          </div>
          <span className="font-mono text-slate-200">{value}</span>
      </li>
  );

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
      <div className="flex justify-center items-center mb-4">
        <h3 className="text-xl font-bold text-center text-cyan-400">Buy vs. Rent: Your Break-Even Point</h3>
        <InfoTooltip text="This is the estimated time it takes for the financial benefits of owning this home to outweigh the costs, compared to renting. A shorter break-even point is generally better if you don't plan to stay long-term." />
      </div>
      
      <div className="text-center">
        <div className="inline-block bg-cyan-500/10 border border-cyan-500/30 rounded-full px-8 py-4">
            <p className="text-5xl font-extrabold text-white">{breakEvenPoint.toFixed(1)}</p>
            <p className="text-xl font-semibold text-cyan-300">Years</p>
        </div>
        <p className="text-slate-300 max-w-2xl mx-auto mt-4">{summary}</p>
      </div>

      <div className="text-center mt-6">
        <button 
            onClick={() => setShowAssumptions(!showAssumptions)}
            className="text-sm text-slate-400 hover:text-white transition-colors"
        >
          {showAssumptions ? 'Hide' : 'Show'} Calculation Assumptions
        </button>
      </div>
      
      {showAssumptions && (
        <div className="mt-4 bg-slate-900/50 p-4 rounded-md max-w-lg mx-auto animate-fade-in">
            <h4 className="font-semibold text-slate-300 mb-3 text-center">How We Calculate Your Break-Even Point</h4>
            <p className="text-xs text-slate-400 mb-4 text-center">
                The break-even point is when the net cost of owning your home becomes less than the net cost of renting a comparable property. Our AI simulates this by factoring in the costs (like mortgage, taxes, and one-time fees) versus the financial gains from owning (like equity from loan payments and home appreciation). The key assumptions used for your specific area are detailed below.
            </p>
            <ul className="text-sm text-slate-400 space-y-2">
                <AssumptionRow 
                    label="Comparable Monthly Rent"
                    value={currencyFormatter(assumptions.estimatedRent)}
                    tooltip="The AI's estimate for what a similar property would cost to rent per month in your target neighborhood. This is a key factor in comparing costs."
                />
                 <AssumptionRow 
                    label="Annual Home Appreciation"
                    value={`${assumptions.appreciationRate.toFixed(1)}%`}
                    tooltip="The estimated yearly increase in your home's value based on local market data. This is a major financial benefit of owning."
                />
                 <AssumptionRow 
                    label="Annual Rent Increase"
                    value={`${assumptions.rentIncreaseRate.toFixed(1)}%`}
                    tooltip="The estimated yearly percentage increase in rent for your area, used to project future costs if you were to continue renting."
                />
                 <AssumptionRow 
                    label="One-Time Buying Costs"
                    value={`~${assumptions.buyingCosts.toFixed(1)}% of price`}
                    tooltip="Upfront fees paid when purchasing, such as closing costs, legal fees, and inspections. Typically ranges from 2-5% of the home price."
                />
                 <AssumptionRow 
                    label="Future Selling Costs"
                    value={`~${assumptions.sellingCosts.toFixed(1)}% of price`}
                    tooltip="When you eventually sell, you'll incur costs like realtor commissions. We factor this in for a realistic picture of your net profit. Often 5-7% of the sale price."
                />
            </ul>
        </div>
      )}
    </div>
  );
};

export default BreakEvenAnalysis;