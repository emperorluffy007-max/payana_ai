import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
} from "recharts";
import { TrendingUp, Clock, Bus, Train, MapPin } from "lucide-react";
import { peakData, initialBuses, initialMetroTrains } from "../data/mockData";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Peak Insights — payana.ai" },
      {
        name: "description",
        content: "Crowd analytics, delay trends, and best travel times for Bengaluru transit.",
      },
      { property: "og:title", content: "Peak Insights — payana.ai" },
      {
        property: "og:description",
        content: "Crowd analytics and delay trends for Bengaluru transit.",
      },
    ],
  }),
  component: InsightsPage,
});

function InsightsPage() {
  const [selectedDay, setSelectedDay] = useState<
    "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun"
  >("mon");

  return (
    <>
      <PageShell title="Peak Insights">
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Hourly crowd heatmap */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass-panel-elevated p-5 lg:col-span-2"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-indigo" />
                <h2 className="font-heading font-bold text-base">Hourly Crowd Levels</h2>
              </div>
              <select
                value={selectedDay}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(e) => setSelectedDay(e.target.value as any)}
                className="bg-card border border-border text-foreground text-sm rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo/50"
              >
                <option value="mon">Monday</option>
                <option value="tue">Tuesday</option>
                <option value="wed">Wednesday</option>
                <option value="thu">Thursday</option>
                <option value="fri">Friday</option>
                <option value="sat">Saturday</option>
                <option value="sun">Sunday</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={peakData.hourlyHeatmap}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis
                  dataKey="hour"
                  tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                />
                <YAxis tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    backgroundColor: "var(--color-card)",
                    borderColor: "var(--color-border)",
                    color: "var(--color-foreground)",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey={selectedDay} radius={[4, 4, 0, 0]} name="Crowd %">
                  {peakData.hourlyHeatmap.map((entry, index) => {
                    const val = entry[selectedDay] as number;
                    const fill =
                      val > 80
                        ? "var(--color-destructive)"
                        : val > 60
                          ? "var(--color-amber)"
                          : "var(--color-indigo)";
                    return <Cell key={`cell-${index}`} fill={fill} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Delay trends */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-panel-elevated p-5 lg:col-span-2"
          >
            <div className="flex items-center gap-2 mb-4">
              <Clock size={16} className="text-amber" />
              <h2 className="font-heading font-bold text-base">Average Delay Trends</h2>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={peakData.delayTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#475569" }} />
                <YAxis tick={{ fontSize: 11, fill: "#475569" }} unit="m" />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", fontSize: 12 }}
                />
                <Line
                  type="monotone"
                  dataKey="avg"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Avg Delay"
                />
                <Line
                  type="monotone"
                  dataKey="peak"
                  stroke="#FF007A"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Peak Delay"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Best/worst times */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-panel-elevated p-5 lg:col-span-2"
          >
            <h2 className="font-heading font-bold text-base mb-4">Best &amp; Worst Travel Times</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                {
                  label: "Best Morning",
                  time: "6:00 - 7:00 AM",
                  crowd: "Low",
                  style: "badge-green",
                },
                {
                  label: "Worst Morning",
                  time: "8:30 - 9:30 AM",
                  crowd: "Peak",
                  style: "badge-red",
                },
                {
                  label: "Best Evening",
                  time: "3:00 - 4:00 PM",
                  crowd: "Low",
                  style: "badge-green",
                },
                {
                  label: "Worst Evening",
                  time: "5:30 - 6:30 PM",
                  crowd: "Peak",
                  style: "badge-red",
                },
              ].map((item) => (
                <div key={item.label} className="bg-surface rounded-xl p-3 border border-border">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="metric-value text-sm mt-1">{item.time}</p>
                  <span
                    className={`${item.style} px-2 py-0.5 rounded-full text-[10px] font-medium mt-2 inline-block`}
                  >
                    {item.crowd}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Nearby Transit Availability */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="glass-panel-elevated p-5 lg:col-span-2 mb-4"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-hyper-green" />
                <h2 className="font-heading font-bold text-base">Nearby Transit Availability</h2>
              </div>
              <span className="text-xs font-semibold text-muted-foreground bg-secondary px-2 py-1 rounded-md border border-border">
                Peak Hour View
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Bus size={14} className="text-indigo" /> BMTC Buses Nearby
                </h3>
                <div className="space-y-2.5">
                  {initialBuses.slice(0, 3).map((bus) => (
                    <div
                      key={bus.id}
                      className="flex flex-col bg-surface/50 border border-border rounded-xl p-3 hover:border-indigo/30 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="bg-indigo text-white text-xs font-bold px-2 py-0.5 rounded-md shadow-sm">
                            {bus.route}
                          </span>
                          <span className="text-sm font-semibold text-foreground truncate max-w-[120px]">
                            {bus.routeName}
                          </span>
                        </div>
                        <span className="text-xs font-bold bg-secondary border border-border px-2 py-0.5 rounded-md text-foreground">
                          {(Math.random() * 4 + 0.2).toFixed(1)} km
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground">Live Crowd:</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${bus.crowdLevel === "full" ? "bg-destructive/10 text-destructive border border-destructive/20" : bus.crowdLevel === "crowded" ? "bg-amber/10 text-amber border border-amber/20" : "bg-hyper-green/10 text-emerald-600 border border-hyper-green/20"}`}
                        >
                          {bus.crowdLevel === "full"
                            ? "Severe Peak"
                            : bus.crowdLevel === "crowded"
                              ? "High Peak"
                              : "Moderate"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Train size={14} className="text-emerald-600" /> Metro Trains Nearby
                </h3>
                <div className="space-y-2.5">
                  {initialMetroTrains.slice(0, 3).map((train) => (
                    <div
                      key={train.id}
                      className="flex flex-col bg-surface/50 border border-border rounded-xl p-3 hover:border-emerald-600/30 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-white text-xs font-bold px-2 py-0.5 rounded-md shadow-sm ${train.line === "purple" ? "bg-[#8B5CF6]" : "bg-[#10B981]"}`}
                          >
                            {train.line === "purple" ? "Purple" : "Green"}
                          </span>
                          <span className="text-sm font-semibold text-foreground truncate max-w-[120px]">
                            To {train.nextStation}
                          </span>
                        </div>
                        <span className="text-xs font-bold bg-secondary border border-border px-2 py-0.5 rounded-md text-foreground">
                          {train.status === "Arriving"
                            ? "0.1 km"
                            : `${(Math.random() * 2 + 0.5).toFixed(1)} km`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground">Live Crowd:</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20 capitalize">
                          Severe Peak
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </PageShell>
    </>
  );
}
