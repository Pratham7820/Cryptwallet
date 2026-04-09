# 🚀 Web Wallet (Multi-Chain: Solana + Ethereum)

A modern **web-based crypto wallet** that supports **Solana and Ethereum**, featuring secure key management, token swaps, and a clean UI for seamless on-chain interactions.

---

## ✨ Features

- 🔐 **Secure Wallet Management**
  - Encrypted private keys (AES-based encryption)
  - Password-protected access

- 🌐 **Multi-Chain Support**
  - Solana (via Jupiter API)
  - Ethereum (via 0x API)

- 💱 **Token Swaps**
  - Solana swaps using Jupiter aggregator

- ⚡ **Real-time Quotes**
  - Fetch best swap routes dynamically

- 🎯 **User-Friendly UI**
  - Clean and responsive interface
  - Easy token selection and swap flow

---

## 🛠️ Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS

**Blockchain**
- Solana → @solana/web3.js  
- Ethereum → ethers.js  

**APIs**
- Jupiter API (Solana swaps)  

**Other**
- Axios  
- Custom encryption module  
---

## ⚙️ Environment Variables

Create a `.env` file:

```
VITE_JUP_URL=
VITE_JUP_API=your_jupiter_api_key
VITE_ETHRPC_URL = 
VITE_SOLRPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
```
---

## 🚀 Getting Started

### 1. Clone the repo
```
git clone https://github.com/yourusername/web-wallet.git
cd web-wallet
```

### 2. Install dependencies
```
npm install
```

### 3. Run the app
```
npm run dev
```
---

## 🧠 Future Improvements

- Ethereum Swap
- ERC20 approval automation  
- Gas estimation UI  
- Token search (full list)  
- Transaction history  
- Cross-chain swaps  
- Hardware wallet support  
