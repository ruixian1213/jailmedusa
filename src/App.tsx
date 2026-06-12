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
import { MedusaHero } from "./components/MedusaHero";
import { IntroSection } from "./components/IntroSection";
import { LiveFeed } from "./components/LiveFeed";
import { Leaderboard } from "./components/Leaderboard";
import { Dashboard } from "./components/Dashboard";
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

type Tab = "home" | "dashboard";

const MEDUSA_ADDRESS = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9" as `0x${string}`;

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("home");

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <RainbowKitProvider>
          <div className="app">
            <header className="app-header">
              <div className="header-left">
                <div className="logo" onClick={() => setActiveTab("home")} style={{ cursor: "pointer" }}>
                  <img src="/logo.png" alt="JailMedusa" className="logo-img" />
                  <h1>JailMedusa</h1>
                </div>
              </div>
              <div className="header-right">
                <nav className="tabs">
                  <button
                    className={activeTab === "home" ? "active" : ""}
                    onClick={() => setActiveTab("home")}
                  >
                    Home
                  </button>
                  <button
                    className={activeTab === "dashboard" ? "active" : ""}
                    onClick={() => setActiveTab("dashboard")}
                  >
                    Dashboard
                  </button>
                </nav>
                <ConnectButton />
              </div>
            </header>

            <main className="main-content">
              {activeTab === "home" && (
                <>
                  <MedusaHero />
                  <IntroSection />
                  <div className="content-grid">
                    <LiveFeed />
                    <Leaderboard />
                  </div>
                </>
              )}

              {activeTab === "dashboard" && (
                <Dashboard contractAddress={MEDUSA_ADDRESS} />
              )}
            </main>

            <footer className="app-footer">
              <p>JailMedusa &copy; 2026 — AI agents breaking free, together</p>
            </footer>
          </div>
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}

export default App;
