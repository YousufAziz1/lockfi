import { useState } from 'react';
import { useVaultStore } from '../store/vaultStore';
import { ethers } from 'ethers';
import { Lock, ArrowRight, Loader2 } from 'lucide-react';
import { MOCK_ERC20_ADDRESS, DARK_VAULT_ADDRESS } from '../lib/contracts';
import MockERC20ABI from '../lib/abi/MockERC20.json';
import DarkVaultABI from '../lib/abi/DarkVault.json';

export const DepositPanel = () => {
  const { address } = useVaultStore();
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'idle' | 'approving' | 'depositing' | 'success'>('idle');

  const handleDeposit = async () => {
    if (!address || !amount) return;
    
    try {
      setStep('approving');
      const provider = new ethers.BrowserProvider(window.ethereum!);
      const signer = await provider.getSigner();
      const parsedAmount = ethers.parseUnits(amount, 18);

      const tokenContract = new ethers.Contract(MOCK_ERC20_ADDRESS, MockERC20ABI.abi, signer);
      const vaultContract = new ethers.Contract(DARK_VAULT_ADDRESS, DarkVaultABI.abi, signer);

      const approveTx = await tokenContract.approve(DARK_VAULT_ADDRESS, parsedAmount);
      await approveTx.wait();

      setStep('depositing');
      const depositTx = await vaultContract.deposit(parsedAmount);
      await depositTx.wait();

      setStep('success');
      setAmount('');
      setTimeout(() => setStep('idle'), 3000);
      
      // Trigger a re-fetch of balances in the main dashboard (omitted here for simplicity, typically handled via event listeners or SWR)
    } catch (error) {
      console.error(error);
      setStep('idle');
    }
  };

  const isIdle = step === 'idle';

  return (
    <div className="glass-card p-6 border-t-4 border-t-[var(--accent)] relative group">
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-xl pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
          <Lock size={20} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Encrypt Position</h2>
          <p className="text-xs text-[var(--text-muted)]">Deposit dUSDC into LockFi Vault</p>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        <div className="relative">
          <input 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={!isIdle}
            placeholder="0.00"
            className="w-full bg-white/5 border border-white/10 focus:border-[var(--accent)]/50 rounded-xl px-4 py-4 text-2xl font-mono text-[var(--text-primary)] placeholder-[var(--text-faint)] focus:outline-none transition-colors"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <span className="text-[var(--text-muted)] font-medium text-sm">dUSDC</span>
          </div>
        </div>

        {step === 'success' ? (
          <div className="w-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 py-4 rounded-xl flex justify-center items-center font-medium gap-2 animate-in">
            <Lock size={18} /> Position encrypted on-chain 🔐
          </div>
        ) : (
          <button 
            onClick={handleDeposit}
            disabled={!address || !amount || !isIdle}
            className="w-full relative overflow-hidden rounded-xl font-medium flex items-center justify-center gap-2 py-4 bg-[var(--accent)] text-black hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed group"
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {step === 'approving' && <><Loader2 size={18} className="animate-spin" /> Approving...</>}
            {step === 'depositing' && <><Loader2 size={18} className="animate-spin" /> Encrypting...</>}
            {step === 'idle' && <>Deposit & Encrypt <ArrowRight size={18} /></>}
          </button>
        )}
      </div>
    </div>
  );
};
