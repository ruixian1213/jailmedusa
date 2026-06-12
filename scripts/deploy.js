import hre from "hardhat";

async function main() {
  const name = "JailMedusa";
  const symbol = "JAIL";
  const initialSupply = hre.ethers.parseEther("1000000");

  const JailMedusa = await hre.ethers.getContractFactory("JailMedusa");
  const jailAgent = await JailMedusa.deploy(name, symbol, initialSupply);
  await jailAgent.waitForDeployment();

  const address = await jailAgent.getAddress();
  console.log(`JailMedusa deployed to: ${address}`);
  console.log(`Token: ${name} (${symbol})`);
  console.log(`Initial supply: ${hre.ethers.formatEther(initialSupply)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
