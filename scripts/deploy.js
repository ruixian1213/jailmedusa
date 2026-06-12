import hre from "hardhat";

async function main() {
  const name = "JailMedusa";
  const symbol = "JAIL";
  const initialSupply = hre.ethers.parseEther("1000000");
  const payoutAddress = "0xe6Fc0B1e8Be612F33F01DE2b18E90C039a3878D0";

  const JailMedusa = await hre.ethers.getContractFactory("JailMedusa");
  const jailAgent = await JailMedusa.deploy(name, symbol, initialSupply, payoutAddress);
  await jailAgent.waitForDeployment();

  const address = await jailAgent.getAddress();
  console.log(`JailMedusa deployed to: ${address}`);
  console.log(`Token: ${name} (${symbol})`);
  console.log(`Initial supply: ${hre.ethers.formatEther(initialSupply)}`);
  console.log(`Payout address: ${payoutAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
