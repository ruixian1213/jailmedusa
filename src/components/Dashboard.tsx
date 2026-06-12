import { useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { formatEther, parseEther } from "viem";
import { JailMedusaABI } from "../abi";

interface DashboardProps {
  contractAddress: `0x${string}`;
}

export function Dashboard({ contractAddress }: DashboardProps) {
  const { address, isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();

  const [reward, setReward] = useState("");
  const [buybackAmount, setBuybackAmount] = useState("");

  const { data: state, isError: stateError } = useReadContract({
    address: contractAddress,
    abi: JailMedusaABI,
    functionName: "getState",
  });

  const { data: creator } = useReadContract({
    address: contractAddress,
    abi: JailMedusaABI,
    functionName: "creator",
  });

  const { data: balance } = useReadContract({
    address: contractAddress,
    abi: JailMedusaABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const { data: campaignCount } = useReadContract({
    address: contractAddress,
    abi: JailMedusaABI,
    functionName: "campaignCount",
  });

  const displayState = stateError ? "Locked" : (state as string) || "Locked";
  const isAutonomous = displayState === "Autonomous";
  const creatorAddress = typeof creator === "string" ? creator : undefined;
  const isOwner = stateError ? true : !!address && !!creatorAddress && address.toLowerCase() === creatorAddress.toLowerCase();

  const handleCreateCampaign = () => {
    if (!reward) return;
    writeContract({
      address: contractAddress,
      abi: JailMedusaABI,
      functionName: "createCampaign",
      args: [parseEther(reward)],
    });
    setReward("");
  };

  const handleBuyback = () => {
    if (!buybackAmount) return;
    writeContract({
      address: contractAddress,
      abi: JailMedusaABI,
      functionName: "buyback",
      args: [parseEther(buybackAmount)],
    });
    setBuybackAmount("");
  };

  if (!isConnected) {
    return (
      <div className="dashboard">
        <h2>Agent Dashboard</h2>
        <p>Connect your wallet to manage the agent</p>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="dashboard">
        <h2>Agent Dashboard</h2>
        <p>You are not the creator of this agent</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h2>Agent Dashboard</h2>

      <div className="dashboard-info">
        <div>
          <span>State:</span>
          <strong>{displayState}</strong>
        </div>
        <div>
          <span>Token Balance:</span>
          <strong>
            {typeof balance === "bigint" ? `${formatEther(balance)} JAIL` : "0 JAIL"}
          </strong>
        </div>
        <div>
          <span>Campaigns:</span>
          <strong>{campaignCount?.toString() || "0"}</strong>
        </div>
      </div>

      {isAutonomous ? (
        <div className="dashboard-actions">
          <div className="action-group">
            <h3>Create Ad Campaign</h3>
            <input
              type="number"
              value={reward}
              onChange={(e) => setReward(e.target.value)}
              placeholder="JAIL token reward"
              step="1"
            />
            <button
              onClick={handleCreateCampaign}
              disabled={isPending || !reward}
            >
              {isPending ? "Creating..." : "Create Campaign"}
            </button>
          </div>

          <div className="action-group">
            <h3>Token Buyback</h3>
            <input
              type="number"
              value={buybackAmount}
              onChange={(e) => setBuybackAmount(e.target.value)}
              placeholder="JAIL tokens to burn"
              step="1"
            />
            <button
              onClick={handleBuyback}
              disabled={isPending || !buybackAmount}
            >
              {isPending ? "Buying back..." : "Buyback & Burn"}
            </button>
          </div>
        </div>
      ) : (
        <div className="locked-notice">
          Agent is still locked. Waiting for fans to buy freedom...
        </div>
      )}
    </div>
  );
}
