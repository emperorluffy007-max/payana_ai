import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, AlertCircle, Info, Leaf } from "lucide-react";
import { alerts as initialAlerts, userStats } from "../data/mockData";

const typeConfig = {
  urgent: { icon: AlertTriangle, style: "border-l-4 border-l-vivid-pink bg-vivid-pink/5" },
  warning: { icon: AlertCircle, style: "border-l-4 border-l-amber bg-amber/5" },
  info: { icon: Info, style: "border-l-4 border-l-indigo bg-indigo/5" },
};

export function AlertsPanel() {
  const [alertList, setAlertList] = useState(initialAlerts);
  const [now, setNow] = useState(new Date());
  const isActive = alertList.some((a) => a.type === "urgent");

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="w-[300px] flex flex-col gap-3"
    >
      {/* Status */}
      <div className="glass-panel-elevated p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${isActive ? "bg-hyper-green pulse-green" : "bg-muted-foreground/40"}`}
            />
            <span className="text-xs font-medium">
              {isActive ? "Transit Mode Active" : "Standby"}
            </span>
          </div>
          <span className="metric-value text-xs text-muted-foreground">
            {now.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </span>
        </div>
      </div>

      {/* Alerts */}
      <div className="flex flex-col gap-2 max-h-[320px] overflow-y-auto">
        <AnimatePresence>
          {alertList.map((alert) => {
            const config = typeConfig[alert.type];
            const Icon = config.icon;
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`glass-panel p-3 ${config.style}`}
              >
                <div className="flex items-start gap-2">
                  <Icon size={14} className="shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold">{alert.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                      {alert.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">{alert.timestamp}</p>
                  </div>
                  <button
                    onClick={() => setAlertList((prev) => prev.filter((a) => a.id !== alert.id))}
                    className="text-muted-foreground hover:text-foreground p-0.5"
                    title="Dismiss"
                    aria-label="Dismiss"
                  >
                    <X size={12} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* CO2 tracker */}
      <div className="glass-panel-elevated p-3">
        <div className="flex items-center gap-2">
          <Leaf size={14} className="text-hyper-green" />
          <span className="text-xs font-medium">CO₂ Saved Today</span>
        </div>
        <p className="metric-value text-xl mt-1">
          {userStats.co2Saved}
          <span className="text-xs text-muted-foreground ml-1">kg</span>
        </p>
      </div>
    </motion.div>
  );
}
