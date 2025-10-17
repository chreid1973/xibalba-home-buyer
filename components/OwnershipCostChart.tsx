import React from 'react';
import type { AnalysisResult } from '../../src/types';
import InfoTooltip from './InfoTooltip';

interface OwnershipCostChartProps {
    tco: AnalysisResult['totalCostOfOwnership'];
    pith: number;
    methodology: string;
}

const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 });

const OwnershipCostChart: React.FC<OwnershipCostChartProps> = ({ tco, pith, methodology }) => {
    const chartData = [
        { name: 'Principal & Interest', value: tco.principalAndInterest, fill: '#8b5cf6' },
        { name: 'Taxes', value: tco.estimatedTaxes, fill: '#a78bfa' },
        { name: 'Insurance', value: tco.estimatedInsurance, fill: '#c084fc' },
        { name: 'Utilities', value: tco.estimatedUtilities, fill: '#e9d5ff' },
        { name: 'Maintenance', value: tco.estimatedMaintenance, fill: '#f3e8ff' },
    ];
    
    return (
        <div>
            <h4 className="font-bold text-purple-400 text-center mb-1 flex items-center justify-center">
                Estimated Monthly Cost
                 <InfoTooltip text="This chart breaks down the total estimated monthly cost of owning the target home." methodology={methodology} />
            </h4>
             <p className="text-center text-3xl font-bold text-white mb-4">{currencyFormatter.format(tco.totalMonthlyCost)}</p>
            <div className="w-full flex h-8 rounded-lg overflow-hidden bg-slate-700">
                {chartData.map(item => (
                    <div
                        key={item.name}
                        className="group relative h-full"
                        style={{ width: `${(item.value / tco.totalMonthlyCost) * 100}%`, backgroundColor: item.fill }}
                    >
                         <div className="absolute bottom-full mb-2 w-48 bg-slate-800 text-slate-200 text-xs rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 left-1/2 -translate-x-1/2">
                            {item.name}: {currencyFormatter.format(item.value)}
                            <svg className="absolute h-2 w-full left-0 top-full text-slate-800" x="0px" y="0px" viewBox="0 0 255 255" xmlSpace="preserve">
                                <polygon className="fill-current" points="0,0 127.5,127.5 255,0"/>
                            </svg>
                        </div>
                    </div>
                ))}
            </div>
             <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
                {chartData.map(item => (
                    <div key={item.name} className="flex items-center text-xs">
                        <span className="w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: item.fill }}></span>
                        <span className="text-slate-300">{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OwnershipCostChart;
