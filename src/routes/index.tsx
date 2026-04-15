import { createFileRoute } from '@tanstack/react-router';
import { MapBackground } from '../components/MapBackground';
import { DecisionPanel } from '../components/DecisionPanel';
import { AlertsPanel } from '../components/AlertsPanel';
import { BottomBar } from '../components/BottomBar';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'payana.ai — AI-Powered Transit Dashboard for Bengaluru' },
      { name: 'description', content: 'Real-time BMTC bus tracking, crowd insights, and smart route decisions for Bengaluru commuters.' },
      { property: 'og:title', content: 'payana.ai — AI-Powered Transit Dashboard' },
      { property: 'og:description', content: 'Real-time BMTC bus tracking and smart route decisions for Bengaluru.' },
    ],
  }),
  component: LiveMapDashboard,
});

function LiveMapDashboard() {
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
