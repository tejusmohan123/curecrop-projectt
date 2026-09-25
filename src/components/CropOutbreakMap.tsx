import React, { useEffect, useRef, useState } from 'react';
import {
  MapPin,
  Crosshair,
  Search,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import {
  loadMapsLibrary,
  loadMarkerLibrary,
  loadGeocodingLibrary,
} from '../utils/googleMapsLoader';
import { DiagnosticResult } from '../types';

export interface OutbreakMarker {
  id: string;
  lat: number;
  lng: number;
  cropName: string;
  conditionName: string;
  severityLevel: 'Healthy' | 'Mild' | 'Moderate' | 'Severe' | 'Critical';
  severityScore: number;
  region: string;
  reportedDate: string;
  activePathogen: string;
}

// Default initial regional outbreak reports across major farming zones
export const DEFAULT_OUTBREAK_POINTS: OutbreakMarker[] = [
  {
    id: 'outbreak-1',
    lat: 19.9975,
    lng: 73.7898,
    cropName: 'Tomato / Solanaceae',
    conditionName: 'Late Blight (Phytophthora infestans)',
    severityLevel: 'Critical',
    severityScore: 92,
    region: 'Nashik Agro-Horticulture Belt, Maharashtra',
    reportedDate: 'Today',
    activePathogen: 'Phytophthora infestans',
  },
  {
    id: 'outbreak-2',
    lat: 20.9374,
    lng: 77.7796,
    cropName: 'Cotton',
    conditionName: 'Bacterial Blight (Xanthomonas malvacearum)',
    severityLevel: 'Severe',
    severityScore: 78,
    region: 'Vidarbha Basin, Amravati',
    reportedDate: 'Yesterday',
    activePathogen: 'Xanthomonas albilineans',
  },
  {
    id: 'outbreak-3',
    lat: 31.634,
    lng: 74.8723,
    cropName: 'Wheat',
    conditionName: 'Yellow Stripe Rust (Puccinia striiformis)',
    severityLevel: 'Critical',
    severityScore: 89,
    region: 'Majha Plains, Amritsar, Punjab',
    reportedDate: '2 days ago',
    activePathogen: 'Puccinia striiformis',
  },
  {
    id: 'outbreak-4',
    lat: 13.0827,
    lng: 80.2707,
    cropName: 'Paddy / Rice',
    conditionName: 'Rice Blast (Magnaporthe oryzae)',
    severityLevel: 'Moderate',
    severityScore: 54,
    region: 'Cauvery Delta & Northern Coastal Tamil Nadu',
    reportedDate: '3 days ago',
    activePathogen: 'Magnaporthe oryzae',
  },
  {
    id: 'outbreak-5',
    lat: 15.3647,
    lng: 75.124,
    cropName: 'Chilli & Pepper',
    conditionName: 'Powdery Mildew & Anthracnose Complex',
    severityLevel: 'Severe',
    severityScore: 72,
    region: 'Hubballi-Dharwad Agricultural Corridor, Karnataka',
    reportedDate: '1 day ago',
    activePathogen: 'Leveillula taurica / Colletotrichum',
  },
  {
    id: 'outbreak-6',
    lat: 23.0225,
    lng: 72.5714,
    cropName: 'Castor & Potato',
    conditionName: 'Early Blight (Alternaria solani)',
    severityLevel: 'Moderate',
    severityScore: 48,
    region: 'Ahmedabad Rural & Sabarkantha, Gujarat',
    reportedDate: '4 days ago',
    activePathogen: 'Alternaria solani',
  },
  {
    id: 'outbreak-7',
    lat: 26.9124,
    lng: 75.7873,
    cropName: 'Mustard',
    conditionName: 'White Rust (Albugo candida)',
    severityLevel: 'Moderate',
    severityScore: 52,
    region: 'Jaipur & Alwar Oilseed Tract, Rajasthan',
    reportedDate: '5 days ago',
    activePathogen: 'Albugo candida',
  },
];

interface CropOutbreakMapProps {
  currentDiagnosis?: DiagnosticResult | null;
  savedLogs?: DiagnosticResult[];
  onSelectReport?: (reportId: string) => void;
  className?: string;
  userLocation?: { lat: number; lng: number } | null;
  onLocationPick?: (loc: { lat: number; lng: number; address: string }) => void;
  allowLocationPick?: boolean;
}

export const CropOutbreakMap: React.FC<CropOutbreakMapProps> = ({
  currentDiagnosis: _currentDiagnosis,
  savedLogs = [],
  className = '',
  userLocation,
  onLocationPick,
  allowLocationPick = false,
}) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);
  const infoWindowRef = useRef<any>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [mapType, setMapType] = useState<'terrain' | 'roadmap' | 'satellite'>('terrain');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOutbreak, setSelectedOutbreak] = useState<OutbreakMarker | null>(null);
  const [geolocating, setGeolocating] = useState<boolean>(false);

  // Initialize Google Maps instance using importLibrary
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      try {
        const [{ Map, InfoWindow }, _markerLib, { Geocoder }] = await Promise.all([
          loadMapsLibrary(),
          loadMarkerLibrary(),
          loadGeocodingLibrary(),
        ]);

        if (!isMounted || !mapRef.current) return;

        // Default center: Central Agricultural Plains of India
        const defaultCenter = userLocation || { lat: 21.7679, lng: 78.8718 };
        const defaultZoom = userLocation ? 9 : 5;

        const map = new Map(mapRef.current, {
          center: defaultCenter,
          zoom: defaultZoom,
          mapTypeId: mapType,
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          styles: [
            {
              featureType: 'poi.business',
              stylers: [{ visibility: 'off' }],
            },
          ],
        });

        infoWindowRef.current = new InfoWindow();
        mapInstanceRef.current = map;
        setIsLoading(false);

        // Click-to-pick location for farm plots
        if (allowLocationPick && onLocationPick) {
          map.addListener('click', (e: any) => {
            if (!e.latLng) return;
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();

            const geocoder = new Geocoder();
            geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
              const address =
                status === 'OK' && results && results[0]
                  ? results[0].formatted_address
                  : `GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;

              onLocationPick({ lat, lng, address });
            });
          });
        }
      } catch (err: any) {
        console.error('Failed to load Google Maps:', err);
        if (isMounted) {
          setLoadError('Unable to initialize Google Maps. Please check your connection.');
          setIsLoading(false);
        }
      }
    }

    initMap();

    return () => {
      isMounted = false;
    };
  }, []);

  // Update map type
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setMapTypeId(mapType);
    }
  }, [mapType]);

  // Combine default outbreaks with user saved logs
  const combinedOutbreaks: OutbreakMarker[] = [
    ...DEFAULT_OUTBREAK_POINTS,
    ...savedLogs
      .filter((log) => log.location?.lat && log.location?.lng)
      .map((log) => ({
        id: log.id || `saved-${Math.random()}`,
        lat: log.location!.lat,
        lng: log.location!.lng,
        cropName: log.cropIdentified || 'Crop Specimen',
        conditionName: log.conditionName || 'Pathology Case',
        severityLevel: log.severityLevel || 'Moderate',
        severityScore: log.severityScore || 50,
        region: log.location?.address || log.location?.regionName || 'Field Scout Plot',
        reportedDate: log.timestamp || 'Recent',
        activePathogen: log.causalOrganism || 'Foliar Organism',
      })),
  ];

  // Render markers whenever markers or filters change
  useEffect(() => {
    if (!mapInstanceRef.current || typeof window === 'undefined' || !(window as any).google) return;
    const google = (window as any).google;

    // Clear old markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    // Filter points
    const filtered = combinedOutbreaks.filter((item) => {
      const matchSeverity =
        filterSeverity === 'all' || item.severityLevel.toLowerCase() === filterSeverity.toLowerCase();
      const matchSearch =
        searchQuery === '' ||
        item.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.conditionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.region.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSeverity && matchSearch;
    });

    // Helper for marker colors
    const getMarkerColor = (sev: string) => {
      switch (sev) {
        case 'Critical':
          return '#dc2626'; // red-600
        case 'Severe':
          return '#ea580c'; // orange-600
        case 'Moderate':
          return '#d97706'; // amber-600
        case 'Mild':
          return '#65a30d'; // lime-600
        default:
          return '#16a34a'; // green-600
      }
    };

    filtered.forEach((pt) => {
      const pinColor = getMarkerColor(pt.severityLevel);

      const marker = new google.maps.Marker({
        position: { lat: pt.lat, lng: pt.lng },
        map: mapInstanceRef.current,
        title: `${pt.cropName}: ${pt.conditionName}`,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: pt.severityLevel === 'Critical' ? 10 : 8,
          fillColor: pinColor,
          fillOpacity: 0.9,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      });

      marker.addListener('click', () => {
        setSelectedOutbreak(pt);

        const content = `
          <div style="font-family: system-ui, sans-serif; padding: 6px; max-width: 250px;">
            <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: ${pinColor}; letter-spacing: 0.5px;">
              ${pt.severityLevel} Risk (${pt.severityScore}%)
            </div>
            <div style="font-size: 13px; font-weight: 700; color: #1c1917; margin-top: 2px;">
              ${pt.cropName}
            </div>
            <div style="font-size: 12px; color: #44403c; margin-top: 1px;">
              ${pt.conditionName}
            </div>
            <div style="font-size: 11px; color: #78716c; margin-top: 4px; border-top: 1px solid #f5f5f4; padding-top: 4px;">
              📍 ${pt.region}
            </div>
            <div style="font-size: 10px; color: #a8a29e; margin-top: 2px; font-family: monospace;">
              Pathogen: ${pt.activePathogen}
            </div>
          </div>
        `;

        if (infoWindowRef.current && mapInstanceRef.current) {
          infoWindowRef.current.setContent(content);
          infoWindowRef.current.open(mapInstanceRef.current, marker);
        }
      });

      markersRef.current.push(marker);
    });

    // Mark current user location if available
    if (userLocation) {
      if (userMarkerRef.current) userMarkerRef.current.setMap(null);
      userMarkerRef.current = new google.maps.Marker({
        position: userLocation,
        map: mapInstanceRef.current,
        title: 'Current Scout GPS Location',
        icon: {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 6,
          fillColor: '#0284c7', // sky-600
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      });
    }
  }, [filterSeverity, searchQuery, userLocation, combinedOutbreaks.length]);

  // Locate current user using HTML5 Geolocation
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setGeolocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeolocating(false);
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo(coords);
          mapInstanceRef.current.setZoom(12);
        }
        if (onLocationPick) {
          const google = (window as any).google;
          if (google && google.maps && google.maps.Geocoder) {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: coords }, (results: any, status: any) => {
              const address =
                status === 'OK' && results && results[0]
                  ? results[0].formatted_address
                  : `GPS: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`;
              onLocationPick({ ...coords, address });
            });
          }
        }
      },
      (err) => {
        setGeolocating(false);
        console.warn('Geolocation failed', err);
        alert('Could not acquire your GPS location. Please allow location permissions.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleZoomToIndia = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo({ lat: 21.7679, lng: 78.8718 });
      mapInstanceRef.current.setZoom(5);
    }
  };

  return (
    <div className={`bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm flex flex-col ${className}`}>
      {/* Top Controls Bar */}
      <div className="p-4 border-b border-stone-200 bg-stone-50/70 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-xs">
            <MapPin className="w-4 h-4 text-emerald-300" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <span>Regional Pathogen & Outbreak Radar</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-300">
                LIVE GOOGLE MAPS
              </span>
            </h3>
            <p className="text-[11px] text-stone-500">
              Real-time regional crop disease clusters, spore risk zones, and field scout geotags
            </p>
          </div>
        </div>

        {/* Map Type & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Map Layer Switcher */}
          <div className="flex rounded-lg border border-stone-300 bg-white p-0.5 text-xs shadow-xs">
            <button
              type="button"
              onClick={() => setMapType('terrain')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                mapType === 'terrain'
                  ? 'bg-emerald-800 text-white font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Terrain
            </button>
            <button
              type="button"
              onClick={() => setMapType('satellite')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                mapType === 'satellite'
                  ? 'bg-emerald-800 text-white font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Satellite
            </button>
            <button
              type="button"
              onClick={() => setMapType('roadmap')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                mapType === 'roadmap'
                  ? 'bg-emerald-800 text-white font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Roads
            </button>
          </div>

          {/* Quick Actions */}
          <button
            type="button"
            onClick={handleLocateMe}
            disabled={geolocating}
            title="Locate my field plot"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-stone-700 hover:bg-stone-100 text-xs font-medium shadow-xs transition-colors cursor-pointer"
          >
            {geolocating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-700" />
            ) : (
              <Crosshair className="w-3.5 h-3.5 text-emerald-700" />
            )}
            <span className="hidden sm:inline">My Plot</span>
          </button>

          <button
            type="button"
            onClick={handleZoomToIndia}
            title="Overview of India Agricultural Belts"
            className="px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white text-stone-600 hover:text-stone-900 text-xs font-medium shadow-xs transition-colors cursor-pointer"
          >
            All Belts
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="px-4 py-2 bg-white border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search crop, disease, or region..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1 text-xs border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
          />
        </div>

        {/* Severity Legend / Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-stone-400 font-medium">Filter:</span>
          {['all', 'critical', 'severe', 'moderate'].map((sev) => (
            <button
              key={sev}
              type="button"
              onClick={() => setFilterSeverity(sev)}
              className={`px-2 py-0.5 rounded capitalize font-medium transition-colors cursor-pointer ${
                filterSeverity === sev
                  ? 'bg-stone-900 text-white font-bold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Container */}
      <div className="relative w-full h-[400px] sm:h-[480px] bg-stone-100">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-stone-50/90 gap-3">
            <Loader2 className="w-8 h-8 text-emerald-800 animate-spin" />
            <span className="text-xs font-semibold text-stone-700">
              Loading Google Maps Platform & Outbreak Layers...
            </span>
          </div>
        )}

        {loadError && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-stone-50 p-6 text-center space-y-3">
            <AlertTriangle className="w-8 h-8 text-amber-600" />
            <p className="text-xs font-semibold text-stone-800 max-w-sm">{loadError}</p>
          </div>
        )}

        <div ref={mapRef} className="w-full h-full" />

        {/* Severity Legend overlay */}
        <div className="absolute bottom-3 left-3 z-10 bg-white/95 backdrop-blur-xs p-2.5 rounded-xl border border-stone-300 shadow-md text-[11px] font-mono space-y-1">
          <div className="font-bold text-stone-900 pb-1 border-b border-stone-200 text-[10px] uppercase tracking-wider">
            Pathogen Threat Index
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0"></span>
            <span className="text-stone-700 font-sans">Critical Spore Spread (&gt;80%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-600 shrink-0"></span>
            <span className="text-stone-700 font-sans">Severe Outbreak (65-80%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600 shrink-0"></span>
            <span className="text-stone-700 font-sans">Moderate Incubation (40-65%)</span>
          </div>
        </div>

        {allowLocationPick && (
          <div className="absolute top-3 right-3 z-10 bg-emerald-900/90 text-white px-3 py-1.5 rounded-lg text-xs font-medium shadow-md backdrop-blur-xs flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-300" />
            <span>Click any location on map to select Farm Plot</span>
          </div>
        )}
      </div>

      {/* Selected Outbreak Details Bottom Drawer */}
      {selectedOutbreak && (
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`font-bold uppercase text-[10px] px-2 py-0.5 rounded ${
                  selectedOutbreak.severityLevel === 'Critical'
                    ? 'bg-red-100 text-red-800 border border-red-300'
                    : selectedOutbreak.severityLevel === 'Severe'
                    ? 'bg-orange-100 text-orange-800 border border-orange-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}
              >
                {selectedOutbreak.severityLevel} ({selectedOutbreak.severityScore}%)
              </span>
              <span className="font-bold text-stone-900 text-sm">{selectedOutbreak.cropName}</span>
              <span className="text-stone-400">·</span>
              <span className="font-semibold text-stone-700">{selectedOutbreak.conditionName}</span>
            </div>
            <div className="text-stone-600 flex items-center gap-2 text-[11px]">
              <span>📍 {selectedOutbreak.region}</span>
              <span>·</span>
              <span className="font-mono text-stone-500">Pathogen: {selectedOutbreak.activePathogen}</span>
              <span>·</span>
              <span className="text-stone-400">{selectedOutbreak.reportedDate}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSelectedOutbreak(null)}
            className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};
