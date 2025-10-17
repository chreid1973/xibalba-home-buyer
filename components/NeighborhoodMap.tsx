import React from 'react';
import type { AnalysisResult } from '../../src/types';
import Citation from './Citation';

interface NeighborhoodMapProps {
    center: { lat: number, lon: number };
    amenities: AnalysisResult['locationAnalysis']['amenities'];
    dataSource: string;
}

const amenityIcons: { [key: string]: string } = {
    Grocery: '🛒',
    Park: '🌳',
    Hospital: '🏥',
    Transit: '🚌',
    Restaurant: '🍔',
    Cafe: '☕️',
    'default': '📍'
};

const NeighborhoodMap: React.FC<NeighborhoodMapProps> = ({ center, amenities, dataSource }) => {
    // This is a static placeholder for an interactive map.
    return (
        <div className="bg-black/20 border border-purple-500/10 p-6 rounded-lg shadow-lg h-full">
            <h4 className="font-bold text-purple-400 mb-4 flex items-center">
                Neighborhood Map
                 <Citation title="Data Source" content={dataSource} isDarkTheme={true} />
            </h4>
            <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center relative overflow-hidden">
                <p className="text-slate-500 z-10">Map Placeholder</p>
                {/* Decorative map-like elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-20">
                    <div className="absolute top-1/2 left-0 w-full h-px bg-slate-600"></div>
                    <div className="absolute left-1/2 top-0 h-full w-px bg-slate-600"></div>
                    <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border border-slate-600 rounded-sm"></div>
                </div>
            </div>
            <div className="mt-4">
                 <h5 className="text-sm font-semibold text-slate-300 mb-2">Key Amenities Nearby:</h5>
                <div className="flex flex-wrap gap-2">
                    {amenities.map(amenity => (
                        <div key={amenity.name} className="bg-slate-700 text-slate-200 text-xs px-2 py-1 rounded-full flex items-center">
                            {amenityIcons[amenity.type] || amenityIcons['default']} <span className="ml-1.5">{amenity.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NeighborhoodMap;
