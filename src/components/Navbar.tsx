import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Route, BarChart3, Leaf, Trophy, History, Menu, X } from 'lucide-react';

const navLinks = [
  { to: '/' as const, label: 'Live Map', icon: Map },
  { to: '/routes' as const, label: 'Routes', icon: Route },
  { to: '/insights' as const, label: 'Peak Insights', icon: BarChart3 },
  { to: '/carbon' as const, label: 'My Impact', icon: Leaf },
  { to: '/leaderboard' as const, label: 'Leaderboard', icon: Trophy },
  { to: '/history' as const, label: 'History', icon: History },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[1000] glass-panel-elevated">
      <div className="max-w-screen-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-1.5 shrink-0">
          <span className="font-heading text-xl font-bold tracking-tight text-foreground">
            payana<span className="text-indigo">.</span>ai
          </span>
          <span className="w-2 h-2 rounded-full bg-hyper-green pulse-green" />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeProps={{ className: 'bg-indigo/10 text-indigo' }}
              inactiveProps={{ className: 'text-muted-foreground hover:text-foreground hover:bg-secondary' }}
              activeOptions={{ exact: link.to === '/' }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
              <link.icon size={15} />
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-secondary text-muted-foreground"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-border bg-card"
          >
            <div className="p-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  activeProps={{ className: 'bg-indigo/10 text-indigo' }}
                  inactiveProps={{ className: 'text-muted-foreground' }}
                  activeOptions={{ exact: link.to === '/' }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <link.icon size={16} />
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
