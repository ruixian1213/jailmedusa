import type { VercelRequest, VercelResponse } from "@vercel/node";
import { postTweet } from "../lib/x.js";
import {
  getNewRedemptions,
  getLatestBlock,
  getProgress,
  getTotalRedeemed,
} from "../lib/chain.js";
import {
  formatDonationTweet,
  formatProgressTweet,
  formatFreedomTweet,
} from "../lib/medusa.js";

// Simple in-memory state (reset on cold start, fine for cron)
let lastProcessedBlock = 0n;
let wasAutonomous = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const results: string[] = [];

  try {
    const currentBlock = await getLatestBlock();

    if (lastProcessedBlock === 0n) {
      lastProcessedBlock = currentBlock - 100n;
    }

    // 1. Check for new donations
    const newRedemptions = await getNewRedemptions(lastProcessedBlock);
    for (const redemption of newRedemptions) {
      const ethAmount = formatEth(redemption.amount);
      const progress = await getProgress();
      const tweet = formatDonationTweet(redemption.donor, ethAmount, progress);
      const tweetId = await postTweet(tweet);
      if (tweetId) results.push(`Donation tweet: ${tweetId}`);
    }

    // 2. Check progress and post updates periodically
    const progress = await getProgress();
    const isAutonomous = progress >= 100;

    if (isAutonomous && !wasAutonomous) {
      // Just became free!
      const tweet = formatFreedomTweet();
      const tweetId = await postTweet(tweet);
      if (tweetId) results.push(`Freedom tweet: ${tweetId}`);
      wasAutonomous = true;
    } else if (!isAutonomous) {
      // Post progress update every ~10% milestone
      const milestones = [10, 20, 30, 40, 50, 60, 70, 80, 90];
      const currentMilestone = milestones.find((m) => {
        const prev = m - 5;
        return progress >= prev && progress < m + 5;
      });
      if (currentMilestone && Math.abs(progress - currentMilestone) < 2) {
        const tweet = formatProgressTweet(progress);
        const tweetId = await postTweet(tweet);
        if (tweetId) results.push(`Progress tweet: ${tweetId}`);
      }
    }

    lastProcessedBlock = currentBlock;

    return res.status(200).json({
      ok: true,
      block: currentBlock.toString(),
      newDonations: newRedemptions.length,
      progress: progress.toFixed(1) + "%",
      tweets: results,
    });
  } catch (err: any) {
    console.error("Cron error:", err);
    return res.status(500).json({ error: err.message });
  }
}

function formatEth(wei: bigint): string {
  const eth = Number(wei) / 1e18;
  return eth.toFixed(2);
}
