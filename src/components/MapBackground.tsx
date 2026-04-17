import { useEffect, useState, lazy, Suspense } from "react";

const MapInner = lazy(() => import("./MapInner"));

export function MapBackground({ children }: { children?: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  return (
    <div className="fixed inset-0 z-0">
      {isClient && (
        <Suspense fallback={<div className="w-full h-full bg-surface" />}>
          <MapInner>{children}</MapInner>
        </Suspense>
      )}
    </div>
  );
}
