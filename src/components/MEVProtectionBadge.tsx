import { useState, useEffect } from 'react';
import { ShieldCheck, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export const MEVProtectionBadge = () => {
  const [botsBlocked, setBotsBlocked] = useState(1337);

  // Simulate bots being blocked in real-time
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        setBotsBlocked(prev => prev + Math.floor(Math.random() * 3) + 1);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 flex items-center justify-between relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-[var(--accent)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] border border-[var(--accent)]/20 relative">
          <ShieldCheck size={24} className="icon-glow" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--accent)]"></span>
          </span>
        </div>
        <div>
          <h3 className="text-[var(--text-primary)] font-semibold text-sm">iExec Nox Protection</h3>
          <p className="text-[var(--text-muted)] text-xs mt-0.5">Front-running & Copy-trading impossible</p>
        </div>
      </div>

      <div className="text-right">
        <div className="flex items-center gap-1.5 justify-end text-[var(--accent)] font-bold text-lg">
          <Activity size={16} />
          {botsBlocked.toLocaleString()}
        </div>
        <p className="text-[var(--text-faint)] text-[10px] uppercase tracking-wider mt-1">Bots Blocked (Simulated)</p>
      </div>
    </motion.div>
  );
};
