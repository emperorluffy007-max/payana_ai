import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Map,
  Route as RouteIcon,
  BarChart3,
  Leaf,
  ChevronRight,
  Bus,
  Navigation2,
  Clock,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hub — payana.ai" },
      { name: "description", content: "Your central navigation hub for Bengaluru transit." },
    ],
  }),
  component: DashboardHub,
});

const MiniMapPreview = lazy(() => import("../components/MiniMapPreview"));

function MiniBarChart() {
  const bars = [40, 70, 95, 60, 30, 45, 80];
  return (
    <div className="absolute inset-0 top-2 flex items-end justify-between w-full gap-1.5 px-1 pb-1">
      {bars.map((height, i) => (
        <div key={i} className="relative w-full h-full flex items-end justify-center">
          <div className="absolute inset-x-0 bottom-0 top-0 bg-background/30 rounded-t-md mx-0.5 pointer-events-none" />
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${height}%` }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
            className={`w-full rounded-t-md relative z-10 mx-0.5 ${height > 80 ? "bg-destructive" : height > 60 ? "bg-amber" : "bg-indigo"}`}
          />
        </div>
      ))}
    </div>
  );
}

function MiniSparkline() {
  const points = [10, 15, 8, 22, 30, 25, 38];
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  return (
    <div className="w-full h-full flex items-end px-1 pb-1 pt-2">
      <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
        <path
          d={
            `M 0,${40 - ((points[0] - min) / range) * 40} ` +
            points
              .map(
                (p, i) => `L ${(i / (points.length - 1)) * 100},${40 - ((p - min) / range) * 40}`,
              )
              .join(" ")
          }
          fill="none"
          stroke="#6366F1"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function DashboardHub() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate({ to: "/routes", search: { q: searchTerm } });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-16 pb-24 font-body relative overflow-hidden">
      {/* Ambient background orbs */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-[#4F46E5]/10 blur-[100px] rounded-full pointer-events-none mix-blend-screen dark:bg-[#4F46E5]/20" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-[#FF007A]/5 blur-[100px] rounded-full pointer-events-none mix-blend-screen dark:bg-[#FF007A]/10" />
      <div className="absolute bottom-[0%] left-[20%] w-[45%] h-[45%] bg-[#00FF9D]/5 blur-[100px] rounded-full pointer-events-none mix-blend-screen dark:bg-[#00FF9D]/10" />

      <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-8 relative z-10">
        {/* 1. Hero Section */}
        <section className="pt-8 pb-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight text-foreground">
              Good Morning, Shikaj! 👋
              <br />
              <span className="font-medium text-2xl md:text-3xl mt-2 block bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-[#FF007A]">
                Where are you headed today?
              </span>
            </h1>

            <form onSubmit={handleSearch} className="relative max-w-2xl mt-6">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search size={22} className="text-indigo" strokeWidth={2.5} />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Routes, Bus Stops, or Destinations..."
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-card border border-border shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-[#FF007A]/30 focus:border-[#FF007A] transition-all placeholder:text-muted-foreground font-medium text-foreground hover:shadow-md hover:border-[#FF007A]/50"
              />
              <div className="absolute inset-y-0 right-3 flex items-center">
                <button
                  type="submit"
                  className="bg-secondary p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                  title="Search Routes"
                  aria-label="Search Routes"
                >
                  <Navigation2 size={18} />
                </button>
              </div>
            </form>
          </motion.div>
        </section>

        {/* 2. The 'Section Hub' Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Tile 1: Live Transit */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="group flex flex-col glass-panel p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-indigo/10 rounded-xl border border-indigo/20">
                <Map size={24} className="text-indigo" strokeWidth={2} />
              </div>
              <div>
                <h2 className="font-heading font-semibold text-lg text-foreground leading-tight">
                  Live Transit
                </h2>
                <p className="text-sm text-muted-foreground font-medium">Real-time bus tracking</p>
              </div>
            </div>

            <div className="w-full h-[160px] mb-5 relative block">
              {isClient && (
                <Suspense
                  fallback={
                    <div className="w-full h-[160px] rounded-xl border border-border bg-secondary animate-pulse" />
                  }
                >
                  <MiniMapPreview />
                </Suspense>
              )}
            </div>

            <Link
              to="/map"
              className="mt-auto flex items-center justify-center gap-2 w-full py-3 bg-secondary group-hover:bg-indigo/10 text-indigo font-semibold rounded-xl border border-transparent group-hover:border-indigo/20 transition-colors"
            >
              Open Live Tracking <ChevronRight size={16} />
            </Link>
          </motion.div>

          {/* Tile 2: Quick Routes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="group flex flex-col glass-panel p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-[#FF007A]/10 rounded-xl border border-[#FF007A]/20">
                <RouteIcon size={24} className="text-[#FF007A]" strokeWidth={2} />
              </div>
              <div>
                <h2 className="font-heading font-semibold text-lg text-foreground leading-tight">
                  Quick Routes
                </h2>
                <p className="text-sm text-muted-foreground font-medium">Your starred journeys</p>
              </div>
            </div>

            <div className="flex-1 space-y-3 mb-5">
              {[
                { from: "Majestic", to: "Indiranagar", bus: "314E", time: "5 min away" },
                { from: "Koramangala", to: "Silk Board", bus: "G-3", time: "12 min away" },
              ].map((route, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between p-3 rounded-xl border border-border bg-secondary hover:shadow-sm transition-colors cursor-pointer ${route.bus === "314E" ? "hover:border-indigo/40 hover:bg-indigo/5" : "hover:border-emerald-500/40 hover:bg-emerald-500/5"}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`text-xs font-bold px-2.5 py-1 rounded-md min-w-[45px] text-center shadow-sm text-white ${route.bus === "314E" ? "bg-[#4F46E5] shadow-indigo/20" : "bg-[#10B981] shadow-emerald-500/20"}`}
                    >
                      {route.bus}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {route.from} <span className="text-muted-foreground px-1">→</span>{" "}
                        {route.to}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-md ${route.bus === "314E" ? "text-indigo bg-indigo/10" : "text-emerald-600 bg-emerald-500/10"}`}
                  >
                    {route.time}
                  </span>
                </div>
              ))}
            </div>

            <Link
              to="/routes"
              search={{ q: "" }}
              className="mt-auto flex items-center justify-center gap-2 w-full py-3 bg-secondary group-hover:bg-[#FF007A]/10 text-foreground group-hover:text-[#FF007A] font-semibold rounded-xl border border-transparent group-hover:border-[#FF007A]/20 transition-colors"
            >
              View All Routes <ChevronRight size={16} />
            </Link>
          </motion.div>

          {/* Tile 3: Peak Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="group flex flex-col glass-panel p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-amber/10 rounded-xl border border-amber/20">
                <BarChart3 size={24} className="text-amber" strokeWidth={2} />
              </div>
              <div>
                <h2 className="font-heading font-semibold text-lg text-foreground leading-tight">
                  Peak Insights
                </h2>
                <p className="text-sm text-muted-foreground font-medium">Current traffic trends</p>
              </div>
            </div>

            <div className="flex-1 min-h-[140px] flex flex-col bg-secondary rounded-xl border border-border mb-5 pt-4 px-4 pb-2 relative overflow-hidden">
              <div className="flex flex-col mb-1 z-10 relative">
                <span className="font-heading text-xl font-bold text-foreground leading-none mb-1">
                  High
                </span>
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  Congestion Level
                </span>
              </div>
              <div className="flex-1 w-full relative z-0 mt-2">
                <MiniBarChart />
              </div>
            </div>

            <Link
              to="/insights"
              className="mt-auto flex items-center justify-center gap-2 w-full py-3 bg-secondary group-hover:bg-amber/10 text-foreground group-hover:text-amber font-semibold rounded-xl border border-transparent group-hover:border-amber/20 transition-colors"
            >
              Check Peak Hours <ChevronRight size={16} />
            </Link>
          </motion.div>

          {/* Tile 4: Commute ROI */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="group flex flex-col glass-panel p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <Leaf size={24} className="text-emerald-500" strokeWidth={2} />
              </div>
              <div>
                <h2 className="font-heading font-semibold text-lg text-foreground leading-tight">
                  Time Reclaimed
                </h2>
                <p className="text-sm text-muted-foreground font-medium">Commute ROI</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center mb-5 bg-secondary border border-border rounded-xl p-4 relative overflow-hidden">
              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-heading text-4xl font-semibold text-indigo tracking-tighter">
                  85
                </span>
                <span className="text-sm font-medium text-muted-foreground">min saved</span>
              </div>
              <p className="text-[10px] text-muted-foreground font-medium leading-tight mb-3">
                Compared to Google Maps baseline
              </p>

              <div className="h-10 w-full mt-auto">
                <MiniSparkline />
              </div>
            </div>

            <Link
              to="/carbon"
              className="mt-auto flex items-center justify-center gap-2 w-full py-3 bg-secondary group-hover:bg-emerald-500/10 text-foreground group-hover:text-emerald-500 font-semibold rounded-xl border border-transparent group-hover:border-emerald-500/20 transition-colors"
            >
              View Time-Value Analytics <ChevronRight size={16} />
            </Link>
          </motion.div>
        </section>
      </div>

      {/* 3. Current Context Bar (Floating Bottom) */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md glass-panel-elevated rounded-2xl p-4 flex items-center justify-between z-50"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="p-2.5 bg-indigo/10 rounded-full border border-indigo/20">
              <Bus size={20} className="text-indigo" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-hyper-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-hyper-green border border-card"></span>
            </span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Next Best Bus • 200m away</p>
            <p className="text-sm font-bold text-foreground mt-0.5">
              500D to Silk Board <span className="text-indigo px-1">•</span> 3 min
            </p>
          </div>
        </div>
        <button className="bg-indigo hover:opacity-90 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-opacity shadow-sm shadow-indigo/30">
          Catch
        </button>
      </motion.div>
    </div>
  );
}
