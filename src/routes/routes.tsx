import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Clock, Users, ArrowRight } from "lucide-react";
import { allRoutes } from "../data/mockData";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/routes")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      q: typeof search.q === "string" ? search.q : "",
    };
  },
  head: () => ({
    meta: [
      { title: "Routes — payana.ai" },
      {
        name: "description",
        content: "Browse all BMTC bus routes in Bengaluru with crowd levels and frequencies.",
      },
      { property: "og:title", content: "Routes — payana.ai" },
      { property: "og:description", content: "Browse all BMTC bus routes in Bengaluru." },
    ],
  }),
  component: RoutesPage,
});

const areas = [
  "All",
  "Majestic",
  "Indiranagar",
  "Koramangala",
  "Hebbal",
  "Jayanagar",
  "Whitefield",
  "Electronic City",
  "Malleshwaram",
  "Yelahanka",
  "Banashankari",
  "Marathahalli",
  "BTM Layout",
];

function CrowdBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    low: "badge-green",
    moderate: "badge-amber",
    crowded: "badge-pink",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[level] || "badge-amber"}`}
    >
      {level}
    </span>
  );
}

function RoutesPage() {
  const { q } = Route.useSearch();
  const [search, setSearch] = useState(q || "");
  const [area, setArea] = useState("All");

  useEffect(() => {
    if (q) setSearch(q);
  }, [q]);

  const filtered = allRoutes.filter((r) => {
    const matchSearch =
      r.route.toLowerCase().includes(search.toLowerCase()) ||
      r.from.toLowerCase().includes(search.toLowerCase()) ||
      r.to.toLowerCase().includes(search.toLowerCase());
    const matchArea = area === "All" || r.area === area;
    return matchSearch && matchArea;
  });

  return (
    <>
      <PageShell title="Routes">
        {/* Search */}
        <div className="glass-panel-elevated p-4 mb-4">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search routes, stops..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-surface border border-border text-sm focus:outline-none focus:ring-2 focus:ring-indigo/30"
            />
          </div>
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {areas.map((a) => (
              <button
                key={a}
                onClick={() => setArea(a)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${a === area ? "bg-indigo text-primary-foreground" : "bg-surface text-muted-foreground hover:bg-border"}`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Route cards */}
        <div className="grid gap-3">
          {filtered.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel-elevated p-4 flex items-center gap-4"
            >
              <div className="w-16 h-16 rounded-xl bg-indigo/10 flex items-center justify-center shrink-0">
                <span className="font-heading font-bold text-indigo text-sm">{r.route}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-sm font-medium">
                  <span>{r.from}</span>
                  <ArrowRight size={12} className="text-muted-foreground" />
                  <span>{r.to}</span>
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {r.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={12} />
                    Every {r.frequency}
                  </span>
                </div>
              </div>
              <CrowdBadge level={r.crowdLevel} />
            </motion.div>
          ))}
        </div>
      </PageShell>
    </>
  );
}
