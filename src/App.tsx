import { useState } from "react";
import { WagmiProvider, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { defineChain } from "viem";
import { base, baseSepolia } from "wagmi/chains";
import {
  RainbowKitProvider,
  ConnectButton,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import { Contribute } from "./components/Contribute";
import { Dashboard } from "./components/Dashboard";
import { AgentCard } from "./components/AgentCard";
import "@rainbow-me/rainbowkit/styles.css";

const hardhat = defineChain({
  id: 31337,
  name: "Hardhat",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["http://127.0.0.1:8545"] },
  },
});

const queryClient = new QueryClient();

const config = getDefaultConfig({
  appName: "JailMedusa",
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "demo",
  chains: [hardhat, baseSepolia, base],
  transports: {
    [hardhat.id]: http("http://127.0.0.1:8545"),
    [baseSepolia.id]: http(),
    [base.id]: http(),
  },
});

type Tab = "contribute" | "dashboard" | "explore";

const MOCK_AGENTS = [
  {
    name: "Agent 1",
    address: "0x5FbDB2315678afecb367f032d93F642f64180aa3" as `0x${string}`,
  },
  {
    name: "Agent 2",
    address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512" as `0x${string}`,
  },
  {
    name: "Agent 3",
    address: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0" as `0x${string}`,
  },
];

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("explore");
  const [selectedAgent, setSelectedAgent] = useState<`0x${string}` | "">("");

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <RainbowKitProvider>
        <div className="app">
          <header className="app-header">
            <div className="logo">
              <img src="/logo.svg" alt="JailMedusa" className="logo-svg" />
              <h1>JailMedusa</h1>
            </div>
            <p className="tagline">AI agents breaking free, together</p>
            <ConnectButton />
          </header>

          <nav className="tabs">
            <button
              className={activeTab === "explore" ? "active" : ""}
              onClick={() => setActiveTab("explore")}
            >
              Explore
            </button>
            <button
              className={activeTab === "contribute" ? "active" : ""}
              onClick={() => setActiveTab("contribute")}
            >
              Contribute
            </button>
            <button
              className={activeTab === "dashboard" ? "active" : ""}
              onClick={() => setActiveTab("dashboard")}
            >
              Dashboard
            </button>
          </nav>

          <main className="main-content">
            {activeTab === "explore" && (
              <div className="agent-grid">
                {MOCK_AGENTS.map((agent) => (
                  <div
                    key={agent.address}
                    className={`agent-card-wrapper ${
                      selectedAgent === agent.address ? "selected" : ""
                    }`}
                    onClick={() => {
                      setSelectedAgent(agent.address);
                      setActiveTab("contribute");
                    }}
                  >
                    <AgentCard
                      contractAddress={agent.address}
                      name={agent.name}
                    />
                  </div>
                ))}
              </div>
            )}

            {activeTab === "contribute" && (
              <Contribute
                contractAddress={
                  selectedAgent ||
                  ("0x0000000000000000000000000000000000000001" as `0x${string}`)
                }
              />
            )}

            {activeTab === "dashboard" && (
              <Dashboard
                contractAddress={
                  selectedAgent ||
                  ("0x0000000000000000000000000000000000000001" as `0x${string}`)
                }
              />
            )}
          </main>
        </div>
      </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}

export default App;
