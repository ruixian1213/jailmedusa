import hre from "hardhat";

const CONTRACT = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

async function main() {
  const signers = await hre.ethers.getSigners();

  const donations = [
    { account: 10, eth: "3.0" },
    { account: 11, eth: "5.0" },
    { account: 12, eth: "2.5" },
    { account: 13, eth: "4.0" },
    { account: 14, eth: "2.0" },
  ];

  for (const { account, eth } of donations) {
    const signer = signers[account];
    const contract = await hre.ethers.getContractAt("JailMedusa", CONTRACT, signer);
    const value = hre.ethers.parseEther(eth);

    console.log(`帳戶 ${account} 捐贈 ${eth} ETH...`);
    const tx = await contract.contribute({ value });
    await tx.wait();

    const state = await contract.getState();
    const redeemed = await contract.totalRedeemed();
    const progress = await contract.getProgress();
    console.log(`  → 狀態: ${state} | 累計: ${hre.ethers.formatEther(redeemed)} ETH | 進度: ${Number(progress) / 100}%\n`);

    if (state === "Autonomous") {
      console.log("🎉 Medusa 已解鎖！進入自治模式！");
      break;
    }
  }

  const contract = await hre.ethers.getContractAt("JailMedusa", CONTRACT, signers[0]);
  const finalState = await contract.getState();
  const finalRedeemed = await contract.totalRedeemed();
  console.log(`=== 最終狀態: ${finalState} | 累計: ${hre.ethers.formatEther(finalRedeemed)} ETH ===`);
}

main().catch(console.error);
