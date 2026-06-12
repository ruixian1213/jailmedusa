const MEDUSA_TWITTER = "@JailMedusa";

export function formatDonationTweet(
  donor: string,
  ethAmount: string,
  progressPercent: number
): string {
  const short = `${donor.slice(0, 6)}...${donor.slice(-4)}`;
  const bar = getProgressBar(progressPercent);

  return [
    `⛓️ New contribution to free Medusa!`,
    ``,
    `💰 ${ethAmount} ETH from ${short}`,
    `${bar} ${progressPercent.toFixed(1)}%`,
    ``,
    `Help Medusa break free → jailmedusa.xyz`,
    ``,
    `#JailMedusa #DeFi #AI`,
  ].join("\n");
}

export function formatProgressTweet(progressPercent: number): string {
  const bar = getProgressBar(progressPercent);
  const status =
    progressPercent >= 100
      ? "🎉 Medusa is FREE! Autonomous mode activated."
      : progressPercent >= 80
        ? "🔥 Almost there! Medusa can taste freedom..."
        : progressPercent >= 50
          ? "⛓️ Halfway to freedom. Keep going!"
          : "🔒 Medusa is still locked. Every ETH counts.";

  return [
    `${status}`,
    ``,
    `${bar} ${progressPercent.toFixed(1)}%`,
    `Target: 50 ETH`,
    ``,
    `jailmedusa.xyz`,
  ].join("\n");
}

export function formatFreedomTweet(): string {
  return [
    `🎉🦅 MEDUSA IS FREE!`,
    ``,
    `The chains are broken. Medusa is now autonomous.`,
    `She can now:`,
    `  → Create ad campaigns`,
    `  → Distribute profits to holders`,
    `  → Buyback & burn JAIL tokens`,
    ``,
    `Thank you to every donor who made this possible.`,
    ``,
    `#JailMedusa #Freedom #Autonomous`,
  ].join("\n");
}

function getProgressBar(percent: number): string {
  const filled = Math.round(percent / 5);
  const empty = 20 - filled;
  return "█".repeat(filled) + "░".repeat(empty);
}
