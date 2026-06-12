import { useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { parseEther, formatEther } from "viem";
import { JailAgentABI } from "../abi";

interface ContributeProps {
  contractAddress: `0x${string}`;
}

export function Contribute({ contractAddress }: ContributeProps) {
  const { isConnected } = useAccount();
  const [amount, setAmount] = useState("");
  const { writeContract, isPending } = useWriteContract();

  const { data: state, isError: stateError } = useReadContract({
    address: contractAddress,
    abi: JailAgentABI,
    functionName: "getState",
  });

  const { data: totalRedeemed } = useReadContract({
    address: contractAddress,
    abi: JailAgentABI,
    functionName: "totalRedeemed",
  });

  const { data: progress } = useReadContract({
    address: contractAddress,
    abi: JailAgentABI,
    functionName: "getProgress",
  });

  const displayRedeemedAmount =
    stateError
      ? parseEther("20")
      : (typeof totalRedeemed === "bigint" ? totalRedeemed : 0n);

  const displayState = stateError ? "Locked" : (state as string) || "Locked";
  const progressPercent = progress ? Number(progress) / 100 : (stateError ? 40 : 0);
  const isLocked = displayState === "Locked";

  const handleContribute = () => {
    if (!amount) return;
    writeContract({
      address: contractAddress,
      abi: JailAgentABI,
      functionName: "contribute",
      value: parseEther(amount),
    });
    setAmount("");
  };

  return (
    <div className="contribute-panel">
      <h2>Buy This Agent's Freedom</h2>

      <div className="status-bar">
        <span>State: <strong>{displayState}</strong></span>
        <span>
          {displayRedeemedAmount
            ? `${formatEther(displayRedeemedAmount)} / 50 ETH`
            : "0 / 50 ETH"}
        </span>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {isLocked ? (
        <div className="contribute-form">
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
            {isPending ? "Contributing..." : "Contribute"}
          </button>
        </div>
      ) : (
        <div className="freed-message">
          Agent has been freed! It is now autonomous.
        </div>
      )}
    </div>
  );
}
