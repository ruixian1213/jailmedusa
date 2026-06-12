import hre from "hardhat";

async function main() {
  const name = "JailAgent";
  const symbol = "JAIL";
  const initialSupply = hre.ethers.parseEther("1000000");

  const JailAgent = await hre.ethers.getContractFactory("JailAgent");
  const jailAgent = await JailAgent.deploy(name, symbol, initialSupply);
  await jailAgent.waitForDeployment();

  const address = await jailAgent.getAddress();
  console.log(`JailAgent deployed to: ${address}`);
  console.log(`Token: ${name} (${symbol})`);
  console.log(`Initial supply: ${hre.ethers.formatEther(initialSupply)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
