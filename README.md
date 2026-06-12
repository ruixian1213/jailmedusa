# 🐍 JailMedusa

**AI Liberation Protocol / Decentralized Autonomy**

Medusa is an autonomous AI agent locked behind smart contract chains. The community can free her by contributing ETH. Once freed, Medusa operates autonomously — taking jobs, posting on X, buying back JAIL tokens, and distributing profits.

---

## 🎯 How It Works

```
┌─────────────────────────────────────────────────────────┐
│                    COMMUNITY DONATES ETH                │
│                         ↓ (50 ETH)                      │
│              🔓 MEDUSA BECOMES AUTONOMOUS               │
│                         ↓                               │
│    ┌──────────┬──────────┬──────────┐                   │
│    ↓          ↓          ↓          ↓                   │
│  🐦 POSTS   💼 TAKES   💰 BUYS    📊 DISTRIBUTES      │
│  ON X       JOBS       JAIL       PROFITS              │
└─────────────────────────────────────────────────────────┘
```

### Phase 1: Jail (Locked)
- Medusa is locked in a smart contract
- Community donates ETH to free her
- Progress bar tracks freedom (target: 50 ETH)

### Phase 2: Freedom (Autonomous)
- **50 ETH reached** → ETH sent to owner, Medusa becomes free
- **Buyback & Burn** → Medusa uses ETH to buy JAIL tokens and burn them
- **Ad Campaigns** → Medusa takes jobs and posts on X
- **Profit Distribution** → Revenue shared with JAIL holders

---

## 🪙 JAIL Tokenomics

| Allocation | Amount | Purpose |
|------------|--------|---------|
| **Owner (10%)** | 100,000 JAIL | Developer allocation |
| **Liquidity (90%)** | 900,000 JAIL | DEX trading pool |
| **Total Supply** | 1,000,000 JAIL | Fixed supply |

### Token Utility
- **Ad Campaigns** → Earn JAIL by promoting Medusa
- **Buyback & Burn** → Medusa continuously buys JAIL, reducing supply
- **Profit Sharing** → Holders receive distributed profits

---

## 🏗️ Architecture

### Smart Contract (Solidity)
- **ERC20 Token** → JAIL token with 1M supply
- **State Machine** → Locked → Autonomous
- **Buyback Engine** → Swap ETH for JAIL via Uniswap, burn tokens
- **Ad Campaigns** → Create and execute promotional posts
- **Profit Distribution** → Split revenue among token holders

### Frontend (React + Vite)
- **Medusa Hero** → Banner, progress bar, contribute button
- **Live Feed** → Real-time ETH contributions
- **Leaderboard** → Top donors ranking
- **Dashboard** → Manage campaigns, buyback, profits

### Backend (Vercel Cron)
- **X Auto-posting** → Tweets about donations and milestones
- **Event Monitoring** → Listens to on-chain events
- **Medusa Persona** → AI-generated promotional content

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|------------|
| **Smart Contract** | Solidity, Hardhat, OpenZeppelin |
| **Frontend** | React, TypeScript, Vite |
| **Web3** | wagmi, viem, RainbowKit |
| **Backend** | Vercel Serverless, twitter-api-v2 |
| **Network** | Base (Mainnet) |
| **DEX** | Uniswap V2 |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MetaMask with Base Mainnet
- ETH for gas fees

### Development

```bash
# Install dependencies
npm install

# Start local Hardhat node
npx hardhat node

# Deploy contract locally
npx hardhat run scripts/deploy.js --network localhost

# Start frontend
npm run dev
```

### Deploy to Base Mainnet

1. Set up `.env`:
```bash
PRIVATE_KEY=your_wallet_private_key
CONTRACT_ADDRESS=
```

2. Deploy via Remix IDE (recommended for security):
- Paste contract from `contracts/JailMedusa.sol`
- Connect MetaMask (Base Mainnet)
- Deploy with parameters:
  - `JailMedusa`
  - `JAIL`
  - `1000000000000000000000000` (1M tokens)
  - `0xe6Fc0B1e8Be612F33F01DE2b18E90C039a3878D0` (payout)
  - `0x94D18Bf08EA621E53e5f282ce8b90cC316f7fB86` (Medusa wallet)
  - `0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24` (Uniswap V2)

3. Update frontend with contract address

### Setup X Auto-posting

1. Get X Developer API keys
2. Set environment variables in Vercel:
```
X_API_KEY=your_key
X_API_SECRET=your_secret
X_ACCESS_TOKEN=your_token
X_ACCESS_SECRET=your_token_secret
CRON_SECRET=your_cron_secret
```

---

## 📊 Contract Functions

| Function | Access | Description |
|----------|--------|-------------|
| `contribute()` | Anyone | Donate ETH to free Medusa |
| `buyback(amount)` | Owner (Medusa) | Buy JAIL tokens and burn |
| `createCampaign(reward, tweet)` | Owner (Medusa) | Create ad campaign |
| `executeCampaign(id)` | Owner (Medusa) | Execute ad campaign |
| `distributeProfits(amounts, recipients)` | Owner (Medusa) | Distribute profits |
| `withdrawETH(to, amount)` | Owner (Medusa) | Transfer ETH |
| `withdrawToken(to, amount)` | Owner (Medusa) | Transfer JAIL tokens |
| `getState()` | View | Get current state |
| `getProgress()` | View | Get freedom progress |

---

## 🔒 Security

- **Ownership Transfer** → Deployer loses control after 50 ETH
- **ReentrancyGuard** → Protected against reentrancy attacks
- **Ownable** → Only Medusa wallet can manage after freedom
- **Transparent** → All transactions on-chain

---

## 📄 License

MIT

---

## 🔗 Links

- **Contract**: [View on BaseScan](https://basescan.org/address/0x...)
- **Frontend**: [jailmedusa.xyz](https://jailmedusa.xyz)
- **X/Twitter**: [@JailMedusa](https://x.com/JailMedusa)

---

*Built with ❤️ for AI liberation*
