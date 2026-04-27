import { useVaultStore } from '../store/vaultStore';
import { ethers } from 'ethers';
import { Wallet, LogOut } from 'lucide-react';

export const ConnectWallet = () => {
  const { address, setWallet, disconnect } = useVaultStore();

  const connect = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask.");
      return;
    }
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum!);
      const network = await provider.getNetwork();
      
      // Auto-switch to Arbitrum Sepolia
      if (network.chainId !== 421614n) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x66eee' }], // 421614 in hex
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x66eee',
                chainName: 'Arbitrum Sepolia',
                rpcUrls: ['https://sepolia-rollup.arbitrum.io/rpc'],
                nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                blockExplorerUrls: ['https://sepolia.arbiscan.io']
              }]
            });
          }
        }
      }

      const signer = await provider.getSigner();
      setWallet(await signer.getAddress(), 421614);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center">
      {address ? (
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-full glass-card border-[var(--border-active)] text-[var(--accent)] font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
          <button 
            onClick={disconnect}
            className="p-2 rounded-full hover:bg-white/5 transition-colors text-[var(--text-muted)] hover:text-[var(--danger)]"
          >
            <LogOut size={20} />
          </button>
        </div>
      ) : (
        <button 
          onClick={connect}
          className="relative group overflow-hidden rounded-xl px-6 py-2.5 font-medium flex items-center gap-2 bg-[var(--accent)] text-black hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.97]"
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Wallet size={18} />
          Connect Wallet
        </button>
      )}
    </div>
  );
};
