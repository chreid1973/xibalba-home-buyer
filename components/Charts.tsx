import React from 'react';
import type { MarketData } from '../src/types';
import TrendChart from './TrendChart';

interface ChartsProps {
  marketData: MarketData;
  insights: {
    homePriceForecast: string;
    interestRateForecast: string;
    inventoryLevels: string;
  };
}

const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0, notation: 'compact' });
const percentFormatter = (value: number) => `${value.toFixed(2)}%`;
const numberFormatter = (value: number) => new Intl.NumberFormat('en-US', { notation: 'compact' }).format(value);

const Charts: React.FC<ChartsProps> = ({ marketData, insights }) => {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="bg-black/20 border border-purple-500/10 p-4 rounded-lg shadow-lg">
        <TrendChart
          data={marketData.averageHomePrice}
          dataKey="price"
          xAxisKey="quarter"
          title="Average Home Price"
          tooltipText={insights.homePriceForecast}
          dataSource={marketData.dataSource}
          color="#a855f7"
          formatter={(val) => currencyFormatter.format(val)}
        />
      </div>
      <div className="bg-black/20 border border-purple-500/10 p-4 rounded-lg shadow-lg">
        <TrendChart
          data={marketData.interestRateForecast}
          dataKey="rate"
          xAxisKey="quarter"
          title="Interest Rate Forecast"
          tooltipText={insights.interestRateForecast}
          dataSource={marketData.dataSource}
          color="#3b82f6"
          formatter={percentFormatter}
        />
      </div>
      <div className="bg-black/20 border border-purple-500/10 p-4 rounded-lg shadow-lg">
        <TrendChart
          data={marketData.inventoryLevels}
          dataKey="level"
          xAxisKey="quarter"
          title="Housing Inventory Levels"
          tooltipText={insights.inventoryLevels}
          dataSource={marketData.dataSource}
          color="#10b981"
          chartType="bar"
          formatter={numberFormatter}
        />
      </div>
    </div>
  );
};

export default Charts;
