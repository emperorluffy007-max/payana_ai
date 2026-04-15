import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Clock, Bus, Users, ChevronDown, ChevronUp, Navigation, ArrowRight } from 'lucide-react';
import { initialBuses, moveBus, transferRoutes, type Bus as BusType } from '../data/mockData';

function CrowdBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    low: 'badge-green',
    moderate: 'badge-amber',
    crowded: 'badge-pink',
    full: 'badge-red',
  };
  const labels: Record<string, string> = {
    low: 'Seats Free',
    moderate: 'Moderate',
    crowded: 'Crowded',
    full: 'Standing Only',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[level]}`}>
      {labels[level]}
    </span>
  );
}

function OccupancyBar({ value }: { value: number }) {
  const color = value < 40 ? '#00FF9D' : value < 70 ? '#FACC15' : '#FF007A';
  return (
    <div className="occupancy-bar w-full">
      <div className="occupancy-fill" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

function BusCard({ bus, isExpanded, onToggle }: { bus: BusType; isExpanded: boolean; onToggle: () => void }) {
  return (
    <motion.div
      layout
      className={`p-3 rounded-xl border transition-colors ${bus.isBestRoute ? 'border-hyper-green/40 bg-hyper-green/5' : 'border-border bg-card'}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-sm">{bus.route}</span>
            {bus.isBestRoute && (
              <span className="badge-green px-2 py-0.5 rounded-full text-[10px] font-bold">Best Route</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{bus.routeName}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="flex items-center gap-1 text-foreground">
            <Clock size={12} />
            <span className="metric-value text-lg">{bus.eta}<span className="text-xs text-muted-foreground ml-0.5">min</span></span>
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <OccupancyBar value={bus.occupancy} />
        <span className="metric-value text-xs text-muted-foreground shrink-0">{bus.occupancy}%</span>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CrowdBadge level={bus.crowdLevel} />
          {bus.delay > 0 && (
            <span className="badge-amber px-2 py-0.5 rounded-full text-[10px] font-medium">+{bus.delay}m delay</span>
          )}
        </div>
        <button onClick={onToggle} className="text-muted-foreground hover:text-foreground p-1">
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {isExpanded && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Stops:</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {bus.stops.map((stop, i) => (
              <span key={i} className="flex items-center gap-1 text-xs">
                <span className="badge-indigo px-2 py-0.5 rounded-full">{stop}</span>
                {i < bus.stops.length - 1 && <ArrowRight size={10} className="text-muted-foreground" />}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Next bus: <span className="metric-value">{bus.nextBusEta}m</span></span>
            <button className="flex items-center gap-1 bg-indigo text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-indigo/90 transition-colors">
              <Navigation size={12} />
              Navigate to Stop
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export function DecisionPanel() {
  const [buses, setBuses] = useState(initialBuses);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const tick = useCallback(() => {
    setBuses(prev => prev.map(moveBus));
  }, []);

  useEffect(() => {
    const interval = setInterval(tick, 2000);
    return () => clearInterval(interval);
  }, [tick]);

  const catchable = buses.filter(b => b.eta <= 5).length;
  const bestEta = Math.min(...buses.map(b => b.eta));
  const sorted = [...buses].sort((a, b) => {
    if (a.isBestRoute) return -1;
    if (b.isBestRoute) return 1;
    return a.eta - b.eta;
  });

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-[380px] max-h-[calc(100vh-5rem)] flex flex-col glass-panel-elevated overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-border shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="font-heading font-bold text-lg">Decision Engine</h2>
          <span className="w-2 h-2 rounded-full bg-hyper-green pulse-green" />
          <span className="text-xs text-muted-foreground ml-auto">{catchable}/{buses.length} catchable</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-surface rounded-lg p-2 text-center">
            <p className="metric-value text-lg text-hyper-green">{bestEta}m</p>
            <p className="text-[10px] text-muted-foreground">Best ETA</p>
          </div>
          <div className="bg-surface rounded-lg p-2 text-center">
            <p className="metric-value text-lg text-indigo">{buses.length}</p>
            <p className="text-[10px] text-muted-foreground">Buses Live</p>
          </div>
          <div className="bg-surface rounded-lg p-2 text-center">
            <p className="metric-value text-lg text-foreground">{catchable}</p>
            <p className="text-[10px] text-muted-foreground">Catchable</p>
          </div>
        </div>
      </div>

      {/* Bus list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {sorted.map(bus => (
          <BusCard
            key={bus.id}
            bus={bus}
            isExpanded={expandedId === bus.id}
            onToggle={() => setExpandedId(expandedId === bus.id ? null : bus.id)}
          />
        ))}
      </div>

      {/* Transfer routes */}
      <div className="p-3 border-t border-border shrink-0">
        <p className="text-xs font-medium text-muted-foreground mb-2">Multi-Route Transfers</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {transferRoutes.map(tr => (
            <div key={tr.id} className="shrink-0 bg-surface rounded-lg p-2.5 min-w-[160px] border border-border">
              <p className="text-xs font-medium truncate">{tr.from} → {tr.to}</p>
              <div className="flex items-center gap-1 mt-1">
                {tr.routes.map((r, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <span className="badge-indigo px-1.5 py-0.5 rounded text-[10px]">{r}</span>
                    {i < tr.routes.length - 1 && <ArrowRight size={8} className="text-muted-foreground" />}
                  </span>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                {tr.transfers} transfer · Saves {tr.timeSaved}m
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
