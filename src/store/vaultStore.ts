import { create } from 'zustand';

interface VaultState {
  address: string | null;
  chainId: number | null;
  dUsdcBalance: string;
  encryptedVaultBalance: string | null; // bytes
  decryptedVaultBalance: string | null; // revealed
  yieldEarned: string;
  pendingWithdrawal: string;
  setWallet: (address: string | null, chainId: number | null) => void;
  setBalances: (data: Partial<VaultState>) => void;
  disconnect: () => void;
}

export const useVaultStore = create<VaultState>((set) => ({
  address: null,
  chainId: null,
  dUsdcBalance: "0",
  encryptedVaultBalance: null,
  decryptedVaultBalance: null,
  yieldEarned: "0",
  pendingWithdrawal: "0",
  setWallet: (address, chainId) => set({ address, chainId }),
  setBalances: (data) => set((state) => ({ ...state, ...data })),
  disconnect: () => set({ 
    address: null, 
    chainId: null, 
    dUsdcBalance: "0", 
    encryptedVaultBalance: null, 
    decryptedVaultBalance: null, 
    yieldEarned: "0", 
    pendingWithdrawal: "0" 
  }),
}));
