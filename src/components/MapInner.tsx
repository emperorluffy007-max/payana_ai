import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Marker,
  Tooltip,
  Popup,
  useMap,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import { useEffect, useState, useCallback } from "react";
import {
  stops,
  initialBuses,
  moveBus,
  type Bus,
  metroStations,
  metroLines,
  initialMetroTrains,
  moveMetroTrain,
} from "../data/mockData";
import "leaflet/dist/leaflet.css";

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    0.5 -
    Math.cos(dLat) / 2 +
    (Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * (1 - Math.cos(dLon))) /
      2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

const MY_LOCATION = { lat: 12.9716, lng: 77.5946 };

function getBusColor(bus: Bus): string {
  if (bus.isBestRoute) return "#00FF9D";
  if (bus.crowdLevel === "full" || bus.crowdLevel === "crowded") return "#FF007A";
  if (bus.crowdLevel === "moderate") return "#FACC15";
  return "#4F46E5";
}

function DisableZoomControl() {
  const map = useMap();
  useEffect(() => {
    map.zoomControl.remove();
  }, [map]);
  return null;
}

function createBusIcon(color: string) {
  const pinHtml = `
    <div style="
      background-color: ${color};
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid white;
      box-shadow: 0 4px 10px rgba(0,0,0,0.4);
    ">
      <div style="transform: rotate(45deg); display: flex; align-items: center; justify-content: center;">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M8 6v6"></path>
          <path d="M15 6v6"></path>
          <path d="M2 12h19.6"></path>
          <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"></path>
          <circle cx="7" cy="18" r="2"></circle>
          <path d="M9 18h5"></path>
          <circle cx="16" cy="18" r="2"></circle>
        </svg>
      </div>
    </div>
  `;

  return L.divIcon({
    html: pinHtml,
    className: "",
    iconSize: [44, 44],
    iconAnchor: [22, 44],
    tooltipAnchor: [0, -50],
    popupAnchor: [0, -50],
  });
}

function createStationIcon(color: string) {
  const html = `
    <div style="
      background-color: white;
      width: 16px;
      height: 16px;
      border: 4px solid ${color};
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "></div>
  `;
  return L.divIcon({ html, className: "", iconSize: [16, 16], iconAnchor: [8, 8] });
}

function createTrainIcon(color: string) {
  const pinHtml = `
    <div style="
      background-color: ${color};
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid white;
      box-shadow: 0 4px 10px rgba(0,0,0,0.4);
    ">
      <div style="transform: rotate(45deg); display: flex; align-items: center; justify-content: center;">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <rect width="16" height="16" x="4" y="3" rx="2"></rect>
          <path d="M4 11h16"></path>
          <path d="M12 3v8"></path>
          <path d="m8 19-2 3"></path>
          <path d="m18 22-2-3"></path>
          <path d="M8 15h0"></path>
          <path d="M16 15h0"></path>
        </svg>
      </div>
    </div>
  `;
  return L.divIcon({
    html: pinHtml,
    className: "",
    iconSize: [44, 44],
    iconAnchor: [22, 44],
    tooltipAnchor: [0, -50],
    popupAnchor: [0, -50],
  });
}

function createMyLocationIcon() {
  const html = `
    <div style="position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; width: 14px; height: 14px; background-color: #3b82f6; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.4); z-index: 2;"></div>
      <div style="position: absolute; width: 20px; height: 20px; background-color: #3b82f6; border-radius: 50%; opacity: 0.5; animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;"></div>
    </div>
    <style>
      @keyframes pulse-ring {
        0% { transform: scale(0.5); opacity: 0.8; }
        100% { transform: scale(3.5); opacity: 0; }
      }
    </style>
  `;
  return L.divIcon({
    html,
    className: "",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    tooltipAnchor: [0, -12],
  });
}

export default function MapInner({ children }: { children?: React.ReactNode }) {
  const [buses, setBuses] = useState(initialBuses);
  const [trains, setTrains] = useState(initialMetroTrains);

  const tick = useCallback(() => {
    setBuses((prev) => prev.map(moveBus));
    setTrains((prev) => prev.map(moveMetroTrain));
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
      style={{ background: "#F1F5F9" }}
    >
      <DisableZoomControl />
      <TileLayer url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" />

      {/* Render My Location */}
      <Marker
        position={[MY_LOCATION.lat, MY_LOCATION.lng]}
        icon={createMyLocationIcon()}
        zIndexOffset={2000}
      >
        <Tooltip direction="top" permanent className="!bg-transparent !border-0 !shadow-none !p-0">
          <span className="font-heading font-bold text-[10px] bg-blue-600 border border-blue-500 text-white px-2 py-0.5 rounded-full shadow-md uppercase tracking-wider">
            You
          </span>
        </Tooltip>
      </Marker>

      {/* Render Metro Lines */}
      {metroLines.map((line) => (
        <Polyline
          key={line.id}
          positions={line.path}
          pathOptions={{ color: line.color, weight: 6, opacity: 0.6 }}
        />
      ))}

      {/* Render Metro Stations */}
      {metroStations.map((station) => {
        const color = station.line === "purple" ? "#8B5CF6" : "#10B981";
        const dist = getDistance(
          MY_LOCATION.lat,
          MY_LOCATION.lng,
          station.lat,
          station.lng,
        ).toFixed(1);
        return (
          <Marker
            key={station.id}
            position={[station.lat, station.lng]}
            icon={createStationIcon(color)}
            zIndexOffset={500}
          >
            <Tooltip
              direction="top"
              offset={[0, -10]}
              className="!bg-transparent !border-0 !shadow-none !p-0"
            >
              <span className="font-semibold text-xs bg-slate-900 border-slate-700 text-white px-2 py-1 rounded-md shadow-md">
                {station.name} <span className="opacity-70 font-normal ml-1">• {dist}km away</span>
              </span>
            </Tooltip>
          </Marker>
        );
      })}

      {/* Render Active Buses */}
      {stops.map((stop) => (
        <CircleMarker
          key={stop.id}
          center={[stop.lat, stop.lng]}
          radius={5}
          pathOptions={{ color: "#4F46E5", fillColor: "#4F46E5", fillOpacity: 0.7, weight: 1 }}
        >
          <Tooltip>{stop.name}</Tooltip>
        </CircleMarker>
      ))}

      {buses.map((bus) => {
        const color = getBusColor(bus);
        const dist = getDistance(MY_LOCATION.lat, MY_LOCATION.lng, bus.lat, bus.lng).toFixed(1);
        return (
          <Marker
            key={bus.id}
            position={[bus.lat, bus.lng]}
            icon={createBusIcon(color)}
            zIndexOffset={bus.isBestRoute ? 1000 : 0}
          >
            <Tooltip
              permanent
              direction="top"
              offset={[0, 0]}
              className="!bg-transparent !border-0 !shadow-none !p-0"
            >
              <span className="metric-value text-[10px] bg-card text-foreground px-2 py-0.5 rounded-lg shadow-md border border-border/50 uppercase tracking-wider backdrop-blur-sm bg-white/90">
                {dist}km
              </span>
            </Tooltip>
            <Popup>
              <div className="text-sm min-w-[180px]">
                <p className="font-heading font-bold">{bus.route}</p>
                <p className="text-muted-foreground text-xs mt-0.5 uppercase tracking-wider font-semibold">
                  {bus.routeName}
                </p>
                <div className="mt-3 bg-surface border border-border p-2.5 rounded-xl w-full">
                  <div className="flex justify-between items-center mb-1.5 opacity-80">
                    <span className="text-muted-foreground text-xs font-semibold">Live Crowd:</span>
                    <span className="font-bold text-xs capitalize">{bus.crowdLevel}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-xs font-semibold">
                      Distance from you:
                    </span>
                    <span className="font-bold text-xs text-indigo">{dist} km</span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}

      {/* Render Active Metro Trains */}
      {trains.map((train) => {
        const color = train.line === "purple" ? "#8B5CF6" : "#10B981";
        const dist = getDistance(MY_LOCATION.lat, MY_LOCATION.lng, train.lat, train.lng).toFixed(1);
        return (
          <Marker
            key={train.id}
            position={[train.lat, train.lng]}
            icon={createTrainIcon(color)}
            zIndexOffset={1500}
          >
            <Tooltip
              permanent
              direction="top"
              offset={[0, 0]}
              className="!bg-transparent !border-0 !shadow-none !p-0"
            >
              <span className="metric-value text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded-lg shadow-md border border-slate-700 uppercase tracking-wider backdrop-blur-sm">
                {dist}km
              </span>
            </Tooltip>
            <Popup>
              <div className="text-sm min-w-[180px]">
                <p className="font-heading font-bold">
                  {train.line === "purple" ? "Purple Line" : "Green Line"} Train
                </p>
                <p className="text-muted-foreground text-xs mt-0.5 uppercase tracking-wider font-semibold">
                  Towards {train.nextStation}
                </p>
                <div className="mt-3 bg-surface border border-border p-2.5 rounded-xl w-full">
                  <div className="flex justify-between items-center mb-1.5 opacity-80">
                    <span className="text-muted-foreground text-xs font-semibold">Status:</span>
                    <span className="font-bold text-xs">{train.status}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-xs font-semibold">
                      Distance from you:
                    </span>
                    <span className="font-bold text-xs text-indigo">{dist} km</span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}

      {children}
    </MapContainer>
  );
}
