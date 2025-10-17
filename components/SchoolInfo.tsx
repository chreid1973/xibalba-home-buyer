import React from 'react';
import type { School } from '../src/types';
import Citation from './Citation';

interface SchoolInfoProps {
  schools: School[];
  dataSource: string;
}

const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating / 2);
  const halfStar = rating % 2 >= 0.5 ? 1 : 0;
  const emptyStars = Math.max(0, 5 - fullStars - halfStar);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <svg key={`full-${i}`} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
      ))}
      {halfStar === 1 && (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          <path d="M10 2.5v12.5l-3.35-2.427-3.472 2.5L4.5 11.5 2 9.5h3.5L7 6.5 8.5 2.5 10 2.5z" clipPath="url(#clip0)" fill="transparent" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <svg key={`empty-${i}`} className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 20 20" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
      ))}
    </div>
  );
};

const SchoolInfo: React.FC<SchoolInfoProps> = ({ schools, dataSource }) => {
  if (!schools || schools.length === 0) {
    return (
      <div className="bg-black/20 border border-purple-500/10 p-6 rounded-lg shadow-lg h-full flex flex-col items-center justify-center text-center">
        <h3 className="text-xl font-bold text-purple-400 mb-4">Top Nearby Schools</h3>
        <p className="text-slate-400">School data is not available for this location.</p>
      </div>
    );
  }

  const generateMapsUrl = (school: School) => {
    const query = encodeURIComponent(`${school.name}, ${school.address}, ${school.city}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  return (
    <div className="bg-black/20 border border-purple-500/10 p-6 rounded-lg shadow-lg h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
            <h3 className="text-xl font-bold text-purple-400">Top Nearby Schools</h3>
            <Citation title="Data Source" content={dataSource} isDarkTheme={true} />
        </div>
      </div>
      <ul className="space-y-4">
        {schools.map((school, index) => (
          <li key={index} className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3.5a1 1 0 00.002 1.84L9 9.583V14.5a1 1 0 001 1h.093a1 1 0 00.907-.59L15 8.333V5.92a1 1 0 00-.606-.912l-7-3.5z" />
                  <path d="M17 5.92v2.413l-5 2.5v5.083l5-2.5V8.833a1 1 0 00-.394-.809l-7-3.5a1 1 0 00-.814-.002l-7 3.5A1 1 0 003 5.92v8.167a1 1 0 001 1h12a1 1 0 001-1V5.92a1 1 0 00-.394-.809l-7-3.5z" />
                </svg>
              </div>
            </div>
            <div className="ml-4 flex-grow">
              <div className="flex justify-between items-baseline">
                <p className="font-semibold text-white">{school.name}</p>
                <span className="text-xs font-mono bg-slate-700 text-slate-300 px-2 py-0.5 rounded">{school.distance}</span>
              </div>
              <div className="flex items-center mt-1">
                <StarRating rating={school.rating} />
                <span className="text-sm text-slate-400 ml-2">({school.rating.toFixed(1)}/10)</span>
              </div>
              <p className="text-sm text-slate-400">{school.type}</p>
              <a 
                href={generateMapsUrl(school)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs text-purple-400 hover:text-purple-300 hover:underline inline-flex items-center mt-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View on Google Maps
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SchoolInfo;