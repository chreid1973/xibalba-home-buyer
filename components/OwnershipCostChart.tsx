import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from 'recharts';
import type { TotalCostOfOwnership } from '../types';
import Citation from './Citation';

interface OwnershipCostChartProps {
  tco: TotalCostOfOwnership;
  pith: number;
  methodology: string;
}

const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 });

// Custom active shape for the pie chart
const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;

  return (
    <g>
      <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill="#334155" className="text-2xl font-bold">
        {currencyFormatter.format(payload.value)}
      </text>
      <text x={cx} y={cy + 10} dy={8} textAnchor="middle" fill="#64748b" className="text-sm">
        {`${(percent * 100).toFixed(1)}%`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  );
};


const OwnershipCostChart: React.FC<OwnershipCostChartProps> = ({ tco, pith, methodology }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const data = [
        { name: 'Housing (PITH)', value: pith },
        { name: 'Utilities', value: tco.estimatedUtilities },
        { name: 'Maintenance', value: tco.estimatedMaintenance },
        { name: 'Insurance', value: tco.estimatedInsurance },
    ].filter(d => typeof d.value === 'number' && d.value > 0);

    const COLORS = ['#9333ea', '#c084fc', '#d8b4fe', '#e9d5ff'];

    const onPieEnter = (_: any, index: number) => {
        setActiveIndex(index);
    };
    
    const onLegendEnter = (index: number) => {
        setActiveIndex(index);
    };

    return (
        <div className="flex flex-col items-center flex-grow h-full w-full">
            <div className="flex justify-center items-center w-full">
                <h3 className="font-bold text-center text-slate-700">Estimated Monthly Cost</h3>
                <Citation title="Methodology" content={methodology} />
            </div>
            <div className="relative w-full flex-grow mt-2 grid grid-cols-1 md:grid-cols-2 items-center">
                 <div className="w-full h-48 md:h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                // Fix: The 'activeIndex' prop is valid for recharts' Pie component for controlling
                                // the active sector, but the project's type definitions might be outdated.
                                // Using @ts-ignore to suppress the type error and maintain interactive functionality.
                                // @ts-ignore
                                activeIndex={activeIndex}
                                activeShape={renderActiveShape}
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                // Fix: Use the correct `onMouseEnter` event handler for the Pie component's hover interaction.
                                onMouseEnter={onPieEnter}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="w-full pl-4">
                     <div className="text-center md:text-left mb-2">
                        <span className="text-slate-500 text-sm">Total Monthly Cost</span>
                        <p className="text-3xl font-bold text-slate-800">{currencyFormatter.format(tco.totalMonthlyCost)}</p>
                     </div>
                     <ul className="space-y-2">
                         {data.map((entry, index) => (
                             <li 
                                key={`legend-${index}`} 
                                className={`flex items-center justify-between text-sm p-2 rounded-md cursor-pointer transition-all duration-200 ${activeIndex === index ? 'bg-slate-100' : ''}`}
                                onMouseOver={() => onLegendEnter(index)}
                             >
                                 <div className="flex items-center">
                                     <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                     <span className="text-slate-600">{entry.name}</span>
                                 </div>
                                 <span className="font-semibold text-slate-800">{currencyFormatter.format(entry.value)}</span>
                             </li>
                         ))}
                     </ul>
                 </div>
            </div>
        </div>
    );
};
export default OwnershipCostChart;