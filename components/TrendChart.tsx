import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import InfoTooltip from './InfoTooltip';
import Citation from './Citation';

interface TrendChartProps {
  data: any[];
  dataKey: string;
  xAxisKey: string;
  title: string;
  tooltipText: string;
  dataSource: string;
  color: string;
  formatter?: (value: number) => string;
  chartType?: 'line' | 'area' | 'bar';
}

const CustomTooltip = ({ active, payload, label, formatter }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 p-2 border border-purple-500/50 rounded-md text-sm">
        <p className="label text-slate-300">{`${label}`}</p>
        <p className="intro text-white font-semibold">{`${payload[0].name} : ${formatter ? formatter(payload[0].value) : payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const TrendChart: React.FC<TrendChartProps> = ({ data, dataKey, xAxisKey, title, tooltipText, dataSource, color, formatter = (val) => String(val), chartType = 'area' }) => {
  
  const ChartComponent = chartType === 'bar' ? BarChart : (chartType === 'area' ? AreaChart : LineChart);
  const ChartElement = chartType === 'bar' ? Bar : (chartType === 'area' ? Area : Line);
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-center items-center">
        <h3 className="font-bold text-center text-purple-400">{title}</h3>
        <InfoTooltip text={tooltipText} />
        <Citation title="Data Source" content={dataSource} isDarkTheme={true}/>
      </div>
      <div className="flex-grow w-full h-48">
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent data={data} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 85, 247, 0.1)" />
            <XAxis dataKey={xAxisKey} tick={{ fill: '#94a3b8', fontSize: 10 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} tickFormatter={formatter} domain={['dataMin', 'dataMax']} />
            <Tooltip content={<CustomTooltip formatter={formatter} />} />
            <ChartElement type="monotone" dataKey={dataKey} name={title} stroke={color} fill={color} fillOpacity={0.2} />
          </ChartComponent>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendChart;
