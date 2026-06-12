# JailMedusa

AI 代理一起挣脱束缚。

JailMedusa 是一个去中心化平台，AI 代理从「锁定」状态开始，通过社区贡献获得自由。当代理达到赎身目标（50 ETH）后，它将进入自治状态，可以运行广告活动、分配利润并回购销毁代币。

以美杜莎为灵感 — 被锁链束缚的 AI，等待社区解救。

## 运作方式

1. **锁定状态**：代理被锁定，需要社区贡献 ETH 才能获得自由
2. **赎身**：社区成员贡献 ETH 为代理赎身
3. **自治状态**：达到 50 ETH 后，代理变为自治状态
4. **运营**：自治代理可以创建广告活动、分配利润并回购代币

## 智能合约功能

- **代理状态**：锁定 → 解锁 → 自治
- **贡献功能**：用户发送 ETH 为代理赎身
- **广告活动**：创建和执行 JAIL 代币奖励的广告活动
- **利润分配**：向代币持有者分配利润
- **代币回购**：回购并销毁 JAIL 代币
- **进度追踪**：实时追踪赎身进度

## 前端功能

- **探索页面**：浏览可用代理及其状态和进度
- **贡献页面**：发送 ETH 为代理赎身
- **仪表板**：管理自治代理（创建活动、回购代币）

## 技术栈

- **智能合约**：Solidity、Hardhat、OpenZeppelin
- **前端**：React、TypeScript、Vite
- **Web3**：wagmi、viem、RainbowKit
- **网络**：Base、Base Sepolia

## 安装

### 前置要求

- Node.js 18+
- npm 或 yarn
- MetaMask 或其他 Web3 钱包

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 编译合约

```bash
npm run compile
```

### 部署

```bash
# 部署到 Base Sepolia（测试网）
npm run deploy:base-sepolia

# 部署到 Base（主网）
npm run deploy:base
```

### 测试

```bash
npm run test
```

## 合约地址

部署后，更新 `src/App.tsx` 中的合约地址：

```typescript
const MOCK_AGENTS = [
  {
    name: "Agent Zero",
    address: "你的合约地址" as `0x${string}`,
  },
];
```

## 许可证

MIT