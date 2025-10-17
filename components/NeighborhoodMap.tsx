import React, { useEffect, useRef, useState } from 'react';
import type { Amenity } from '../src/types';
import InfoTooltip from './InfoTooltip';
import Citation from './Citation';

// Declare google global for TypeScript
declare const google: any;

interface NeighborhoodMapProps {
  center: {
    lat: number;
    lon: number;
  };
  amenities: Amenity[];
  dataSource: string;
}

const amenityStyles: Record<Amenity['type'], { icon: string; color: string; className: string }> = {
    Grocery: { icon: '🛒', color: '#22c55e', className: 'bg-green-500' },
    Park: { icon: '🌳', color: '#10b981', className: 'bg-emerald-500' },
    Hospital: { icon: '🏥', color: '#ef4444', className: 'bg-red-500' },
    Transit: { icon: '🚌', color: '#3b82f6', className: 'bg-blue-500' },
    Restaurant: { icon: '🍔', color: '#f97316', className: 'bg-orange-500' },
    Cafe: { icon: '☕', color: '#ca8a04', className: 'bg-yellow-600' },
};

// Google Maps dark style
const mapStyle = [
    { "featureType": "all", "elementType": "labels.text.fill", "stylers": [{ "color": "#ffffff" }] },
    { "featureType": "all", "elementType": "labels.text.stroke", "stylers": [{ "color": "#000000" }, { "lightness": 13 }] },
    { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [{ "color": "#000000" }] },
    { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{ "color": "#144b53" }, { "lightness": 14 }, { "weight": 1.4 }] },
    { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#08304b" }] },
    { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#0c4152" }, { "lightness": 5 }] },
    { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#000000" }] },
    { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#0b434f" }, { "lightness": 25 }] },
    { "featureType": "road.arterial", "elementType": "geometry.fill", "stylers": [{ "color": "#000000" }] },
    { "featureType": "road.arterial", "elementType": "geometry.stroke", "stylers": [{ "color": "#0b3d51" }, { "lightness": 16 }] },
    { "featureType": "road.local", "elementType": "geometry", "stylers": [{ "color": "#000000" }] },
    { "featureType": "transit", "elementType": "all", "stylers": [{ "color": "#146474" }] },
    { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#021019" }] }
];


const NeighborhoodMap: React.FC<NeighborhoodMapProps> = ({ center, amenities, dataSource }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [mapError, setMapError] = useState<string | null>(null);

    useEffect(() => {
        // Fix: Cast `window` to `any` to safely check for the `google` object.
        if (typeof (window as any).google !== 'undefined' && (window as any).google.maps) {
            setIsScriptLoaded(true);
            return;
        }

        const scriptId = 'google-maps-script';
        if (document.getElementById(scriptId)) return;

        const script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDXh8GVfuUquP5vubk0RJldN7cJNmKunGU`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
            setIsScriptLoaded(true);
        };
        script.onerror = () => {
            console.error("Google Maps script failed to load.");
            setIsLoading(false);
            setMapError("Failed to load the Google Maps script. Please check your network connection.");
        };

        document.body.appendChild(script);
        
    }, []);

    useEffect(() => {
        if (!isScriptLoaded || !mapContainerRef.current || !center) return;

        setIsLoading(true);
        setMapError(null);

        try {
            const getAmenityIcon = (style: { icon: string; color: string; }) => {
                const svg = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="16" fill="${style.color}" stroke="rgba(255,255,255,0.8)" stroke-width="2"/>
                        <text x="18" y="24" font-size="18" text-anchor="middle" fill="white" font-family="sans-serif">${style.icon}</text>
                    </svg>
                `;
                return {
                    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
                    scaledSize: new google.maps.Size(36, 36),
                    anchor: new google.maps.Point(18, 18),
                };
            };

            const homeIconSvg = `
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
                    <defs>
                        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                            <feDropShadow dx="0" dy="2" stdDeviation="1.5" flood-color="#000" flood-opacity="0.5"/>
                        </filter>
                    </defs>
                    <path fill="#a855f7" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" style="filter:url(#shadow)"/>
                </svg>
            `;

            const homeIcon = {
                url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(homeIconSvg)}`,
                scaledSize: new google.maps.Size(48, 48),
                anchor: new google.maps.Point(24, 48),
            };

            const map = new google.maps.Map(mapContainerRef.current, {
                center: { lat: center.lat, lng: center.lon },
                zoom: 15,
                styles: mapStyle,
                disableDefaultUI: true,
                zoomControl: true,
                gestureHandling: 'cooperative',
            });
            
            const infoWindow = new google.maps.InfoWindow({
                content: '',
                pixelOffset: new google.maps.Size(0, -10),
            });

            new google.maps.Marker({
                position: { lat: center.lat, lng: center.lon },
                map,
                title: 'Your Target Area',
                icon: homeIcon,
                zIndex: 1000,
            });

            amenities.forEach(amenity => {
                const style = amenityStyles[amenity.type] || { icon: '📍', color: '#71717a' };
                const amenityMarker = new google.maps.Marker({
                    position: { lat: amenity.lat, lng: amenity.lon },
                    map,
                    title: `${amenity.name} (${amenity.type})`,
                    icon: getAmenityIcon(style),
                });
                
                amenityMarker.addListener('click', () => {
                    const contentString = `<div style="color: #333; font-family: sans-serif; padding: 5px;"><strong>${amenity.name}</strong><br/>${amenity.type}</div>`;
                    infoWindow.setContent(contentString);
                    infoWindow.open({
                        anchor: amenityMarker,
                        map,
                        shouldFocus: false,
                    });
                });
            });
            
            setIsLoading(false);

        } catch (e) {
            console.error("Error initializing Google Map:", e);
            setIsLoading(false);
            setMapError("The map couldn't load due to a configuration issue with the Google Maps API key.");
        }

    }, [isScriptLoaded, center, amenities]);

    if (!center || !amenities) {
        return (
            <div className="bg-black/20 border border-purple-500/10 p-6 rounded-lg shadow-lg h-full flex items-center justify-center min-h-[400px]">
                <p className="text-slate-400">Map data is not available.</p>
            </div>
        );
    }
    
    if (mapError) {
         return (
            <div className="bg-black/20 border border-purple-500/10 p-6 rounded-lg shadow-lg h-full flex flex-col min-h-[400px]">
                <div className="flex justify-between items-center mb-4">
                     <h3 className="text-xl font-bold text-purple-400">Neighborhood Map</h3>
                </div>
                <div className="relative flex-grow w-full h-full rounded-lg bg-slate-800/50 border border-yellow-500/30 flex flex-col items-center justify-center text-center p-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h4 className="text-lg font-bold text-yellow-300">Action Required: Configure Google Maps API</h4>
                    <p className="text-slate-300 mt-2 text-sm max-w-md">
                        {mapError} This is usually caused by the API key configuration in your Google Cloud project.
                    </p>
                    <div className="bg-slate-900 p-4 rounded-md mt-4 text-left text-sm">
                        <p className="font-semibold text-white">To fix this, you must:</p>
                        <ol className="list-decimal list-inside mt-2 space-y-1 text-slate-400">
                            <li>Go to your <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">Google Cloud Console</a>.</li>
                            <li>Select the project associated with your API key.</li>
                            <li>Enable the <strong className="text-slate-300">"Maps JavaScript API"</strong> service.</li>
                        </ol>
                    </div>
                    <p className="text-slate-400 mt-4 text-xs">
                        This is a configuration setting and does not require a code change. Once enabled, the map will load correctly. For more details, see the 
                        <a href="https://developers.google.com/maps/documentation/javascript/error-messages#api-not-activated-map-error" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline ml-1">official documentation</a>.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-black/20 border border-purple-500/10 p-6 rounded-lg shadow-lg h-full flex flex-col min-h-[400px]">
            <div className="flex justify-between items-center mb-4">
                 <div className="flex items-center">
                    <h3 className="text-xl font-bold text-purple-400">Neighborhood Map</h3>
                    <Citation title="Data Source" content={dataSource} isDarkTheme={true} />
                 </div>
                 <InfoTooltip text="An interactive map showing key amenities powered by Google Maps. Pan, zoom, and explore the area." />
            </div>
            <div className="relative flex-grow w-full h-full rounded-lg">
                {isLoading && (
                    <div className="absolute inset-0 bg-slate-900/70 flex items-center justify-center z-10">
                        <p className="text-slate-300">Loading map...</p>
                    </div>
                )}
                <div ref={mapContainerRef} className="w-full h-full rounded-lg" id="map-container" />
            </div>
        </div>
    );
};

export default NeighborhoodMap;