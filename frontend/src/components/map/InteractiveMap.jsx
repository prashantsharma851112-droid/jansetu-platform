import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Clock, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';

const statusColors = {
  SUBMITTED: '#64748b',
  ASSIGNED: '#3b82f6',
  IN_PROGRESS: '#f59e0b',
  UNDER_REVIEW: '#8b5cf6',
  RESOLVED: '#10b981',
  REJECTED: '#ef4444',
};

const createMarkerIcon = (color) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32" height="32"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;
  return L.divIcon({
    html: svg,
    className: 'custom-map-pin',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

export default function InteractiveMap({ complaints = [], onSelectComplaint, height = '450px' }) {
  const centerLat = complaints.length > 0 ? complaints[0].latitude || 28.6139 : 28.6139;
  const centerLng = complaints.length > 0 ? complaints[0].longitude || 77.209 : 77.209;

  return (
    <div className="w-full rounded-xl overflow-hidden shadow-lg border border-slate-200" style={{ height }}>
      <MapContainer center={[centerLat, centerLng]} zoom={12} scrollWheelZoom={true} className="w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {complaints.map((c) => {
          if (!c.latitude || !c.longitude) return null;
          const color = statusColors[c.status] || '#3b82f6';
          return (
            <Marker key={c._id} position={[c.latitude, c.longitude]} icon={createMarkerIcon(color)}>
              <Popup className="custom-popup">
                <div className="p-1 max-w-xs font-sans">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-700">
                      {c.complaintCode}
                    </span>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded text-white uppercase"
                      style={{ backgroundColor: color }}
                    >
                      {c.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs mb-1 line-clamp-1">{c.title}</h4>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mb-2 line-clamp-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    {c.address}
                  </p>
                  {onSelectComplaint && (
                    <button
                      onClick={() => onSelectComplaint(c)}
                      className="w-full text-center bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-semibold py-1 rounded transition"
                    >
                      View Complaint Details
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
