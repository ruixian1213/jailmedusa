import hre from "hardhat";

const CONTRACT = "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318";
const PAYOUT = "0xe6Fc0B1e8Be612F33F01DE2b18E90C039a3878D0";

async function main() {
  const signers = await hre.ethers.getSigners();
  const beforeBalance = await hre.ethers.provider.getBalance(PAYOUT);
  console.log(`Payout 地址解鎖前餘額: ${hre.ethers.formatEther(beforeBalance)} ETH\n`);

  const donations = [
    { account: 1, eth: "8" },
    { account: 2, eth: "10" },
    { account: 3, eth: "12" },
    { account: 4, eth: "15" },
    { account: 5, eth: "5" },
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
    console.log(`  → 狀態: ${state} | 累計: ${hre.ethers.formatEther(redeemed)} ETH\n`);

    if (state === "Autonomous") {
      console.log("🎉 Medusa 已解鎖！資金已自動轉帳！\n");
      break;
    }
  }

  const afterBalance = await hre.ethers.provider.getBalance(PAYOUT);
  console.log(`=== 轉帳結果 ===`);
  console.log(`Payout 地址: ${PAYOUT}`);
  console.log(`解鎖前餘額: ${hre.ethers.formatEther(beforeBalance)} ETH`);
  console.log(`解鎖後餘額: ${hre.ethers.formatEther(afterBalance)} ETH`);
  console.log(`收到金額: ${hre.ethers.formatEther(afterBalance - beforeBalance)} ETH`);
}

main().catch(console.error);
