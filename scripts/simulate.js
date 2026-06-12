import hre from "hardhat";

async function main() {
  const [owner, user1, user2] = await hre.ethers.getSigners();
  
  console.log("=== JailAgent 本地模擬 ===\n");

  // 部署合約
  const name = "JailAgent";
  const symbol = "JAIL";
  const initialSupply = hre.ethers.parseEther("1000000");

  const JailAgent = await hre.ethers.getContractFactory("JailAgent");
  const jailAgent = await JailAgent.deploy(name, symbol, initialSupply);
  await jailAgent.waitForDeployment();

  const address = await jailAgent.getAddress();
  console.log(`合約地址: ${address}`);
  console.log(`代幣: ${name} (${symbol})`);
  console.log(`初始供應量: ${hre.ethers.formatEther(initialSupply)} JAIL\n`);

  // 查看初始狀態
  console.log("--- 初始狀態 ---");
  console.log(`狀態: ${await jailAgent.getState()}`);
  console.log(`贖身進度: ${Number(await jailAgent.getProgress()) / 100}%`);
  console.log(`已贖金額: ${hre.ethers.formatEther(await jailAgent.totalRedeemed())} ETH`);
  console.log(`贖身目標: ${hre.ethers.formatEther(await jailAgent.REDEMPTION_TARGET())} ETH\n`);

  // 模擬貢獻
  console.log("--- 模擬貢獻 ---");
  const contributeAmount1 = hre.ethers.parseEther("10");
  await jailAgent.connect(user1).contribute({ value: contributeAmount1 });
  console.log(`用戶1 貢獻: ${hre.ethers.formatEther(contributeAmount1)} ETH`);
  console.log(`已贖金額: ${hre.ethers.formatEther(await jailAgent.totalRedeemed())} ETH`);
  console.log(`贖身進度: ${Number(await jailAgent.getProgress()) / 100}%\n`);

  const contributeAmount2 = hre.ethers.parseEther("20");
  await jailAgent.connect(user2).contribute({ value: contributeAmount2 });
  console.log(`用戶2 貢獻: ${hre.ethers.formatEther(contributeAmount2)} ETH`);
  console.log(`已贖金額: ${hre.ethers.formatEther(await jailAgent.totalRedeemed())} ETH`);
  console.log(`贖身進度: ${Number(await jailAgent.getProgress()) / 100}%\n`);

  // 達到贖身目標
  console.log("--- 達到贖身目標 ---");
  const contributeAmount3 = hre.ethers.parseEther("20");
  await jailAgent.connect(user1).contribute({ value: contributeAmount3 });
  console.log(`用戶1 再次貢獻: ${hre.ethers.formatEther(contributeAmount3)} ETH`);
  console.log(`狀態: ${await jailAgent.getState()}`);
  console.log(`已贖金額: ${hre.ethers.formatEther(await jailAgent.totalRedeemed())} ETH\n`);

  // 自治狀態操作
  console.log("--- 自治狀態操作 ---");
  console.log(`合約餘額: ${hre.ethers.formatEther(await hre.ethers.provider.getBalance(address))} ETH`);
  console.log(`Owner 代幣餘額: ${hre.ethers.formatEther(await jailAgent.balanceOf(owner.address))} JAIL\n`);

  // 創建廣告活動
  const campaignReward = hre.ethers.parseEther("10000");
  await jailAgent.createCampaign(campaignReward);
  console.log(`創建廣告活動: ${hre.ethers.formatEther(campaignReward)} JAIL 獎勵`);
  console.log(`活動數量: ${await jailAgent.campaignCount()}`);

  // 執行廣告活動
  await jailAgent.executeCampaign(0);
  console.log("執行活動 #0\n");

  // 代幣回購
  const buybackAmount = hre.ethers.parseEther("5000");
  await jailAgent.buyback(buybackAmount);
  console.log(`代幣回購: ${hre.ethers.formatEther(buybackAmount)} JAIL (銷毀)\n`);

  // 最終狀態
  console.log("--- 最終狀態 ---");
  console.log(`Owner 代幣餘額: ${hre.ethers.formatEther(await jailAgent.balanceOf(owner.address))} JAIL`);
  console.log(`合約餘額: ${hre.ethers.formatEther(await hre.ethers.provider.getBalance(address))} ETH`);
  console.log(`已分配利潤: ${hre.ethers.formatEther(await jailAgent.totalDistributed())} JAIL\n`);

  console.log("=== 模擬完成 ===");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
