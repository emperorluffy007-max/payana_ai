import {
  MapPin,
  Navigation,
  Bus,
  Train,
  Leaf,
  ArrowRight,
  User,
  Activity,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Map,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";

export function JourneyPanel({
  from,
  to,
  mode,
  isNavigating,
  setIsNavigating,
  hasMissed,
  onResetMissed,
  onSelectAlternative,
}: {
  from: string;
  to: string;
  mode?: string;
  isNavigating: boolean;
  setIsNavigating: (v: boolean) => void;
  hasMissed?: boolean;
  onResetMissed?: () => void;
  onSelectAlternative?: (variant: "default" | "metro") => void;
}) {
  const [activeCheckpoint, setActiveCheckpoint] = useState<number | null>(null);
  const [showMissedBus, setShowMissedBus] = useState(false);

  // If we missed the bus, we automatically show the alternatives
  useEffect(() => {
    if (hasMissed) setShowMissedBus(true);
    if (!hasMissed) setShowMissedBus(false);
  }, [hasMissed]);

  const toggleCheckpoint = (num: number) => {
    setActiveCheckpoint(activeCheckpoint === num ? null : num);
  };
  return (
    <div className="w-[320px] bg-card/80 backdrop-blur-xl border border-border rounded-3xl shadow-xl flex flex-col pointer-events-auto h-full max-h-[85vh] overflow-hidden">
      {/* Header */}
      <div
        className={`p-5 border-b border-white/5 relative shrink-0 transition-colors duration-300 ${isNavigating ? "bg-[#4F46E5]/10" : "bg-transparent"}`}
      >
        <Link
          to="/plan"
          className="absolute top-5 right-5 text-indigo text-xs font-semibold uppercase tracking-wider hover:underline"
        >
          Cancel
        </Link>
        <h3 className="font-heading font-medium text-lg mb-1">
          {isNavigating ? "Navigating..." : "Active Journey"}
        </h3>
        <p className="text-sm text-white/50">
          {isNavigating ? "Turn-by-turn guidance active" : "Tracking live progress"}
        </p>
      </div>

      {/* Locations */}
      <div className="p-5 flex-1 overflow-y-auto">
        {!isNavigating ? (
          <div className="relative isolate mb-8">
            <div className="absolute left-[11px] top-[14px] bottom-[14px] w-0.5 bg-white/10 -z-10"></div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-6 flex justify-center shrink-0">
                  <div className="w-3 h-3 rounded-full border-[2px] bg-card border-indigo z-10"></div>
                </div>
                <div>
                  <p className="text-xs text-indigo mb-0.5 font-medium uppercase tracking-widest">
                    Start
                  </p>
                  <p className="text-sm font-medium">{from}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 flex justify-center shrink-0">
                  <MapPin
                    size={16}
                    strokeWidth={2.5}
                    className="text-destructive fill-destructive/20 z-10 bg-card rounded-sm"
                  />
                </div>
                <div>
                  <p className="text-xs text-destructive mb-0.5 font-medium uppercase tracking-widest">
                    Destination
                  </p>
                  <p className="text-sm font-medium">{to}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative isolate mb-6 bg-surface/50 p-4 rounded-xl border border-border">
            <div className="absolute left-[27px] top-[30px] bottom-[30px] w-0.5 bg-white/10 -z-10"></div>
            <div className="space-y-5">
              {/* Checkpoint 1: Bus Location */}
              <div
                className="flex items-start gap-3 cursor-pointer group"
                onClick={() => toggleCheckpoint(1)}
              >
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 border border-amber-500/40 z-10 transition-transform group-hover:scale-110">
                  <Bus size={14} className="text-amber-500" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-amber-500 mb-0.5 font-bold uppercase tracking-widest transition-colors group-hover:text-amber-400">
                    Live Bus Location
                  </p>
                  <p className="text-sm font-medium">Approaching Trinity Metro Stn.</p>
                  {activeCheckpoint === 1 && (
                    <div className="mt-2 text-xs text-white/70 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20 animate-in fade-in slide-in-from-top-2">
                      <p>
                        <strong>Status:</strong> On Time (ETA 5 mins)
                      </p>
                      <p>
                        <strong>Crowd:</strong> Lightly crowded 🟢
                      </p>
                      <p>
                        <strong>Vehicle:</strong> KA-01-F-1234 (Electric)
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {/* Checkpoint 2: Your walk */}
              <div
                className="flex items-start gap-3 cursor-pointer group"
                onClick={() => toggleCheckpoint(2)}
              >
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0 border border-cyan-500/40 z-10 transition-transform group-hover:scale-110">
                  <User size={14} className="text-cyan-400" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-cyan-400 mb-0.5 font-bold uppercase tracking-widest transition-colors group-hover:text-cyan-300">
                    Walking Distance
                  </p>
                  <p className="text-sm font-medium">400m to Pickup Point</p>
                  {activeCheckpoint === 2 && (
                    <div className="mt-2 text-xs text-white/70 bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20 animate-in fade-in slide-in-from-top-2">
                      <p>
                        <strong>Estimated Walk:</strong> 4 mins
                      </p>
                      <p>Head north on 100ft road. The bus stop is opposite the main bakery.</p>
                    </div>
                  )}
                </div>
              </div>
              {/* Checkpoint 3: Journey Distance */}
              <div
                className="flex items-start gap-3 cursor-pointer group"
                onClick={() => toggleCheckpoint(3)}
              >
                <div className="w-8 h-8 rounded-full bg-indigo/20 flex items-center justify-center shrink-0 border border-indigo/40 z-10 transition-transform group-hover:scale-110">
                  <ShieldCheck size={14} className="text-indigo" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-indigo mb-0.5 font-bold uppercase tracking-widest transition-colors group-hover:text-indigo-400">
                    Remaining Journey
                  </p>
                  <p className="text-sm font-medium">8.5 km to {to}</p>
                  {activeCheckpoint === 3 && (
                    <div className="mt-2 text-xs text-white/70 bg-indigo/10 p-2 rounded-lg border border-indigo/20 animate-in fade-in slide-in-from-top-2">
                      <p>
                        <strong>Overall ETA:</strong> 11:30 AM
                      </p>
                      <p>
                        <strong>Traffic:</strong> Moderate at Silk Board Junction 🟠
                      </p>
                      <p>
                        <strong>Saved:</strong> 1.2kg CO2 vs driving.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status / ETA */}
        <div className="border border-indigo/20 bg-indigo/5 rounded-2xl p-4 mb-4">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-indigo tracking-wider uppercase">
              {mode || "Journey"} Mode
            </span>
            <span className="text-xs bg-hyper-green/20 text-hyper-green px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
              <Leaf size={10} /> Eco-friendly
            </span>
          </div>
          <div className="text-2xl font-bold font-heading mb-1 text-white">
            45 min{" "}
            <span className="text-sm font-normal text-white/50 inline-block ml-1">remaining</span>
          </div>
          <div className="flex items-center gap-2 mt-4 text-sm font-medium">
            <Bus size={14} className="text-white/70" />
            <span>BMTC 500-D</span>
            <ArrowRight size={14} className="text-white/40" />
            <Train size={14} className="text-purple-400" />
            <span className="text-purple-400">Purple Line</span>
          </div>
        </div>

        {/* Active Instructions (When Navigating) */}
        {isNavigating && (
          <div className="mt-4 mb-2 p-4 bg-hyper-green/10 border border-hyper-green/30 rounded-xl">
            <p className="text-[10px] text-hyper-green uppercase tracking-widest font-bold mb-1.5 flex items-center gap-1.5">
              <Activity size={12} /> Action Required
            </p>
            <p className="text-sm font-medium">
              Head north on 100ft Road and walk 400m to the nearest Metro Station.
            </p>
          </div>
        )}

        {/* Missed Bus Alert */}
        {hasMissed && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive/30 rounded-xl animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={18} className="text-destructive" />
              <span className="font-bold text-destructive uppercase tracking-widest text-xs">
                Bus Missed!
              </span>
            </div>
            <p className="text-sm text-white/80 leading-snug">
              {to?.toLowerCase().includes("electronic city")
                ? "The Express bus to Electronic City has already passed. Please check the recalculated routes below."
                : "The BMTC 500-D has already passed the stop. Select an alternative route below."}
            </p>
          </div>
        )}

        {/* Start / End Navigation */}
        {!hasMissed ? (
          <button
            onClick={() => setIsNavigating(!isNavigating)}
            className={`w-full text-white font-semibold rounded-xl py-3 transition-colors flex items-center justify-center gap-2 mt-4 ${
              isNavigating
                ? "bg-destructive/80 hover:bg-destructive shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                : "bg-indigo hover:bg-indigo/90 shadow-[0_0_15px_rgba(79,70,229,0.3)]"
            }`}
          >
            {isNavigating ? (
              <>End Navigation</>
            ) : (
              <>
                <Navigation size={16} /> Start Navigation
              </>
            )}
          </button>
        ) : (
          <div className="space-y-3 mt-4">
            <button
              onClick={() => {
                onResetMissed?.();
                setIsNavigating(true);
              }}
              className="w-full bg-indigo text-white font-semibold rounded-xl py-3 hover:bg-indigo/90 transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)] flex items-center justify-center gap-2"
            >
              <Clock size={16} /> Wait for Next Bus (12m)
            </button>

            {/* Additional Route 1 */}
            <button
              onClick={() => onSelectAlternative?.("metro")}
              className="w-full bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 font-semibold rounded-xl py-3 hover:bg-emerald-600/30 transition-colors flex flex-col items-center justify-center px-4"
            >
              <div className="flex items-center gap-2">
                <Train size={16} />
                <span>Quick Metro Transfer</span>
              </div>
              <span className="text-[10px] opacity-70 font-normal">
                Walk 5m to Nagavara Metro · Save 8m
              </span>
            </button>

            {/* Additional Route 2 */}
            <button
              onClick={() => onSelectAlternative?.("default")}
              className="w-full bg-amber-600/20 text-amber-400 border border-amber-600/30 font-semibold rounded-xl py-3 hover:bg-amber-600/30 transition-colors flex flex-col items-center justify-center px-4"
            >
              <div className="flex items-center gap-2">
                <Bus size={16} />
                <span>Direct Bus 401A (Arriving)</span>
              </div>
              <span className="text-[10px] opacity-70 font-normal">
                Alternative stop 200m away · Departs 2m
              </span>
            </button>

            <Link
              to="/plan"
              className="w-full bg-white/10 text-white font-semibold rounded-xl py-3 hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
            >
              <Map size={16} /> Search New Routes
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
