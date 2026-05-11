import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Navigation,
  ArrowRight,
  Train,
  Bus,
  Activity,
  IndianRupee,
  Leaf,
} from "lucide-react";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/plan")({
  head: () => ({
    meta: [
      { title: "Journey Planner — payana.ai" },
      {
        name: "description",
        content: "Plan multi-modal routes across Bengaluru to reduce travel time.",
      },
    ],
  }),
  component: PlanPage,
});

const PLACES = [
  "Majestic", "Electronic City", "Indiranagar", "Hebbal", "Shivajinagar", 
  "Koramangala", "Silk Board", "MG Road", "Whitefield", "HKBK College", 
  "Manyata Tech Park", "Nagavara Junction", "Jayanagar", "BTM Layout", 
  "Marathahalli", "Yelahanka", "Malleshwaram", "Domlur"
];

function AutocompleteInput({ 
  value, 
  onChange, 
  placeholder, 
  icon 
}: { 
  value: string; 
  onChange: (v: string) => void; 
  placeholder: string;
  icon: React.ReactNode;
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions = PLACES.filter(p => 
    p.toLowerCase().includes(value.toLowerCase()) && 
    value.length > 0 &&
    p.toLowerCase() !== value.toLowerCase()
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      setActiveIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      setActiveIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      onChange(suggestions[activeIndex]);
      setShowSuggestions(false);
      setActiveIndex(-1);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative flex-1 group" ref={containerRef}>
      <div className="flex items-center">
        <div className="w-8 flex justify-center shrink-0">
          {icon}
        </div>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onFocus={() => {
            setShowSuggestions(true);
            setActiveIndex(-1);
          }}
          onChange={(e) => {
            onChange(e.target.value);
            setShowSuggestions(true);
            setActiveIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-surface border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo/50 outline-none transition-all group-hover:border-indigo/30"
        />
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute left-8 right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1">
          {suggestions.map((p, index) => (
            <button
              key={p}
              type="button"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseDown={(e) => {
                e.preventDefault(); // Prevent input onBlur from firing before onClick/onMouseDown
                onChange(p);
                setShowSuggestions(false);
                setActiveIndex(-1);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                index === activeIndex ? "bg-indigo text-white" : "hover:bg-indigo/10 hover:text-indigo"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function PlanPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [showResults, setShowResults] = useState(false);

  const handlePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (from.trim() && to.trim()) {
      setShowResults(true);
    }
  };

  return (
    <PageShell title="Journey Planner">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Search Form */}
        <div className="lg:col-span-1 border border-border bg-card rounded-2xl p-5 shadow-sm h-fit glass-panel-elevated">
          <form onSubmit={handlePlan} className="space-y-4">
            <h2 className="font-heading font-semibold mb-4 text-base">Where to?</h2>
            <div className="relative isolate">
              {/* Timeline graphic */}
              <div className="absolute left-[15px] top-[18px] bottom-[18px] w-0.5 bg-border -z-10"></div>

              <div className="space-y-3">
                <AutocompleteInput 
                  value={from} 
                  onChange={(v) => { setFrom(v); setShowResults(false); }} 
                  placeholder="Starting point"
                  icon={<div className="w-3 h-3 rounded-full border-[3px] bg-background border-indigo"></div>}
                />

                <AutocompleteInput 
                  value={to} 
                  onChange={(v) => { setTo(v); setShowResults(false); }} 
                  placeholder="Destination"
                  icon={<MapPin size={16} strokeWidth={2.5} className="text-destructive fill-destructive/20" />}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!from.trim() || !to.trim()}
              className="mt-6 w-full bg-indigo text-primary-foreground font-medium rounded-xl py-3 hover:bg-indigo/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Find Best Route
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          {!showResults ? (
            <div className="h-64 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-2xl bg-surface/50">
              <Navigation size={40} className="mb-4 opacity-30" strokeWidth={1.5} />
              <p className="font-medium">Enter your locations to see optimized routes.</p>
              <p className="text-xs mt-1 opacity-70">Combining Metro, BMTC, and KSRTC</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="font-heading font-medium text-lg mb-2 flex items-center gap-2">
                Optimized Multi-Modal Routes
              </h2>

              {/* Option 1: Fastest */}
              <Link to="/map" search={{ from, to, mode: 'fastest' }} className="block">
              <motion.div
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                className="border border-indigo/30 bg-indigo/5 rounded-2xl p-5 shadow-sm relative overflow-hidden transition-all cursor-pointer hover:shadow-md hover:border-indigo/50"
              >
                <div className="absolute top-0 right-5 bg-indigo text-white text-[10px] font-bold px-3 py-1 rounded-b-md tracking-wider">
                  FASTEST
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 mt-2 gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-3xl font-bold font-heading text-indigo">38 min</span>
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">
                      10:15 AM — 10:53 AM
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-medium bg-card px-3 py-2 rounded-lg border border-border">
                    <span className="flex items-center gap-1.5">
                      <IndianRupee size={14} className="text-muted-foreground" />
                      45
                    </span>
                    <div className="w-[1px] h-4 bg-border"></div>
                    <span className="flex items-center gap-1.5 text-hyper-green">
                      <Leaf size={14} />
                      -1.2kg CO₂
                    </span>
                  </div>
                </div>

                {/* Visual Timeline */}
                <div className="flex flex-wrap items-center gap-2 text-sm font-medium mt-2">
                  <div className="px-2.5 py-1.5 bg-surface border border-border rounded-lg flex items-center gap-1.5 shadow-sm">
                    <Activity size={14} className="text-slate-500" /> Walk 5m
                  </div>
                  <ArrowRight size={14} className="text-muted-foreground shrink-0" />
                  <div className="px-2.5 py-1.5 bg-purple-500/10 text-purple-700 border border-purple-200 rounded-lg flex items-center gap-1.5 shadow-sm">
                    <Train size={14} /> Purple Line
                  </div>
                  <ArrowRight size={14} className="text-muted-foreground shrink-0" />
                  <div className="px-2.5 py-1.5 bg-emerald-500/10 text-emerald-700 border border-emerald-200 rounded-lg flex items-center gap-1.5 shadow-sm">
                    <Bus size={14} /> BMTC 500-D (EV)
                  </div>
                </div>
              </motion.div>
              </Link>

              {/* Option 2: Direct */}
              <Link to="/map" search={{ from, to, mode: 'simplified' }} className="block">
              <motion.div
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="border border-border bg-card rounded-2xl p-5 shadow-sm relative transition-all cursor-pointer hover:shadow-md hover:border-slate-300"
              >
                <div className="absolute top-0 right-5 bg-slate-100 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-b-md tracking-wider border border-border border-t-0">
                  SIMPLIFIED
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 mt-2 gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-3xl font-bold font-heading">55 min</span>
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">
                      10:18 AM — 11:13 AM
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-medium bg-surface px-3 py-2 rounded-lg border border-border">
                    <span className="flex items-center gap-1.5">
                      <IndianRupee size={14} className="text-muted-foreground" />
                      25
                    </span>
                    <div className="w-[1px] h-4 bg-border"></div>
                    <span className="flex items-center gap-1.5 text-hyper-green">
                      <Leaf size={14} />
                      -0.8kg CO₂
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-sm font-medium mt-2">
                  <div className="px-2.5 py-1.5 bg-blue-500/10 text-blue-700 border border-blue-200 rounded-lg flex items-center gap-1.5 shadow-sm">
                    <Bus size={14} /> BMTC 335-E
                  </div>
                </div>
              </motion.div>
              </Link>

              {/* Option 3: Cheapest */}
              <Link to="/map" search={{ from, to, mode: 'cheapest' }} className="block">
              <motion.div
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
                className="border border-border bg-card rounded-2xl p-5 shadow-sm relative transition-all cursor-pointer hover:shadow-md hover:border-amber-300"
              >
                <div className="absolute top-0 right-5 bg-amber-100 text-amber-700 text-[10px] font-bold px-3 py-1 rounded-b-md tracking-wider border border-amber-200 border-t-0">
                  CHEAPEST
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 mt-2 gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-3xl font-bold font-heading">65 min</span>
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">
                      10:25 AM — 11:30 AM
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-medium bg-surface px-3 py-2 rounded-lg border border-border">
                    <span className="flex items-center gap-1.5 text-amber-600">
                      <IndianRupee size={14} />
                      15
                    </span>
                    <div className="w-[1px] h-4 bg-border"></div>
                    <span className="flex items-center gap-1.5 text-hyper-green">
                      <Leaf size={14} />
                      -0.5kg CO₂
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-sm font-medium mt-2">
                  <div className="px-2.5 py-1.5 bg-indigo/10 text-indigo border border-indigo/20 rounded-lg flex items-center gap-1.5 shadow-sm">
                    <Bus size={14} /> BMTC Ordinary
                  </div>
                  <ArrowRight size={14} className="text-muted-foreground shrink-0" />
                  <div className="px-2.5 py-1.5 bg-rose-500/10 text-rose-700 border border-rose-200 rounded-lg flex items-center gap-1.5 shadow-sm">
                    <Bus size={14} /> KSRTC Express
                  </div>
                </div>
              </motion.div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
