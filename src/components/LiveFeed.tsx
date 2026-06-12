import { useEffect, useRef, useState } from "react";

interface FeedItem {
  id: number;
  address: string;
  amount: number;
  timestamp: number;
}

const MOCK_ADDRESSES = [
  "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18",
  "0x53d284357ec70cE289D6D64134DfAc8E511c8a3D",
  "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
  "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
  "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
  "0x514910771AF9Ca656af840dff83E8264EcF986CA",
  "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
  "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",
  "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
];

function randomAmount(): number {
  const r = Math.random();
  if (r < 0.4) return parseFloat((Math.random() * 0.5).toFixed(3));
  if (r < 0.7) return parseFloat((Math.random() * 2 + 0.5).toFixed(3));
  if (r < 0.9) return parseFloat((Math.random() * 5 + 2).toFixed(3));
  return parseFloat((Math.random() * 10 + 5).toFixed(3));
}

function shortenAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function LiveFeed() {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const nextIdRef = useRef(8);

  useEffect(() => {
    const initial: FeedItem[] = [];
    for (let i = 0; i < 8; i++) {
      initial.push({
        id: i,
        address: MOCK_ADDRESSES[Math.floor(Math.random() * MOCK_ADDRESSES.length)],
        amount: randomAmount(),
        timestamp: Date.now() - Math.floor(Math.random() * 3600000),
      });
    }
    setFeed(initial);

    const interval = setInterval(() => {
      const id = nextIdRef.current++;
      const newItem: FeedItem = {
        id,
        address: MOCK_ADDRESSES[Math.floor(Math.random() * MOCK_ADDRESSES.length)],
        amount: randomAmount(),
        timestamp: Date.now(),
      };
      setFeed((f) => [newItem, ...f].slice(0, 15));
    }, 3000 + Math.random() * 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="live-feed">
      <div className="feed-header">
        <span className="feed-dot" />
        <h2>Live Contributions</h2>
      </div>
      <div className="feed-list">
        {feed.map((item, i) => (
          <div
            key={item.id}
            className={`feed-item ${i === 0 ? "feed-item-new" : ""}`}
          >
            <div className="feed-item-left">
              <div className="feed-avatar">
                {item.address.slice(2, 4).toUpperCase()}
              </div>
              <div className="feed-info">
                <span className="feed-address">{shortenAddress(item.address)}</span>
                <span className="feed-time">{getTimeAgo(item.timestamp)}</span>
              </div>
            </div>
            <div className="feed-amount">+{item.amount} ETH</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getTimeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}
