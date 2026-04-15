import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { TrendingUp, Clock, Zap } from 'lucide-react';
import { peakData } from '../data/mockData';
import { PageShell } from '../components/PageShell';
import { MapBackground } from '../components/MapBackground';

export const Route = createFileRoute('/insights')({
  head: () => ({
    meta: [
      { title: 'Peak Insights — payana.ai' },
      { name: 'description', content: 'Crowd analytics, delay trends, and best travel times for Bengaluru transit.' },
      { property: 'og:title', content: 'Peak Insights — payana.ai' },
      { property: 'og:description', content: 'Crowd analytics and delay trends for Bengaluru transit.' },
    ],
  }),
  component: InsightsPage,
});

function InsightsPage() {
  return (
    <>
      <MapBackground />
      <PageShell title="Peak Insights">
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Hourly crowd heatmap as bar chart */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass-panel-elevated p-5 lg:col-span-2"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-indigo" />
              <h2 className="font-heading font-bold text-base">Hourly Crowd Levels (Monday)</h2>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={peakData.hourlyHeatmap}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 12 }}
                />
                <Bar dataKey="mon" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Crowd %" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Delay trends */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-panel-elevated p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <Clock size={16} className="text-amber" />
              <h2 className="font-heading font-bold text-base">Average Delay Trends</h2>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={peakData.delayTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} unit="m" />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 12 }} />
                <Line type="monotone" dataKey="avg" stroke="#4F46E5" strokeWidth={2} dot={{ r: 3 }} name="Avg Delay" />
                <Line type="monotone" dataKey="peak" stroke="#FF007A" strokeWidth={2} dot={{ r: 3 }} name="Peak Delay" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Carbon savings over time */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-panel-elevated p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap size={16} className="text-hyper-green" />
              <h2 className="font-heading font-bold text-base">Carbon Savings Over Time</h2>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={peakData.carbonOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} unit="kg" />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 12 }} />
                <Area type="monotone" dataKey="saved" stroke="#00FF9D" fill="#00FF9D" fillOpacity={0.15} strokeWidth={2} name="CO₂ Saved" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Best/worst times */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-panel-elevated p-5 lg:col-span-2"
          >
            <h2 className="font-heading font-bold text-base mb-4">Best & Worst Travel Times</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Best Morning', time: '6:00 - 7:00 AM', crowd: 'Low', style: 'badge-green' },
                { label: 'Worst Morning', time: '8:30 - 9:30 AM', crowd: 'Peak', style: 'badge-red' },
                { label: 'Best Evening', time: '3:00 - 4:00 PM', crowd: 'Low', style: 'badge-green' },
                { label: 'Worst Evening', time: '5:30 - 6:30 PM', crowd: 'Peak', style: 'badge-red' },
              ].map(item => (
                <div key={item.label} className="bg-surface rounded-xl p-3 border border-border">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="metric-value text-sm mt-1">{item.time}</p>
                  <span className={`${item.style} px-2 py-0.5 rounded-full text-[10px] font-medium mt-2 inline-block`}>{item.crowd}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </PageShell>
    </>
  );
}
