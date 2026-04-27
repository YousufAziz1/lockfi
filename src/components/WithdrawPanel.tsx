import { useState, useEffect } from 'react';
import { useVaultStore } from '../store/vaultStore';
import { ethers } from 'ethers';
import { Unlock, Loader2, Clock } from 'lucide-react';
import { DARK_VAULT_ADDRESS } from '../lib/contracts';
import DarkVaultABI from '../lib/abi/DarkVault.json';

export const WithdrawPanel = () => {
  const { address } = useVaultStore();
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'idle' | 'requesting' | 'processing' | 'success'>('idle');
  const [pendingWithdrawal, setPendingWithdrawal] = useState('0');

  const checkPending = async () => {
    if (!address) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum!);
      const contract = new ethers.Contract(DARK_VAULT_ADDRESS, DarkVaultABI.abi, provider);
      const pending = await contract.pendingWithdrawals(address);
      setPendingWithdrawal(ethers.formatUnits(pending, 18));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    checkPending();
  }, [address, step]);

  const handleRequest = async () => {
    if (!address || !amount) return;
    if (parseFloat(amount) <= 0) {
      alert("Enter valid no");
      return;
    }
    try {
      setStep('requesting');
      const provider = new ethers.BrowserProvider(window.ethereum!);
      const signer = await provider.getSigner();
      const vaultContract = new ethers.Contract(DARK_VAULT_ADDRESS, DarkVaultABI.abi, signer);

      const tx = await vaultContract.requestWithdraw(ethers.parseUnits(amount, 18));
      await tx.wait();
      
      setAmount('');
      setStep('idle');
    } catch (error) {
      console.error(error);
      setStep('idle');
    }
  };

  const handleProcess = async () => {
    if (!address) return;
    try {
      setStep('processing');
      const provider = new ethers.BrowserProvider(window.ethereum!);
      const signer = await provider.getSigner();
      const vaultContract = new ethers.Contract(DARK_VAULT_ADDRESS, DarkVaultABI.abi, signer);

      const tx = await vaultContract.processWithdraw();
      await tx.wait();
      
      setStep('success');
      setTimeout(() => setStep('idle'), 3000);
    } catch (error) {
      console.error(error);
      setStep('idle');
    }
  };

  const isIdle = step === 'idle';
  const hasPending = parseFloat(pendingWithdrawal) > 0;

  return (
    <div className="glass-card p-6 relative group">
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[var(--text-primary)]">
          <Unlock size={20} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Withdraw</h2>
          <p className="text-xs text-[var(--text-muted)]">Async ERC-7540 Withdrawal</p>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        {!hasPending ? (
          <>
            <div className="relative">
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={!isIdle}
                placeholder="0.00"
                className="w-full bg-white/5 border border-white/10 focus:border-white/30 rounded-xl px-4 py-4 text-2xl font-mono text-[var(--text-primary)] placeholder-[var(--text-faint)] focus:outline-none transition-colors"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="text-[var(--text-muted)] font-medium text-sm">dUSDC</span>
              </div>
            </div>

            <button 
              onClick={handleRequest}
              disabled={!address || !amount || !isIdle}
              className="w-full relative overflow-hidden rounded-xl font-medium flex items-center justify-center gap-2 py-4 bg-white/5 text-[var(--text-primary)] border border-white/10 hover:bg-white/10 transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed group"
            >
              {step === 'requesting' ? <><Loader2 size={18} className="animate-spin" /> Requesting...</> : 'Request Withdraw'}
            </button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="bg-[var(--warning)]/10 border border-[var(--warning)]/20 p-4 rounded-xl flex items-start gap-3">
              <Clock className="text-[var(--warning)] shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-[var(--warning)] text-sm font-medium">Withdrawal Pending</p>
                <p className="text-[var(--warning)]/70 text-xs mt-1">You have {pendingWithdrawal} dUSDC ready to process.</p>
              </div>
            </div>

            {step === 'success' ? (
              <div className="w-full bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/20 py-4 rounded-xl flex justify-center items-center font-medium gap-2 animate-in">
                <Unlock size={18} /> Withdrawal Complete!
              </div>
            ) : (
              <button 
                onClick={handleProcess}
                disabled={!isIdle}
                className="w-full relative overflow-hidden rounded-xl font-medium flex items-center justify-center gap-2 py-4 bg-white text-black hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.97] disabled:opacity-50 group"
              >
                {step === 'processing' ? <><Loader2 size={18} className="animate-spin" /> Processing...</> : 'Process Withdraw'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
