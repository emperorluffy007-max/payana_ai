import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Trophy, MapPin, Leaf } from "lucide-react";
import { leaderboard } from "../data/mockData";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard — payana.ai" },
      { name: "description", content: "Top Bengaluru commuters ranked by CO₂ saved and points." },
      { property: "og:title", content: "Leaderboard — payana.ai" },
      { property: "og:description", content: "Top Bengaluru commuters ranked by CO₂ saved." },
    ],
  }),
  component: LeaderboardPage,
});

const rankIcons: Record<number, string> = { 1: "🏆", 2: "🥈", 3: "🥉" };

function LeaderboardPage() {
  return (
    <>
      <PageShell title="Leaderboard">
        <div className="glass-panel-elevated overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-surface text-xs font-medium text-muted-foreground border-b border-border">
            <div className="col-span-1">Rank</div>
            <div className="col-span-4">Commuter</div>
            <div className="col-span-3">Area</div>
            <div className="col-span-2 text-right">Points</div>
            <div className="col-span-2 text-right">CO₂ Saved</div>
          </div>

          {/* Entries */}
          {leaderboard.map((entry, i) => {
            const isYou = entry.name === "You";
            return (
              <motion.div
                key={entry.rank}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`grid grid-cols-12 gap-4 px-5 py-4 items-center border-b border-border last:border-0 transition-colors ${isYou ? "bg-indigo/5" : "hover:bg-surface/50"}`}
              >
                <div className="col-span-1">
                  <span className="text-lg">{rankIcons[entry.rank] || "⭐"}</span>
                </div>
                <div className="col-span-4">
                  <span className={`text-sm font-medium ${isYou ? "text-indigo font-bold" : ""}`}>
                    {entry.name}
                    {isYou && (
                      <span className="ml-1.5 badge-indigo px-1.5 py-0.5 rounded text-[10px]">
                        You
                      </span>
                    )}
                  </span>
                </div>
                <div className="col-span-3 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin size={12} />
                  {entry.area}
                </div>
                <div className="col-span-2 text-right">
                  <span className="metric-value text-sm">{entry.points.toLocaleString()}</span>
                </div>
                <div className="col-span-2 text-right flex items-center justify-end gap-1">
                  <Leaf size={12} className="text-hyper-green" />
                  <span className="metric-value text-sm">{entry.co2Saved}kg</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </PageShell>
    </>
  );
}
