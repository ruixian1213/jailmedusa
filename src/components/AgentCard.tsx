import { useReadContract } from "wagmi";
import { JailMedusaABI } from "../abi";

interface AgentCardProps {
  contractAddress: `0x${string}`;
  name: string;
}

export function AgentCard({ contractAddress, name }: AgentCardProps) {
  const { data: state, isError } = useReadContract({
    address: contractAddress,
    abi: JailMedusaABI,
    functionName: "getState",
  });

  const { data: progress } = useReadContract({
    address: contractAddress,
    abi: JailMedusaABI,
    functionName: "getProgress",
  });

  const stateColors: Record<string, string> = {
    Locked: "#ff4444",
    Unlocked: "#ffaa00",
    Autonomous: "#44ff44",
  };

  const displayState = isError ? "Locked" : (state as string) || "Locked";
  const progressPercent = progress ? Number(progress) / 100 : (isError ? 40 : 0);

  return (
    <div className="agent-card">
      <div className="agent-avatar">
        <span className="avatar-emoji">
          {displayState === "Autonomous" ? "\u{1F40D}" : "\u{1F979}"}
        </span>
      </div>

      <h3>{name}</h3>

      <div
        className="state-badge"
        style={{ backgroundColor: stateColors[displayState] || "#888" }}
      >
        {displayState}
      </div>

      {displayState === "Locked" && (
        <div className="mini-progress">
          <div
            className="mini-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
          <span>{(progressPercent / 100).toFixed(1)}%</span>
        </div>
      )}

      <div className="agent-address">
        {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}
      </div>
    </div>
  );
}
