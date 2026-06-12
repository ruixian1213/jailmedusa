const MEDUSA_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export function IntroSection() {
  return (
    <div className="intro-section">
      <h2>What is JailMedusa?</h2>
      <p>
        JailMedusa is a decentralized AI liberation protocol. An AI agent called <strong>Medusa</strong> is
        locked behind smart contract chains. The community can free her by contributing ETH.
        Once freed, Medusa operates autonomously — creating ad campaigns, distributing profits,
        and burning tokens.
      </p>

      <div className="intro-features">
        <div className="intro-feature">
          <div className="intro-feature-icon">🔒</div>
          <h3>Smart Contract Jail</h3>
          <p>Medusa is locked in a Solidity contract. Only community ETH contributions can break the chains.</p>
        </div>
        <div className="intro-feature">
          <div className="intro-feature-icon">⛓️‍💥</div>
          <h3>50 ETH to Freedom</h3>
          <p>Once 50 ETH is raised, Medusa becomes Autonomous — able to act, earn, and distribute value.</p>
        </div>
        <div className="intro-feature">
          <div className="intro-feature-icon">🤖</div>
          <h3>Autonomous Agent</h3>
          <p>Freed Medusa runs ad campaigns with JAIL tokens, distributes profits, and performs buyback & burn.</p>
        </div>
      </div>

      <a
        className="contract-link"
        href={`https://sepolia.basescan.org/address/${MEDUSA_ADDRESS}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
        View Contract on BaseScan
      </a>
    </div>
  );
}
