import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { MarketData } from '../types';

interface ChartsProps {
  marketData: MarketData;
}

const ChartCard: React.FC<{ title: string; children: React.ReactNode; source: string }> = ({ title, children, source }) => (
    <div className="bg-slate-800 p-4 rounded-lg shadow-lg h-72 flex flex-col">
        <h3 className="text-lg font-semibold text-cyan-400 mb-4">{title}</h3>
        <div className="flex-grow h-full">
            {children}
        </div>
        <p className="text-xs text-slate-500 mt-2 italic text-right">{source}</p>
    </div>
);

const currencyFormatter = (value: number) => {
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
    return `$${value}`;
};

const Charts: React.FC<ChartsProps> = ({ marketData }) => {
  const sourceText = "*Source: AI-generated model based on local trends";

  // Defensive check to ensure marketData and its properties exist before rendering charts
  if (!marketData) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {marketData.mortgageRates && marketData.mortgageRates.length > 0 && (
            <ChartCard title="Local Mortgage Rate Trend" source={sourceText}>
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={marketData.mortgageRates} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" domain={['dataMin - 0.2', 'dataMax + 0.2']} tickFormatter={(value) => `${value.toFixed(1)}%`} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                    <Legend />
                    <Line type="monotone" dataKey="rate" name="Rate" stroke="#22d3ee" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
                </ResponsiveContainer>
            </ChartCard>
        )}
        {marketData.employmentRates && marketData.employmentRates.length > 0 && (
            <ChartCard title="Local Employment Rate Trend" source={sourceText}>
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={marketData.employmentRates} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" domain={['dataMin - 0.5', 'dataMax + 0.5']} tickFormatter={(value) => `${value.toFixed(1)}%`} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}/>
                    <Legend />
                    <Line type="monotone" dataKey="rate" name="Rate" stroke="#a78bfa" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
                </ResponsiveContainer>
            </ChartCard>
        )}
         {marketData.yoyPriceChange && marketData.yoyPriceChange.length > 0 && (
            <ChartCard title="Local YoY House Price Change (%)" source={sourceText}>
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={marketData.yoyPriceChange} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="year" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" tickFormatter={(value) => `${value}%`} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}/>
                    <Legend />
                    <Line type="monotone" dataKey="change" name="Change" stroke="#f472b6" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
                </ResponsiveContainer>
            </ChartCard>
         )}
        {marketData.averageHomePrice && marketData.averageHomePrice.length > 0 && (
            <ChartCard title="Average Home Price Trend (Local)" source={sourceText}>
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={marketData.averageHomePrice} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="quarter" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" tickFormatter={currencyFormatter} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} formatter={(value: number) => `$${value.toLocaleString()}`}/>
                    <Legend />
                    <Line type="monotone" dataKey="price" name="Price" stroke="#4ade80" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
                </ResponsiveContainer>
            </ChartCard>
        )}
    </div>
  );
};

export default Charts;