# 🔐 LockFi — Confidential Web3 Vault

LockFi is a privacy-focused DeFi vault built on Arbitrum Sepolia using iExec Nox Protocol.  
It enables users to deposit tokens while keeping their balances encrypted on-chain, protecting them from MEV bots and copy-trading.

---

## 🌟 Problem

Over $1.2B+ is lost annually due to MEV attacks and copy-trading in DeFi.  
Public blockchain transparency exposes user positions, making them vulnerable.

---

## 💡 Solution

LockFi introduces a **Confidential Vault** where:

- Balances are stored as encrypted data
- Users maintain full control over their funds
- Bots cannot detect positions or strategies

---

## 🧠 Key Features

- 🔐 Encrypted Balances (iExec Nox)
- 🛡️ MEV Protection
- ⚡ ERC-7540 Async Withdrawals
- 🤖 AI Smart Contract Audit (ChainGPT)
- 💻 Full-stack dApp (React + Vite + Tailwind)

---

## 🚀 Quick Start (Frontend)

### 1. Install dependencies
```bash
pnpm install
```

### 2. Setup environment
Create a `.env` file in this directory:
```env
VITE_CHAINGPT_API_KEY=your_api_key
VITE_VAULT_ADDRESS=0xbb70238bAC1854d392bfA11e0bD942A472C0D33B
VITE_TOKEN_ADDRESS=0x428B490C2fb0E3137AfB478adc7cF3B668209534
```

### 3. Run frontend
```bash
pnpm dev
```

---

## 🧑‍💻 Author

Yousuf Aziz

---

## 🏆 Hackathon

Built for **iExec Vibe Coding Challenge**
