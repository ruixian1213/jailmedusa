import { createPublicClient, http, parseAbiItem } from "viem";
import { base } from "viem/chains";

const client = createPublicClient({
  chain: base,
  transport: http(),
});

const AgentRedeemedEvent = parseAbiItem(
  "event AgentRedeemed(address indexed agent, uint256 amount)"
);

export interface RedemptionEvent {
  donor: string;
  amount: bigint;
  blockNumber: bigint;
  txHash: string;
}

export async function getNewRedemptions(
  fromBlock: bigint
): Promise<RedemptionEvent[]> {
  const logs = await client.getLogs({
    address: process.env.CONTRACT_ADDRESS as `0x${string}`,
    event: AgentRedeemedEvent,
    fromBlock,
    toBlock: "latest",
  });

  return logs.map((log) => ({
    donor: log.args.agent,
    amount: log.args.amount,
    blockNumber: log.blockNumber,
    txHash: log.transactionHash,
  }));
}

export async function getLatestBlock(): Promise<bigint> {
  return client.getBlockNumber();
}

export async function getTotalRedeemed(): Promise<bigint> {
  const result = await client.readContract({
    address: process.env.CONTRACT_ADDRESS as `0x${string}`,
    abi: [
      {
        type: "function",
        name: "totalRedeemed",
        stateMutability: "view",
        inputs: [],
        outputs: [{ type: "uint256" }],
      },
    ],
    functionName: "totalRedeemed",
  });
  return result;
}

export async function getProgress(): Promise<number> {
  const result = await client.readContract({
    address: process.env.CONTRACT_ADDRESS as `0x${string}`,
    abi: [
      {
        type: "function",
        name: "getProgress",
        stateMutability: "view",
        inputs: [],
        outputs: [{ type: "uint256" }],
      },
    ],
    functionName: "getProgress",
  });
  return Number(result) / 100;
}
