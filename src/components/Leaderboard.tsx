import { useState } from "react";

interface Donor {
  rank: number;
  address: string;
  totalETH: number;
  percent: number;
}

const LEADERBOARD_DATA: Donor[] = [
  { rank: 1, address: "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B", totalETH: 8.42, percent: 16.8 },
  { rank: 2, address: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18", totalETH: 5.17, percent: 10.3 },
  { rank: 3, address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", totalETH: 3.88, percent: 7.8 },
  { rank: 4, address: "0x53d284357ec70cE289D6D64134DfAc8E511c8a3D", totalETH: 2.65, percent: 5.3 },
  { rank: 5, address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", totalETH: 1.93, percent: 3.9 },
  { rank: 6, address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", totalETH: 1.42, percent: 2.8 },
  { rank: 7, address: "0x514910771AF9Ca656af840dff83E8264EcF986CA", totalETH: 0.97, percent: 1.9 },
  { rank: 8, address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", totalETH: 0.64, percent: 1.3 },
];

const RANK_ICONS = ["👑", "🥈", "🥉"];

export function Leaderboard() {
  const [tab, setTab] = useState<"all" | "today">("all");

  return (
    <div className="leaderboard">
      <div className="lb-header">
        <h2>Top Donors</h2>
        <div className="lb-tabs">
          <button className={tab === "all" ? "active" : ""} onClick={() => setTab("all")}>All Time</button>
          <button className={tab === "today" ? "active" : ""} onClick={() => setTab("today")}>Today</button>
        </div>
      </div>
      <div className="lb-list">
        {LEADERBOARD_DATA.map((donor) => (
          <div key={donor.rank} className={`lb-item ${donor.rank <= 3 ? "lb-top" : ""}`}>
            <div className="lb-rank">
              {donor.rank <= 3 ? RANK_ICONS[donor.rank - 1] : `#${donor.rank}`}
            </div>
            <div className="lb-avatar">
              {donor.address.slice(2, 4).toUpperCase()}
            </div>
            <div className="lb-info">
              <a
                className="lb-address"
                href={`https://basescan.org/address/${donor.address}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {shortenAddress(donor.address)}
              </a>
              <div className="lb-bar-wrap">
                <div className="lb-bar" style={{ width: `${donor.percent * 3}%` }} />
              </div>
            </div>
            <div className="lb-amount">
              <span className="lb-eth">{donor.totalETH} ETH</span>
              <span className="lb-percent">{donor.percent}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function shortenAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}
