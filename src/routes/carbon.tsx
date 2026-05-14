import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Leaf, TreePine, Bike, Flame, Award, Clock, Trophy, MapPin } from "lucide-react";
import { userStats, leaderboard } from "../data/mockData";
import { PageShell } from "../components/PageShell";

const rankIcons: Record<number, string> = { 1: "🏆", 2: "🥈", 3: "🥉" };

export const Route = createFileRoute("/carbon")({
  head: () => ({
    meta: [
      { title: "My Impact — payana.ai" },
      {
        name: "description",
        content: "Track your personal CO₂ savings, streaks, and commuter rank.",
      },
      { property: "og:title", content: "My Impact — payana.ai" },
      { property: "og:description", content: "Track your CO₂ savings and commuter rank." },
    ],
  }),
  component: CarbonPage,
});

function calculateTimeSavings(baselineETA: number, payanaETA: number) {
  return payanaETA < baselineETA ? baselineETA - payanaETA : 0;
}

function CarbonPage() {
  const baseline = 100;
  const payana = 15;
  const savedMinutes = calculateTimeSavings(baseline, payana);
  const isSuperSaver = savedMinutes / baseline > 0.2;

  return (
    <>
      <PageShell title="My Impact">
        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            {
              icon: Leaf,
              label: "CO₂ Saved",
              value: `${userStats.co2Saved}kg`,
              color: "text-hyper-green",
            },
            {
              icon: TreePine,
              label: "Trees Equivalent",
              value: String(userStats.treesEquivalent),
              color: "text-hyper-green",
            },
            {
              icon: Bike,
              label: "Trips This Month",
              value: String(userStats.tripsThisMonth),
              color: "text-indigo",
            },
            {
              icon: Flame,
              label: "Day Streak",
              value: String(userStats.streak),
              color: "text-amber",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel-elevated p-4 text-center"
            >
              <stat.icon size={20} className={`mx-auto mb-2 ${stat.color}`} />
              <p className="metric-value text-2xl">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Life-Back Banner */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="glass-panel-elevated p-6 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden"
        >
          {isSuperSaver && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-indigo/40"
                  initial={{ top: "-5%", left: `${Math.random() * 100}%`, opacity: 1 }}
                  animate={{ top: "110%", rotate: 360 }}
                  transition={{
                    duration: Math.random() * 2 + 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: "linear",
                  }}
                />
              ))}
            </div>
          )}

          <div className="absolute -right-8 -top-8 text-indigo/5">
            <Clock size={160} strokeWidth={1} />
          </div>

          <div className="relative z-10 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={18} className="text-[#6366F1]" />
              <h2 className="font-heading font-bold text-lg">Life-Back Summary</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              This week, you reclaimed{" "}
              <span className="font-bold text-foreground">{savedMinutes} minutes</span> compared to
              standard Google Maps baseline. That's enough time to:
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-medium text-foreground">
              <span className="bg-surface border border-border px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
                🍿 Watch a Movie
              </span>
              <span className="bg-surface border border-border px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
                🏋️ Gym Session
              </span>
              <span className="bg-surface border border-border px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
                📞 Call Home
              </span>
            </div>
          </div>
          <div className="relative z-10 flex flex-wrap gap-3 items-center shrink-0">
            <div className="bg-[#6366F1] text-white border border-[#6366F1] px-5 py-4 rounded-xl min-w-[140px] shadow-lg shadow-indigo/30">
              <p className="text-[10px] uppercase font-bold tracking-wider mb-1 opacity-80">
                Time Reclaimed
              </p>
              <div className="flex items-baseline gap-1.5">
                <p className="font-heading text-4xl font-bold">
                  {savedMinutes}
                  <span className="text-lg ml-0.5 font-medium opacity-80">m</span>
                </p>
                {isSuperSaver && (
                  <span className="text-[9px] font-bold uppercase bg-white/20 text-white px-1.5 py-0.5 rounded shadow-sm">
                    Super-Saver!
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Weekly chart */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-panel-elevated p-5"
          >
            <h2 className="font-heading font-bold text-base mb-4">Weekly CO₂ Savings</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={userStats.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#475569" }} />
                <YAxis tick={{ fontSize: 11, fill: "#475569" }} unit="kg" />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", fontSize: 12 }}
                />
                <Bar dataKey="co2" fill="#00FF9D" radius={[6, 6, 0, 0]} name="CO₂ (kg)" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Rank card */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-panel-elevated p-5 flex flex-col items-center justify-center text-center"
          >
            <Award size={48} className="text-amber mb-4" />
            <h2 className="font-heading font-bold text-xl">{userStats.badge}</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Rank #{userStats.rank} in Bengaluru
            </p>
            <div className="mt-4 bg-surface rounded-xl px-6 py-3 border border-border">
              <p className="metric-value text-3xl text-indigo">
                {userStats.points.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Total Points</p>
            </div>
            <div className="mt-4 w-full bg-surface rounded-lg p-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Next rank: Platinum</span>
                <span className="metric-value text-muted-foreground">4820 / 6000</span>
              </div>
              <div className="occupancy-bar">
                <div className="occupancy-fill w-[80%] bg-[#4F46E5]" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Unified Leaderboard Section */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 glass-panel-elevated overflow-hidden mb-6"
        >
          <div className="px-5 py-4 border-b border-border flex items-center gap-2">
            <Trophy size={18} className="text-amber" />
            <h2 className="font-heading font-bold text-base">Bengaluru Navigators Leaderboard</h2>
          </div>
          <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-surface text-xs font-medium text-muted-foreground border-b border-border">
            <div className="col-span-1">Rank</div>
            <div className="col-span-4">Commuter</div>
            <div className="col-span-3">Area</div>
            <div className="col-span-2 text-right">Points</div>
            <div className="col-span-2 text-right">CO₂ Saved</div>
          </div>
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
        </motion.div>
      </PageShell>
    </>
  );
}
