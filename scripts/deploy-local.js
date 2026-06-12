import hre from "hardhat";

async function main() {
  const [owner] = await hre.ethers.getSigners();
  
  const name = "JailAgent";
  const symbol = "JAIL";
  const initialSupply = hre.ethers.parseEther("1000000");

  const JailAgent = await hre.ethers.getContractFactory("JailAgent");
  
  // Deploy 3 agents
  const agents = [];
  for (let i = 1; i <= 3; i++) {
    const agent = await JailAgent.deploy(name, symbol, initialSupply);
    await agent.waitForDeployment();
    const addr = await agent.getAddress();
    agents.push({ name: `Agent ${i}`, address: addr });
    console.log(`Agent ${i} deployed to: ${addr}`);
  }

  console.log("\n=== Update src/App.tsx MOCK_AGENTS with these addresses ===");
  console.log(JSON.stringify(agents, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
