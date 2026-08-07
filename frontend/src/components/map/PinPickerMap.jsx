import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Loader2, Search, X } from 'lucide-react';
import axios from 'axios';

const getCustomPinIcon = () => {
  return new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38],
  });
};

function MapController({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 15, { animate: true, duration: 1.2 });
    }
  }, [position, map]);
  return null;
}

function LocationMarker({ position, setPosition, onLocationSelected }) {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      reverseGeocode(lat, lng);
    },
  });

  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      if (res.data) {
        const address = res.data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        const area = res.data.address?.suburb || res.data.address?.city_district || res.data.address?.county || 'Central Zone';
        const pincode = res.data.address?.postcode || '110001';
        onLocationSelected({ lat, lng, address, area, pincode });
      }
    } catch (err) {
      onLocationSelected({ lat, lng, address: `Latitude: ${lat.toFixed(5)}, Longitude: ${lng.toFixed(5)}`, area: 'Central Zone', pincode: '110001' });
    }
  };

  return position ? (
    <Marker
      position={position}
      draggable={true}
      icon={getCustomPinIcon()}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const pos = marker.getLatLng();
          setPosition([pos.lat, pos.lng]);
          reverseGeocode(pos.lat, pos.lng);
        },
      }}
    />
  ) : null;
}

export default function PinPickerMap({ defaultLat = 28.6139, defaultLng = 77.209, onLocationChange }) {
  const [position, setPosition] = useState([defaultLat, defaultLng]);
  const [mapMode, setMapMode] = useState('ROADMAP'); // 'ROADMAP' | 'HYBRID' | 'SATELLITE'
  const [loadingGeo, setLoadingGeo] = useState(false);

  // Area Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const tileUrls = {
    ROADMAP: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    HYBRID: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    SATELLITE: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setSearching(true);
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(searchQuery)}`
      );
      if (res.data && res.data.length > 0) {
        setSearchResults(res.data);
        setShowResults(true);
      } else {
        alert('No locations found for this query. Try adding city name e.g. "Connaught Place, Delhi"');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const selectSearchResult = (item) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    const address = item.display_name;
    const area = item.address?.suburb || item.address?.city_district || item.address?.county || searchQuery;
    const pincode = item.address?.postcode || '110001';

    setPosition([lat, lng]);
    onLocationChange({ lat, lng, address, area, pincode });
    setShowResults(false);
    setSearchQuery(item.display_name.split(',')[0]);
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoadingGeo(true);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setPosition([lat, lng]);
          setLoadingGeo(false);

          try {
            const res = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
            );
            if (res.data) {
              const address = res.data.display_name;
              const area = res.data.address?.suburb || res.data.address?.city_district || 'Central Ward';
              const pincode = res.data.address?.postcode || '110001';
              onLocationChange({ lat, lng, address, area, pincode });
            }
          } catch (err) {
            onLocationChange({ lat, lng, address: `Detected Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`, area: 'Central Ward', pincode: '110001' });
          }
        },
        () => {
          setLoadingGeo(false);
          alert('Location access denied. Please click on the map to drop pin manually.');
        }
      );
    }
  };

  return (
    <div className="relative w-full h-[380px] rounded-2xl overflow-hidden border border-slate-300 shadow-lg flex flex-col">
      {/* Top Search Bar & Controls Overlay */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pointer-events-auto">
        {/* Live Area Search Box */}
        <div className="relative flex-1 max-w-md">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search area, landmark, or city (e.g. Connaught Place)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchResults.length > 0 && setShowResults(true)}
              className="w-full text-xs font-semibold pl-10 pr-9 py-2.5 bg-slate-900/95 backdrop-blur text-white border border-slate-700 rounded-xl shadow-xl outline-none focus:ring-2 focus:ring-teal-500"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setShowResults(false);
                }}
                className="absolute right-3 top-3 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : null}
          </form>

          {/* Search Dropdown Suggestions */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900/95 backdrop-blur border border-slate-700 rounded-xl shadow-2xl overflow-hidden max-h-48 overflow-y-auto space-y-0.5 p-1">
              {searchResults.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => selectSearchResult(item)}
                  className="w-full text-left p-2 hover:bg-slate-800 rounded-lg text-xs transition flex items-start gap-2"
                >
                  <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block line-clamp-1">{item.display_name.split(',')[0]}</span>
                    <span className="text-[10px] text-slate-400 line-clamp-1">{item.display_name}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Controls Right Group */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          {/* Layer Mode Switcher */}
          <div className="bg-slate-900/95 backdrop-blur p-1 rounded-xl border border-slate-700 shadow-xl flex items-center gap-1">
            <button
              type="button"
              onClick={() => setMapMode('ROADMAP')}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition ${
                mapMode === 'ROADMAP' ? 'bg-teal-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              🗺️ Streets
            </button>
            <button
              type="button"
              onClick={() => setMapMode('HYBRID')}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition ${
                mapMode === 'HYBRID' ? 'bg-teal-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              🛰️ Satellite
            </button>
          </div>

          {/* GPS Location Button */}
          <button
            type="button"
            onClick={handleCurrentLocation}
            disabled={loadingGeo}
            className="bg-white/95 backdrop-blur text-teal-900 hover:bg-white text-xs font-black px-3 py-2 rounded-xl shadow-xl flex items-center gap-1.5 border border-slate-200 hover:border-teal-500 transition-all shrink-0"
          >
            {loadingGeo ? <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" /> : <Navigation className="w-3.5 h-3.5 text-teal-600" />}
            Live GPS
          </button>
        </div>
      </div>

      {/* Map Container */}
      <MapContainer center={position} zoom={14} scrollWheelZoom={true} className="w-full h-full">
        <MapController position={position} />
        <TileLayer
          key={mapMode}
          attribution='&copy; <a href="https://maps.google.com">Google Maps</a>'
          url={tileUrls[mapMode]}
          maxZoom={20}
        />
        <LocationMarker position={position} setPosition={setPosition} onLocationSelected={onLocationChange} />
      </MapContainer>

      {/* Help Banner */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-slate-950/85 backdrop-blur text-white text-[11px] px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow border border-slate-800">
        <MapPin className="w-3.5 h-3.5 text-teal-400" />
        Click map, search area, or drag red pin to mark location
      </div>
    </div>
  );
}
