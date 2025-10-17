import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import InfoTooltip from './InfoTooltip';

interface TrendChartProps {
  data: { [key: string]: string | number }[];
  dataKey: string;
  xAxisKey: string;
  title: string;
  formatter: (value: number) => string;
  tooltipText?: string;
}

const CustomTooltip = ({ active, payload, label, formatter }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-slate-200 rounded shadow-lg text-sm">
          <p className="font-bold text-slate-700">{label}</p>
          <p className="text-cyan-600">{formatter(payload[0].value)}</p>
        </div>
      );
    }
    return null;
};


const TrendChart: React.FC<TrendChartProps> = ({ data, dataKey, xAxisKey, title, formatter, tooltipText }) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center h-full">
                <h4 className="font-semibold text-slate-600 text-center text-sm mb-2">{title}</h4>
                <p className="text-slate-400 text-xs">Data not available</p>
            </div>
        )
    }
  return (
    <div className="flex flex-col flex-grow h-full">
      <div className="flex justify-center items-center mb-2">
        <h4 className="font-semibold text-slate-600 text-center text-sm">{title}</h4>
        {tooltipText && <InfoTooltip text={tooltipText} />}
      </div>
      <div className="flex-grow">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 20, left: -25, bottom: 5 }}>
                <defs>
                    <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <XAxis dataKey={xAxisKey} stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={formatter} domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip content={<CustomTooltip formatter={formatter} />} />
                <Area type="monotone" dataKey={dataKey} stroke="#06b6d4" fillOpacity={1} fill="url(#colorTrend)" />
            </AreaChart>
          </ResponsiveContainer>
      </div>
    </div>
  );
};
export default TrendChart;