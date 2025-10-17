import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import type { LocationAnalysis } from '../types';
import InfoTooltip from './InfoTooltip';
import Citation from './Citation';

interface LocationRadarChartProps {
  scores: LocationAnalysis['scores'];
  dataSource: string;
}

const LocationRadarChart: React.FC<LocationRadarChartProps> = ({ scores, dataSource }) => {
  const data = [
    { subject: 'Affordability', score: scores.affordability.score, fullMark: 10 },
    { subject: 'Job Market', score: scores.jobMarket.score, fullMark: 10 },
    { subject: 'Safety', score: scores.safety.score, fullMark: 10 },
    { subject: 'Schools', score: scores.schools.score, fullMark: 10 },
    { subject: 'Amenities', score: scores.amenities.score, fullMark: 10 },
  ].filter(item => typeof item.score === 'number');

  return (
    <div className="flex flex-col flex-grow h-full">
       <div className="flex justify-center items-center">
            <h3 className="font-bold text-center text-slate-700">Location Attractiveness</h3>
            <InfoTooltip text="Scores (1-10) for key location factors. Higher scores are better. This helps you understand the pros and cons of the neighborhood at a glance." />
            <Citation title="Data Source" content={dataSource} />
        </div>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#d1d5db" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
          <Radar name="Score" dataKey="score" stroke="#a855f7" fill="#a855f7" fillOpacity={0.6} />
          <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
export default LocationRadarChart;