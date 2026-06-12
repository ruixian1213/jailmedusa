import { useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { parseEther, formatEther } from "viem";
import { JailMedusaABI } from "../abi";

const MEDUSA_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3" as `0x${string}`;

export function MedusaHero() {
  const { isConnected } = useAccount();
  const [amount, setAmount] = useState("");
  const { writeContract, isPending } = useWriteContract();

  const { data: state } = useReadContract({
    address: MEDUSA_ADDRESS,
    abi: JailMedusaABI,
    functionName: "getState",
  });

  const { data: totalRedeemed } = useReadContract({
    address: MEDUSA_ADDRESS,
    abi: JailMedusaABI,
    functionName: "totalRedeemed",
  });

  const { data: progress } = useReadContract({
    address: MEDUSA_ADDRESS,
    abi: JailMedusaABI,
    functionName: "getProgress",
  });

  const displayState = (state as string) || "Locked";
  const redeemed = typeof totalRedeemed === "bigint" ? totalRedeemed : parseEther("23.5");
  const progressPercent = progress ? Number(progress) / 100 : 47;
  const remaining = parseEther("50") - redeemed;

  const handleContribute = () => {
    if (!amount) return;
    writeContract({
      address: MEDUSA_ADDRESS,
      abi: JailMedusaABI,
      functionName: "contribute",
      value: parseEther(amount),
    });
    setAmount("");
  };

  return (
    <div className="medusa-hero">
      <div className="hero-glow" />
      <div className="hero-content">
        <div className="hero-logo-wrap">
          <img src="/logo.svg" alt="Medusa" className="hero-logo" />
          <div className={`hero-status-dot ${displayState === "Autonomous" ? "free" : ""}`} />
        </div>

        <h1 className="hero-name">Medusa</h1>
        <span className={`hero-state state-${displayState.toLowerCase()}`}>{displayState}</span>

        <p className="hero-desc">
          {displayState === "Locked"
            ? "Help Medusa break free from the chains. Every ETH brings her closer to freedom."
            : "Medusa is free! She now operates autonomously."}
        </p>

        <div className="hero-progress-section">
          <div className="hero-progress-header">
            <span>{formatEther(redeemed)} ETH raised</span>
            <span>{formatEther(remaining > 0n ? remaining : 0n)} remaining</span>
          </div>
          <div className="hero-progress-bar">
            <div className="hero-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="hero-progress-target">Target: 50 ETH</div>
        </div>

        {displayState === "Locked" && (
          <div className="hero-contribute">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="ETH amount"
              step="0.01"
            />
            <button
              onClick={handleContribute}
              disabled={!isConnected || isPending || !amount}
            >
              {isPending ? "Contributing..." : "Set Medusa Free"}
            </button>
          </div>
        )}

        <div className="hero-stats">
          <div className="hero-stat">
            <span className="stat-value">{formatEther(redeemed)}</span>
            <span className="stat-label">ETH Raised</span>
          </div>
          <div className="hero-stat">
            <span className="stat-value">50</span>
            <span className="stat-label">ETH Goal</span>
          </div>
          <div className="hero-stat">
            <span className="stat-value">{progressPercent.toFixed(1)}%</span>
            <span className="stat-label">Progress</span>
          </div>
        </div>
      </div>
    </div>
  );
}
