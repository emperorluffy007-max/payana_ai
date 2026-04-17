import { createFileRoute } from "@tanstack/react-router";
import { MapBackground } from "../components/MapBackground";
import { DecisionPanel } from "../components/DecisionPanel";
import { AlertsPanel } from "../components/AlertsPanel";
import { BottomBar } from "../components/BottomBar";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Live Map — payana.ai" },
      { name: "description", content: "Real-time BMTC bus tracking across Bengaluru." },
    ],
  }),
  component: LiveMapPage,
});

function LiveMapPage() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <MapBackground />
      <div className="relative z-10 pointer-events-none w-full h-full pt-16">
        <div className="flex h-full p-4 gap-4">
          {/* Left: Decision Panel */}
          <div className="pointer-events-auto shrink-0 hidden lg:block">
            <DecisionPanel />
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right: Alerts */}
          <div className="pointer-events-auto shrink-0 hidden md:block">
            <AlertsPanel />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto">
          <BottomBar />
        </div>
      </div>
    </div>
  );
}
