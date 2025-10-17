import React, { useEffect, useRef } from 'react';
import type { Amenity } from '../src/types';
import InfoTooltip from './InfoTooltip';

// Since Leaflet is loaded from a CDN, we need to declare the `L` global variable
declare const L: any;

interface NeighborhoodMapProps {
  center: {
    lat: number;
    lon: number;
  };
  amenities: Amenity[];
}

const amenityStyles: Record<Amenity['type'], { icon: string; color: string; className: string }> = {
    Grocery: { icon: '🛒', color: '#22c55e', className: 'bg-green-500' },
    Park: { icon: '🌳', color: '#10b981', className: 'bg-emerald-500' },
    Hospital: { icon: '🏥', color: '#ef4444', className: 'bg-red-500' },
    Transit: { icon: '🚌', color: '#3b82f6', className: 'bg-blue-500' },
    Restaurant: { icon: '🍔', color: '#f97316', className: 'bg-orange-500' },
    Cafe: { icon: '☕', color: '#ca8a04', className: 'bg-yellow-600' },
};

const NeighborhoodMap: React.FC<NeighborhoodMapProps> = ({ center, amenities }) => {
    const mapRef = useRef<any>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Ensure this effect runs only once for map initialization
        if (!mapRef.current && mapContainerRef.current && typeof L !== 'undefined') {
            const map = L.map(mapContainerRef.current).setView([center.lat, center.lon], 15);
            mapRef.current = map;

            const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            });

            const baseMaps = {
                "Map": streetLayer,
                "Satellite": satelliteLayer
            };

            L.control.layers(baseMaps).addTo(map);

            // Home marker
            const homeIcon = L.divIcon({
                html: `<div class="w-6 h-6 rounded-full bg-cyan-400 border-2 border-white flex items-center justify-center shadow-lg animate-pulse">🏠</div>`,
                className: '',
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            });
            L.marker([center.lat, center.lon], { icon: homeIcon }).addTo(map).bindPopup('Your Target Area');

            // Amenity markers
            amenities.forEach(amenity => {
                const style = amenityStyles[amenity.type] || { icon: '📍', color: '#71717a', className: 'bg-gray-500' };
                const amenityIcon = L.divIcon({
                    html: `<div class="w-6 h-6 rounded-full ${style.className} flex items-center justify-center text-sm shadow-md border-2 border-white/50">${style.icon}</div>`,
                    className: '',
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                });
                L.marker([amenity.lat, amenity.lon], { icon: amenityIcon }).addTo(map).bindPopup(`${amenity.name} (${amenity.type})`);
            });
        }
        
        // Cleanup function to remove the map instance when component unmounts
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };

    }, [center, amenities]);


    if (!center || !amenities) {
        return (
            <div className="bg-slate-800 p-6 rounded-lg shadow-lg h-full flex items-center justify-center">
                <p className="text-slate-400">Map data is not available.</p>
            </div>
        );
    }
    
    return (
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg h-full flex flex-col min-h-[400px]">
            <div className="flex justify-between items-center mb-4">
                 <h3 className="text-xl font-bold text-cyan-400">Neighborhood Map</h3>
                 <InfoTooltip text="An interactive map showing key amenities. Pan, zoom, and switch between map and satellite views." />
            </div>
            <div ref={mapContainerRef} className="flex-grow w-full h-full rounded-lg" id="map-container" />
        </div>
    );
};

export default NeighborhoodMap;
