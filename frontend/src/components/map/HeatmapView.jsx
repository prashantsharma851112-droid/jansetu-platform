import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { Layers } from 'lucide-react';

export default function HeatmapView({ points = [], height = '580px' }) {
  const [mapMode, setMapMode] = useState('ROADMAP'); // 'ROADMAP' | 'HYBRID' | 'DARK'

  const centerLat = points.length > 0 ? points[0].latitude || 28.6139 : 28.6139;
  const centerLng = points.length > 0 ? points[0].longitude || 77.209 : 77.209;

  const tileUrls = {
    ROADMAP: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    HYBRID: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    DARK: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  };

  const getPriorityColor = (priority, status) => {
    if (status === 'RESOLVED') return '#10b981';
    if (priority === 'CRITICAL') return '#ef4444';
    if (priority === 'HIGH') return '#f97316';
    if (priority === 'MEDIUM') return '#eab308';
    return '#3b82f6';
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-800" style={{ height }}>
      {/* Google Maps Layer Switcher Bar */}
      <div className="absolute top-4 left-4 z-[1000] bg-slate-900/90 backdrop-blur p-1 rounded-xl border border-slate-800 shadow-2xl flex items-center gap-1">
        <button
          type="button"
          onClick={() => setMapMode('ROADMAP')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
            mapMode === 'ROADMAP' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          🗺️ Google Streets
        </button>
        <button
          type="button"
          onClick={() => setMapMode('HYBRID')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
            mapMode === 'HYBRID' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          🛰️ Google Satellite
        </button>
        <button
          type="button"
          onClick={() => setMapMode('DARK')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
            mapMode === 'DARK' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          🌙 Dark Mode
        </button>
      </div>

      <MapContainer center={[centerLat, centerLng]} zoom={12} scrollWheelZoom={true} className="w-full h-full">
        <TileLayer
          key={mapMode}
          attribution={mapMode === 'DARK' ? '&copy; CARTO' : '&copy; Google Maps'}
          url={tileUrls[mapMode]}
          maxZoom={20}
        />
        {points.map((p) => {
          if (!p.latitude || !p.longitude) return null;
          const color = getPriorityColor(p.priority, p.status);
          const radius = p.priority === 'CRITICAL' ? 12 : p.priority === 'HIGH' ? 10 : 7;
          return (
            <CircleMarker
              key={p._id}
              center={[p.latitude, p.longitude]}
              radius={radius}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: 0.7,
                weight: 2,
              }}
            >
              <Popup>
                <div className="p-1 max-w-xs font-sans">
                  <span className="text-[10px] font-bold text-slate-400 block">{p.complaintCode}</span>
                  <h4 className="font-bold text-xs text-slate-800">{p.title}</h4>
                  <p className="text-[11px] text-slate-500">{p.address}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-slate-700">Status: {p.status}</span>
                    <span className="text-[10px] font-bold uppercase" style={{ color }}>
                      {p.priority} Urgency
                    </span>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
