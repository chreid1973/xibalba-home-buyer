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

const amenityStyles: Record<Amenity['type'], { svgPath: string; color: string; className: string }> = {
    Grocery:    { svgPath: '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c.51 0 .955-.343 1.087-.835l.383-1.437M7.5 14.25V5.106M7.5 14.25a3 3 0 0 1 3-3h3.75a3 3 0 0 1 3 3M3.75 5.106c0-1.108.892-2.006 2-2.006h5c1.108 0 2 .898 2 2.006v3.662M16.5 5.106v3.662m0 0a3 3 0 0 1-3 3h-3.75a3 3 0 0 1-3-3m0 0h9.75" />', color: '#22c55e', className: 'bg-green-500' },
    Park:       { svgPath: '<path stroke-linecap="round" stroke-linejoin="round" d="m12.75 21-3-3m0 0 3-3m-3 3h12.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />', color: '#10b981', className: 'bg-emerald-500' },
    Hospital:   { svgPath: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />', color: '#ef4444', className: 'bg-red-500' },
    Transit:    { svgPath: '<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5v-1.875a3.375 3.375 0 0 1 3.375-3.375h1.5a1.125 1.125 0 0 1 1.125 1.125v-1.5a3.375 3.375 0 0 1 3.375-3.375H15a3.375 3.375 0 0 1 3.375 3.375v1.5a1.125 1.125 0 0 1 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375v1.875m-17.25 4.5a3.375 3.375 0 0 0 3.375 3.375h9.75a3.375 3.375 0 0 0 3.375-3.375m-17.25 4.5L5.625 18.75m11.25 0-1.125-1.125" />', color: '#3b82f6', className: 'bg-blue-500' },
    Restaurant: { svgPath: '<path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />', color: '#f97316', className: 'bg-orange-500' },
    Cafe:       { svgPath: '<path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5c.667 1.143 2.333 1.143 3 0M4.5 9h15M5.25 3h13.5a1.125 1.125 0 0 1 1.125 1.125v6.75a1.125 1.125 0 0 1-1.125 1.125H5.25a1.125 1.125 0 0 1-1.125-1.125V4.125A1.125 1.125 0 0 1 5.25 3Z" />', color: '#ca8a04', className: 'bg-yellow-600' },
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
        // Fix: Check if the Google Maps script is already loaded on the window to avoid adding it multiple times.
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
            const getAmenityIcon = (style: { svgPath: string; color: string; }) => {
                const svg = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="16" fill="${style.color}" stroke="rgba(255,255,255,0.8)" stroke-width="2"/>
                        <g transform="translate(9, 9) scale(0.75)">
                            <path fill="none" stroke="white" stroke-width="2" d="${style.svgPath}" />
                        </g>
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
                const style = amenityStyles[amenity.type] || { svgPath: '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>', color: '#71717a' };
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