import hre from "hardhat";

const CONTRACT = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

async function main() {
  const signers = await hre.ethers.getSigners();
  const creator = signers[0];

  const contract = await hre.ethers.getContractAt("JailMedusa", CONTRACT, creator);

  console.log("=== 測試 Autonomous 功能 ===\n");

  // 1. 查詢合約狀態
  const state = await contract.getState();
  const tokenBalance = await contract.balanceOf(creator.address);
  console.log(`狀態: ${state}`);
  console.log(`Creator Token 餘額: ${hre.ethers.formatEther(tokenBalance)} JAIL\n`);

  // 2. 建立 Ad Campaign
  console.log("--- 建立 Ad Campaign ---");
  const campaignReward = hre.ethers.parseEther("10000");
  const tx1 = await contract.createCampaign(campaignReward);
  await tx1.wait();
  console.log(`✓ Campaign #0 已建立 (獎勵: 10,000 JAIL)`);

  const tx2 = await contract.createCampaign(hre.ethers.parseEther("5000"));
  await tx2.wait();
  console.log(`✓ Campaign #1 已建立 (獎勵: 5,000 JAIL)\n`);

  const campaignCount = await contract.campaignCount();
  console.log(`總 Campaign 數: ${campaignCount}\n`);

  // 3. 執行 Campaign
  console.log("--- 執行 Campaign ---");
  const tx3 = await contract.executeCampaign(0);
  await tx3.wait();
  console.log(`✓ Campaign #0 已執行\n`);

  // 4. 分配利潤
  console.log("--- 分配利潤 ---");
  const recipients = [signers[5].address, signers[6].address, signers[7].address];
  const amounts = [
    hre.ethers.parseEther("1000"),
    hre.ethers.parseEther("2000"),
    hre.ethers.parseEther("1500"),
  ];
  const tx4 = await contract.distributeProfits(amounts, recipients);
  await tx4.wait();
  console.log(`✓ 利潤已分配:`);
  console.log(`  ${signers[5].address.slice(0, 10)}... → 1,000 JAIL`);
  console.log(`  ${signers[6].address.slice(0, 10)}... → 2,000 JAIL`);
  console.log(`  ${signers[7].address.slice(0, 10)}... → 1,500 JAIL\n`);

  // 5. Buyback & Burn
  console.log("--- Buyback & Burn ---");
  const burnAmount = hre.ethers.parseEther("5000");
  const tx5 = await contract.buyback(burnAmount);
  await tx5.wait();
  console.log(`✓ 已回購並銷毀 5,000 JAIL\n`);

  // 最終狀態
  const finalBalance = await contract.balanceOf(creator.address);
  console.log("=== 測試完成 ===");
  console.log(`Creator 最終 Token 餘額: ${hre.ethers.formatEther(finalBalance)} JAIL`);
}

main().catch(console.error);
