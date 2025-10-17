import React from 'react';
import type { AnalysisResult } from '../../src/types';
import Citation from './Citation';

interface SchoolInfoProps {
  schools: AnalysisResult['locationAnalysis']['topSchools'];
  dataSource: string;
}

const SchoolInfo: React.FC<SchoolInfoProps> = ({ schools, dataSource }) => {
  return (
    <div className="bg-black/20 border border-purple-500/10 p-6 rounded-lg shadow-lg h-full">
      <h4 className="font-bold text-purple-400 mb-4 flex items-center">
        Top Nearby Schools
        <Citation title="Data Source" content={dataSource} isDarkTheme={true} />
      </h4>
      <div className="space-y-4">
        {schools.map((school, i) => (
          <div key={i} className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-white">{school.name}</p>
              <p className="text-xs text-slate-400">{school.type} &bull; {school.distance}</p>
            </div>
            <div className="text-lg font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-md">
              {school.rating.toFixed(1)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchoolInfo;
