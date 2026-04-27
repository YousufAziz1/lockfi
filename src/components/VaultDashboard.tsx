import { useEffect, useState } from 'react';
import { useVaultStore } from '../store/vaultStore';
import { ethers } from 'ethers';
import { Eye, EyeOff, Coins, Zap } from 'lucide-react';
import { DARK_VAULT_ADDRESS, MOCK_ERC20_ADDRESS } from '../lib/contracts';
import DarkVaultABI from '../lib/abi/DarkVault.json';
import MockERC20ABI from '../lib/abi/MockERC20.json';
import { motion, AnimatePresence } from 'framer-motion';

export const VaultDashboard = () => {
  const { address } = useVaultStore();
  const [encryptedBalance, setEncryptedBalance] = useState('████████');
  const [decryptedBalance, setDecryptedBalance] = useState<string | null>(null);
  const [yieldEarned, setYieldEarned] = useState('0.0000');
  const [dUsdcBalance, setDUsdcBalance] = useState('0.00');

  const fetchBalances = async () => {
    if (!address) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum!);
      const signer = await provider.getSigner();
      
      const vaultContract = new ethers.Contract(DARK_VAULT_ADDRESS, DarkVaultABI.abi, signer);
      const tokenContract = new ethers.Contract(MOCK_ERC20_ADDRESS, MockERC20ABI.abi, signer);

      // get dUSDC
      const dusdc = await tokenContract.balanceOf(address);
      setDUsdcBalance(ethers.formatUnits(dusdc, 18));

      // get Yield
      const yieldAmt = await vaultContract.getYieldEarned(address);
      setYieldEarned(ethers.formatUnits(yieldAmt, 18));

      // get Encrypted Balance
      const enc = await vaultContract.getEncryptedBalance(address);
      if (enc && enc !== '0x') {
        setEncryptedBalance(enc.substring(0, 10) + '...');
      } else {
        setEncryptedBalance('████████');
      }

    } catch (e) {
      console.error("Fetch Error", e);
    }
  };

  useEffect(() => {
    fetchBalances();
    const interval = setInterval(fetchBalances, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, [address]);

  // Decrypt button just toggles visibility — iExec Nox TEE flow simulated

  const handleMintTokens = async () => {
    if (!address) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum!);
      const signer = await provider.getSigner();
      const tokenContract = new ethers.Contract(MOCK_ERC20_ADDRESS, MockERC20ABI.abi, signer);
      const tx = await tokenContract.mint(address, ethers.parseUnits('1000', 18));
      await tx.wait();
      fetchBalances();
    } catch (e) {
      console.error("Minting Error:", e);
    }
  }

  if (!address) {
    return (
      <div className="glass-card p-12 text-center rounded-2xl flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-[var(--text-faint)] mb-4">
          <EyeOff size={32} />
        </div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Wallet Disconnected</h2>
        <p className="text-[var(--text-muted)]">Connect your wallet to access the confidential vault.</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl overflow-hidden relative group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-50" />
      
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm text-[var(--text-muted)] font-medium uppercase tracking-wider mb-1">Your Encrypted Position</p>
            <div className="flex items-end gap-3">
              <AnimatePresence mode="wait">
                <motion.h1 
                  key={decryptedBalance ? 'decrypted' : 'encrypted'}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className={`text-4xl sm:text-5xl font-mono font-bold ${decryptedBalance ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}
                >
                  {decryptedBalance ? decryptedBalance : encryptedBalance}
                </motion.h1>
              </AnimatePresence>
              <span className="text-xl text-[var(--text-muted)] mb-1">dUSDC</span>
            </div>
          </div>
          
          <button 
            onClick={() => setDecryptedBalance(decryptedBalance ? null : "...")}
            className="w-12 h-12 rounded-xl bg-white/5 hover:bg-[var(--accent)]/10 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors flex items-center justify-center border border-white/5 hover:border-[var(--accent)]/20"
            title={decryptedBalance ? "Encrypt" : "Decrypt via iExec Nox"}
          >
            {decryptedBalance ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {decryptedBalance === "..." && (
           <div className="text-xs text-[var(--accent-2)] flex items-center gap-2 mb-6">
              <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Decrypting via iExec Nox TEE...
           </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
            <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm mb-2">
              <Zap size={16} className="text-[var(--warning)]" /> Yield Earned
            </div>
            <div className="text-xl font-mono font-medium text-[var(--text-primary)]">
              {yieldEarned} <span className="text-sm text-[var(--text-muted)]">dUSDC</span>
            </div>
          </div>
          
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
            <div className="flex items-center justify-between text-[var(--text-muted)] text-sm mb-2">
              <div className="flex items-center gap-2">
                <Coins size={16} className="text-[var(--accent-2)]" /> Wallet Balance
              </div>
              <button onClick={handleMintTokens} className="text-[10px] uppercase bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded text-[var(--text-primary)] transition-colors">Faucet</button>
            </div>
            <div className="text-xl font-mono font-medium text-[var(--text-primary)]">
              {dUsdcBalance} <span className="text-sm text-[var(--text-muted)]">dUSDC</span>
            </div>
          </div>
        </div>

      </div>

      <div className="bg-white/[0.02] border-t border-white/[0.05] px-8 py-4 flex items-center justify-between">
        <span className="text-sm text-[var(--text-muted)]">Total Vault TVL</span>
        <span className="text-sm font-mono text-[var(--text-faint)] select-none tooltip" title="Encrypted by iExec Nox">[ENCRYPTED]</span>
      </div>
    </div>
  );
};
