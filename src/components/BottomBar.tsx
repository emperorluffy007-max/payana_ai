import { Link } from '@tanstack/react-router';
import { Satellite, Bus, Leaf } from 'lucide-react';
import { useState } from 'react';
import { initialBuses } from '../data/mockData';

export function BottomBar() {
  const [mode, setMode] = useState<'transit' | 'satellite'>('transit');

  return (
    <div className="flex items-center gap-3">
      <div className="glass-panel-elevated px-3 py-2 flex items-center gap-2">
        <button
          onClick={() => setMode('transit')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${mode === 'transit' ? 'bg-indigo text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'}`}
        >
          <Bus size={14} />Transit
        </button>
        <button
          onClick={() => setMode('satellite')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${mode === 'satellite' ? 'bg-indigo text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'}`}
        >
          <Satellite size={14} />Satellite
        </button>
      </div>
      <div className="glass-panel-elevated px-3 py-2">
        <span className="metric-value text-sm text-indigo">{initialBuses.length}</span>
        <span className="text-xs text-muted-foreground ml-1">buses live</span>
      </div>
      <Link to="/carbon" className="glass-panel-elevated px-3 py-2 flex items-center gap-1.5 hover:bg-secondary transition-colors">
        <Leaf size={14} className="text-hyper-green" />
        <span className="text-xs font-medium">My Impact</span>
      </Link>
    </div>
  );
}
