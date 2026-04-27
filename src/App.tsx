import { ConnectWallet } from './components/ConnectWallet';
import { VaultDashboard } from './components/VaultDashboard';
import { DepositPanel } from './components/DepositPanel';
import { WithdrawPanel } from './components/WithdrawPanel';
import { AIAuditPanel } from './components/AIAuditPanel';
import { MEVProtectionBadge } from './components/MEVProtectionBadge';

function App() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-mesh">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-x-0 border-t-0 rounded-none bg-black/40 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="LockFi" className="w-10 h-10 object-contain rounded-xl" />
            <span className="text-xl font-bold tracking-wider text-gradient">LockFi</span>
          </div>
          <ConnectWallet />
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto stagger animate-in">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/5 text-[var(--accent)] text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
            iExec Nox Protocol Active
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient pb-2">
            Confidential Yield
          </h1>
          <p className="text-[var(--text-muted)] text-lg">
            Deposit assets into an MEV-protected vault. Your positions are encrypted on-chain, invisible to front-runners and copy-traders.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-6">
            <VaultDashboard />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DepositPanel />
              <WithdrawPanel />
            </div>
          </div>
          
          <div className="lg:col-span-4 space-y-6 flex flex-col h-full">
            <MEVProtectionBadge />
            <div className="flex-1 min-h-[450px]">
              <AIAuditPanel />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
