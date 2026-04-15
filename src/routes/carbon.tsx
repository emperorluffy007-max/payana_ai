import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Leaf, TreePine, Bike, Flame, Award } from 'lucide-react';
import { userStats } from '../data/mockData';
import { PageShell } from '../components/PageShell';
import { MapBackground } from '../components/MapBackground';

export const Route = createFileRoute('/carbon')({
  head: () => ({
    meta: [
      { title: 'My Impact — payana.ai' },
      { name: 'description', content: 'Track your personal CO₂ savings, streaks, and commuter rank.' },
      { property: 'og:title', content: 'My Impact — payana.ai' },
      { property: 'og:description', content: 'Track your CO₂ savings and commuter rank.' },
    ],
  }),
  component: CarbonPage,
});

function CarbonPage() {
  return (
    <>
      <MapBackground />
      <PageShell title="My Impact">
        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { icon: Leaf, label: 'CO₂ Saved', value: `${userStats.co2Saved}kg`, color: 'text-hyper-green' },
            { icon: TreePine, label: 'Trees Equivalent', value: String(userStats.treesEquivalent), color: 'text-hyper-green' },
            { icon: Bike, label: 'Trips This Month', value: String(userStats.tripsThisMonth), color: 'text-indigo' },
            { icon: Flame, label: 'Day Streak', value: String(userStats.streak), color: 'text-amber' },
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
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} unit="kg" />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 12 }} />
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
            <p className="text-muted-foreground text-sm mt-1">Rank #{userStats.rank} in Bengaluru</p>
            <div className="mt-4 bg-surface rounded-xl px-6 py-3 border border-border">
              <p className="metric-value text-3xl text-indigo">{userStats.points.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Points</p>
            </div>
            <div className="mt-4 w-full bg-surface rounded-lg p-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Next rank: Platinum</span>
                <span className="metric-value text-muted-foreground">4820 / 6000</span>
              </div>
              <div className="occupancy-bar">
                <div className="occupancy-fill" style={{ width: '80%', background: '#4F46E5' }} />
              </div>
            </div>
          </motion.div>
        </div>
      </PageShell>
    </>
  );
}
