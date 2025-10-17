import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { MarketData } from '../types';
import InfoTooltip from './InfoTooltip';

interface MarketForecastChartProps {
  marketData: MarketData;
  tooltipText?: string;
}

const currencyFormatter = (value: number) => {
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
    return `$${value}`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-slate-200 rounded shadow-lg">
        <p className="label text-sm font-bold text-slate-700">{`${label}`}</p>
        <p className="intro text-sm text-cyan-600">{`Price : ${currencyFormatter(payload[0].value)}`}</p>
      </div>
    );
  }
  return null;
};

const MarketForecastChart: React.FC<MarketForecastChartProps> = ({ marketData, tooltipText }) => {
  if (!marketData || !marketData.averageHomePrice || marketData.averageHomePrice.length === 0) {
    return null;
  }

  const chartData = marketData.averageHomePrice;
  const forecastStartIndex = Math.max(0, chartData.length - 2);
  const forecastStartQuarter = chartData[forecastStartIndex]?.quarter;

  const historicalData = chartData.slice(0, forecastStartIndex + 1);

  return (
    <div className="flex flex-col flex-grow h-full">
        <div className="flex justify-center items-center mb-2">
            <h3 className="font-bold text-center text-slate-700">Average Home Price Forecast</h3>
            {tooltipText && <InfoTooltip text={tooltipText} />}
        </div>
        <div className="flex-grow h-full">
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="quarter" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={currencyFormatter} />
                <Tooltip content={<CustomTooltip />} />
                
                {/* Historical Data Line */}
                <Line data={historicalData} type="monotone" dataKey="price" name="Historical Price" stroke="#38bdf8" strokeWidth={3} activeDot={{ r: 8 }} dot={false} />
                
                {/* Forecast Data Line */}
                <Line dataKey="price" name="Forecast Price" stroke="#38bdf8" strokeWidth={3} strokeDasharray="5 5" activeDot={{ r: 8 }} dot={false}/>

                {forecastStartQuarter && <ReferenceLine x={forecastStartQuarter} stroke="#94a3b8" strokeDasharray="3 3" />}
                
                 <Legend verticalAlign="bottom" height={36} content={() => (
                     <div className="flex justify-center items-center gap-6 text-sm text-slate-500 mt-4">
                        <div className="flex items-center gap-2">
                             <svg className="w-4 h-1" viewBox="0 0 16 4"><path d="M0 2 H16" stroke="#38bdf8" strokeWidth="3" /></svg>
                            <span>Historical</span>
                        </div>
                         <div className="flex items-center gap-2">
                             <svg className="w-4 h-1" viewBox="0 0 16 4"><path d="M0 2 H16" stroke="#38bdf8" strokeWidth="3" strokeDasharray="5 5" /></svg>
                            <span>Forecast</span>
                        </div>
                    </div>
                 )} />

            </LineChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
};

export default MarketForecastChart;