import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Correction pour l'icône du marqueur qui n'apparaît pas par défaut
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface MapViewProps {
  start: { lat: number; lon: number } | null;
  end: { lat: number; lon: number } | null;
  route: [number, number][] | null;
}

const ChangeView: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

const MapView: React.FC<MapViewProps> = ({ start, end, route }) => {
  const center: [number, number] = start ? [start.lat, start.lon] : [5.3454, -4.0244]; // Abidjan par défaut

  return (
    <MapContainer center={center} zoom={13} style={{ height: '400px', width: '100%' }} className="rounded-lg shadow-md">
      <ChangeView center={center} zoom={start || end ? 14 : 13} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {start && <Marker position={[start.lat, start.lon]} />}
      {end && <Marker position={[end.lat, end.lon]} />}
      {route && <Polyline positions={route} color="blue" />}
    </MapContainer>
  );
};

export default MapView;
