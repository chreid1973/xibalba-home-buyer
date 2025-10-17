import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { TotalCostOfOwnership } from '../types';
import InfoTooltip from './InfoTooltip';

interface OwnershipCostChartProps {
  tco: TotalCostOfOwnership;
  pith: number;
}

const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 });

const OwnershipCostChart: React.FC<OwnershipCostChartProps> = ({ tco, pith }) => {

    const data = [
        { name: 'Housing (PITH)', value: pith },
        { name: 'Insurance', value: tco.estimatedInsurance },
        { name: 'Utilities', value: tco.estimatedUtilities },
        { name: 'Maintenance', value: tco.estimatedMaintenance },
    ].filter(d => typeof d.value === 'number' && d.value > 0);

    const COLORS = ['#06b6d4', '#67e8f9', '#a5f3fc', '#cffafe'];

    return (
        <div className="flex flex-col items-center flex-grow h-full">
            <div className="flex justify-center items-center">
                <h3 className="font-bold text-center text-slate-700">Estimated Monthly Cost</h3>
                <InfoTooltip text="This is an estimate of your total monthly home ownership costs, including mortgage, taxes, insurance, utilities, and a fund for maintenance." />
            </div>
            <div className="relative w-full h-full flex-grow mt-2">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => currencyFormatter.format(value)} />
                        <Legend iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                    <span className="text-slate-500 text-sm">Total</span>
                    <p className="text-2xl font-bold text-slate-800">{currencyFormatter.format(tco.totalMonthlyCost)}</p>
                </div>
            </div>
        </div>
    );
};
export default OwnershipCostChart;