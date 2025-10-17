import React from 'react';
import type { AnalysisResult } from '../../src/types';
import Citation from './Citation';

interface LocationRadarChartProps {
  scores: AnalysisResult['locationAnalysis']['scores'];
  dataSource: string;
}

const LocationRadarChart: React.FC<LocationRadarChartProps> = ({ scores, dataSource }) => {
    const scoreData = [
        { name: 'Affordability', value: scores.affordability.score },
        { name: 'Job Market', value: scores.jobMarket.score },
        { name: 'Safety', value: scores.safety.score },
        { name: 'Schools', value: scores.schools.score },
        { name: 'Amenities', value: scores.amenities.score },
    ];

    return (
        <div className="text-center">
            <h4 className="font-bold text-purple-400 mb-4 flex items-center justify-center">
                Location Attractiveness
                <Citation title="Data Source" content={dataSource} isDarkTheme={true} />
            </h4>
            <div className="p-4 bg-slate-900/50 rounded-lg">
                <p className="text-xs text-slate-400 mb-2">Each category is scored from 1 to 10.</p>
                <div className="space-y-3">
                    {scoreData.map(item => (
                        <div key={item.name} className="flex items-center">
                            <span className="text-sm text-slate-300 w-28 text-left">{item.name}</span>
                            <div className="w-full bg-slate-700 rounded-full h-2.5">
                                <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${item.value * 10}%` }}></div>
                            </div>
                            <span className="text-sm font-semibold text-white w-10 text-right">{item.value.toFixed(1)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LocationRadarChart;
