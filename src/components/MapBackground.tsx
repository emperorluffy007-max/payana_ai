import { useEffect, useState, lazy, Suspense } from "react";

const MapInner = lazy(() => import("./MapInner"));

interface MapBackgroundProps {
  children?: React.ReactNode;
  from?: string;
  to?: string;
  isNavigating?: boolean;
  onBusReachedStop?: () => void;
  tripVariant?: 'default' | 'metro';
}

export function MapBackground({ children, from, to, isNavigating, onBusReachedStop, tripVariant }: MapBackgroundProps) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  return (
    <div className="fixed inset-0 z-0">
      {isClient && (
        <Suspense fallback={<div className="w-full h-full bg-surface" />}>
          <MapInner 
            from={from} 
            to={to} 
            isNavigating={isNavigating} 
            onBusReachedStop={onBusReachedStop}
            tripVariant={tripVariant}
          >
            {children}
          </MapInner>
        </Suspense>
      )}
    </div>
  );
}
