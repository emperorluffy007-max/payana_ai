import { Link, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Map,
  Route,
  BarChart3,
  Leaf,
  Trophy,
  History,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Navigation,
  Moon,
  Sun,
  User,
  Settings,
  ChevronDown,
} from "lucide-react";

const navLinks = [
  { to: "/" as const, label: "Dashboard", icon: LayoutDashboard },
  { to: "/plan" as const, label: "Plan", icon: Navigation },
  { to: "/map" as const, label: "Live Map", icon: Map },
  { to: "/routes" as const, label: "Routes", icon: Route },
  { to: "/insights" as const, label: "Peak Insights", icon: BarChart3 },
  { to: "/carbon" as const, label: "Impact Tracker", icon: Leaf },
  { to: "/history" as const, label: "History", icon: History },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  const handleSignOut = () => {
    localStorage.removeItem("payana_auth");
    router.navigate({ to: "/signin", replace: true });
  };

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
              activeProps={{ className: "bg-indigo/10 text-indigo" }}
              inactiveProps={{
                className: "text-muted-foreground hover:text-foreground hover:bg-secondary",
              }}
              activeOptions={{ exact: link.to === "/" }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
              <link.icon size={15} />
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions — desktop */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            title="Toggle Theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <div className="w-[1px] h-5 bg-border mx-1"></div>

          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-indigo/50"
            >
              <div className="w-7 h-7 rounded-full bg-indigo/10 flex items-center justify-center border border-indigo/20">
                <User size={14} className="text-indigo" />
              </div>
              <ChevronDown
                size={14}
                className="text-muted-foreground transition-transform duration-200"
                style={{ transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden py-1 z-50 origin-top-right"
                >
                  <div className="px-4 py-3 border-b border-border bg-surface/30">
                    <p className="text-sm font-bold text-foreground">Mohammed Shikaj</p>
                    <p className="text-xs text-muted-foreground mt-0.5">mohammed@payana.ai</p>
                  </div>
                  <div className="p-1.5">
                    <button
                      onClick={() => setProfileOpen(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors text-left"
                    >
                      <User size={15} className="text-muted-foreground" /> Profile
                    </button>
                    <button
                      onClick={() => setProfileOpen(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors text-left"
                    >
                      <Settings size={15} className="text-muted-foreground" /> Preferences
                    </button>
                  </div>
                  <div className="p-1.5 border-t border-border">
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        handleSignOut();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors text-left font-medium"
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-border bg-card"
          >
            <div className="p-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  activeProps={{ className: "bg-indigo/10 text-indigo" }}
                  inactiveProps={{ className: "text-muted-foreground" }}
                  activeOptions={{ exact: link.to === "/" }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <link.icon size={16} />
                  {link.label}
                </Link>
              ))}

              <hr className="my-1 border-border" />
              <button
                onClick={() => setIsDark(!isDark)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-colors w-full text-left"
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
                {isDark ? "Light Mode" : "Dark Mode"}
              </button>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleSignOut();
                }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full text-left mt-1"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
