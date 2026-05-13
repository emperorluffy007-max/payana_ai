import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { useState } from "react";
import { MapBackground } from "../components/MapBackground";
import { DecisionPanel } from "../components/DecisionPanel";
import { AlertsPanel } from "../components/AlertsPanel";
import { BottomBar } from "../components/BottomBar";
import { JourneyPanel } from "../components/JourneyPanel";

const mapSearchSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  mode: z.string().optional(),
});

export const Route = createFileRoute("/map")({
  validateSearch: mapSearchSchema,
  head: () => ({
    meta: [
      { title: "Live Map — payana.ai" },
      { name: "description", content: "Real-time BMTC bus tracking across Bengaluru." },
    ],
  }),
  component: LiveMapPage,
});

function LiveMapPage() {
  const { from, to, mode } = Route.useSearch();
  const isJourneyMode = !!(from && to);
  const [isNavigating, setIsNavigating] = useState(false);
  const [hasMissed, setHasMissed] = useState(false);
  const [tripVariant, setTripVariant] = useState<"default" | "metro">("default");

  const handleBusReachedStop = () => {
    if (isNavigating && tripVariant === "default") {
      setIsNavigating(false);
      setHasMissed(true);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <MapBackground
        from={from}
        to={to}
        isNavigating={isNavigating}
        onBusReachedStop={handleBusReachedStop}
        tripVariant={tripVariant}
      />
      <div className="relative z-10 pointer-events-none w-full h-full pt-16">
        <div className="flex h-full p-4 gap-4">
          {/* Left: Journey Panel (when in journey mode) or Decision Panel */}
          <div className="pointer-events-auto shrink-0 hidden lg:block">
            {isJourneyMode ? (
              <JourneyPanel
                from={from!}
                to={to!}
                mode={mode}
                isNavigating={isNavigating}
                setIsNavigating={(val) => {
                  setIsNavigating(val);
                  if (val) setHasMissed(false);
                }}
                hasMissed={hasMissed}
                onResetMissed={() => {
                  setHasMissed(false);
                  setTripVariant("default");
                }}
                onSelectAlternative={(variant) => {
                  setTripVariant(variant);
                  setHasMissed(false);
                  setIsNavigating(true);
                }}
              />
            ) : (
              <DecisionPanel />
            )}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right: Alerts */}
          {!isJourneyMode && (
            <div className="pointer-events-auto shrink-0 hidden md:block">
              <AlertsPanel />
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto">
          <BottomBar />
        </div>
      </div>
    </div>
  );
}
