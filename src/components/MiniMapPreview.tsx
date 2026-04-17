import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { initialBuses, moveBus } from "../data/mockData";

function createMiniBusIcon() {
  const html = `
    <div style="background-color: #4F46E5; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center;">
      <div style="background-color: white; width: 4px; height: 4px; border-radius: 50%;"></div>
    </div>
  `;
  return L.divIcon({ html, className: "", iconSize: [18, 18], iconAnchor: [9, 9] });
}

export default function MiniMapPreview() {
  const [buses, setBuses] = useState(initialBuses);

  useEffect(() => {
    const interval = setInterval(() => {
      setBuses((prev) => prev.map(moveBus));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[160px] rounded-xl border border-border overflow-hidden pointer-events-none bg-secondary z-0">
      <MapContainer
        center={[12.9716, 77.5946]}
        zoom={12}
        zoomControl={false}
        attributionControl={false}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <TileLayer url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" />
        {buses.slice(0, 5).map((bus) => (
          <Marker key={bus.id} position={[bus.lat, bus.lng]} icon={createMiniBusIcon()} />
        ))}
      </MapContainer>

      {/* Floating Badge */}
      <div className="absolute top-2 left-2 flex items-center gap-1.5 glass-panel text-[10px] px-2 py-0.5 rounded-full font-medium shadow-sm z-[1000] bg-background/90 text-foreground">
        <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" /> Live Tracking
      </div>
    </div>
  );
}
