import React from 'react';
import InfoTooltip from './InfoTooltip';

interface TrendChartProps {
  data: { [key: string]: string | number }[];
  dataKey: string;
  xAxisKey: string;
  title: string;
  tooltipText: string;
  dataSource: string;
  color: string;
  formatter?: (value: number) => string;
  chartType?: 'line' | 'bar';
}

const TrendChart: React.FC<TrendChartProps> = ({ data, dataKey, xAxisKey, title, tooltipText, dataSource, color, formatter = (v) => String(v), chartType = 'line' }) => {
    const values = data.map(d => d[dataKey] as number);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const range = maxVal - minVal;

    // Handle case where all values are the same
    const getNormalizedHeight = (val: number) => {
        if (range === 0) return 50;
        return ((val - minVal) / range) * 100;
    }

    return (
        <div>
            <h4 className="font-bold text-purple-400 mb-4 text-center flex items-center justify-center">
                {title}
                <InfoTooltip text={tooltipText} dataSource={dataSource} />
            </h4>
            <div className="w-full h-48 bg-slate-900/50 p-2 rounded-lg">
                <div className="w-full h-full border-l border-b border-slate-700 relative">
                    {chartType === 'line' && data.length > 1 ? (
                         <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <polyline
                                fill="none"
                                stroke={color}
                                strokeWidth="2"
                                points={data.map((d, i) => {
                                    const y = 100 - getNormalizedHeight(d[dataKey] as number);
                                    const x = (i / (data.length - 1)) * 100;
                                    return `${x},${y < 2 ? 2 : (y > 98 ? 98 : y)}`;
                                }).join(' ')}
                            />
                        </svg>
                    ) : (
                        <div className="flex h-full items-end justify-around gap-1 px-1">
                           {data.map((d, i) => (
                               <div key={i} className="w-full" style={{ height: `${getNormalizedHeight(d[dataKey] as number)}%`, backgroundColor: color, minHeight: '2px' }}></div>
                           ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex justify-between text-xs text-slate-400 mt-1 px-1">
                <span>{data[0]?.[xAxisKey]}</span>
                <span>{data[data.length - 1]?.[xAxisKey]}</span>
            </div>
        </div>
    );
};

export default TrendChart;
