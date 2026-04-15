import { MapContainer, TileLayer, CircleMarker, Tooltip, Popup, useMap } from 'react-leaflet';
import { useEffect, useState, useCallback } from 'react';
import { stops, initialBuses, moveBus, type Bus } from '../data/mockData';
import 'leaflet/dist/leaflet.css';

function getBusColor(bus: Bus): string {
  if (bus.isBestRoute) return '#00FF9D';
  if (bus.crowdLevel === 'full' || bus.crowdLevel === 'crowded') return '#FF007A';
  if (bus.crowdLevel === 'moderate') return '#FACC15';
  return '#4F46E5';
}

function DisableZoomControl() {
  const map = useMap();
  useEffect(() => {
    map.zoomControl.remove();
  }, [map]);
  return null;
}

export default function MapInner({ children }: { children?: React.ReactNode }) {
  const [buses, setBuses] = useState(initialBuses);

  const tick = useCallback(() => {
    setBuses(prev => prev.map(moveBus));
  }, []);

  useEffect(() => {
    const interval = setInterval(tick, 2000);
    return () => clearInterval(interval);
  }, [tick]);

  return (
    <MapContainer
      center={[12.9716, 77.5946]}
      zoom={14}
      className="w-full h-full"
      zoomControl={true}
      attributionControl={false}
      style={{ background: '#F1F5F9' }}
    >
      <DisableZoomControl />
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

      {stops.map(stop => (
        <CircleMarker
          key={stop.id}
          center={[stop.lat, stop.lng]}
          radius={5}
          pathOptions={{ color: '#4F46E5', fillColor: '#4F46E5', fillOpacity: 0.7, weight: 1 }}
        >
          <Tooltip>{stop.name}</Tooltip>
        </CircleMarker>
      ))}

      {buses.map(bus => {
        const color = getBusColor(bus);
        return (
          <CircleMarker
            key={bus.id}
            center={[bus.lat, bus.lng]}
            radius={8}
            pathOptions={{ color, fillColor: color, fillOpacity: 0.9, weight: 2 }}
          >
            <Tooltip permanent direction="top" offset={[0, -10]} className="!bg-transparent !border-0 !shadow-none !p-0">
              <span className="metric-value text-xs bg-card px-1.5 py-0.5 rounded-md shadow-sm border border-border">
                {bus.eta}m
              </span>
            </Tooltip>
            <Popup>
              <div className="text-sm">
                <p className="font-heading font-bold">{bus.route}</p>
                <p className="text-muted-foreground">{bus.routeName}</p>
                <p className="mt-1">Crowd: <span className="font-medium capitalize">{bus.crowdLevel}</span></p>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}

      {children}
    </MapContainer>
  );
}
