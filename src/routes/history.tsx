import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Clock, Leaf, Calendar } from "lucide-react";
import { tripHistory, userStats } from "../data/mockData";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History — payana.ai" },
      {
        name: "description",
        content: "Your past transit trips, CO₂ savings, and monthly summary.",
      },
      { property: "og:title", content: "History — payana.ai" },
      { property: "og:description", content: "Your past transit trips and CO₂ savings." },
    ],
  }),
  component: HistoryPage,
});

function CrowdBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    low: "badge-green",
    moderate: "badge-amber",
    crowded: "badge-pink",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${styles[level]}`}>
      {level}
    </span>
  );
}

function HistoryPage() {
  const totalCo2 = tripHistory.reduce((sum, t) => sum + t.co2Saved, 0);
  return (
    <>
      <PageShell title="History">
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: Calendar, label: "Trips This Month", value: String(userStats.tripsThisMonth) },
            { icon: Leaf, label: "CO₂ Saved (Recent)", value: `${totalCo2.toFixed(1)}kg` },
            { icon: Clock, label: "Avg Duration", value: "42 min" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel-elevated p-4 text-center"
            >
              <stat.icon size={18} className="mx-auto mb-2 text-indigo" />
              <p className="metric-value text-xl">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
        <div className="glass-panel-elevated overflow-hidden">
          {tripHistory.map((trip, i) => (
            <motion.div
              key={trip.id}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-4 px-5 py-4 border-b border-border last:border-0 hover:bg-surface/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo/10 flex items-center justify-center shrink-0">
                <span className="font-heading font-bold text-indigo text-xs">{trip.route}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{trip.date}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {trip.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Leaf size={11} className="text-hyper-green" />
                    {trip.co2Saved}kg saved
                  </span>
                </div>
              </div>
              <CrowdBadge level={trip.crowdLevel} />
            </motion.div>
          ))}
        </div>
      </PageShell>
    </>
  );
}
