const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const MediloomFileStorage = await ethers.getContractFactory("MediloomFileStorage");

  const mediloomFileStorage = await MediloomFileStorage.deploy();
  await mediloomFileStorage.waitForDeployment();

  const contractAddress = await mediloomFileStorage.getAddress();
  console.log("✅ Contract deployed to:", contractAddress);

  // Correct way to get ABI
  const contractABI = JSON.parse(MediloomFileStorage.interface.formatJson());

  // Create folder if not exists
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  // Save deployment info
  const deploymentInfo = {
    address: contractAddress,
    abi: contractABI,
    deployedAt: new Date().toISOString(),
    network: "localhost"
  };

  fs.writeFileSync(
    path.join(deploymentsDir, "MediloomFileStorage.json"),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("📄 Deployment info saved to deployments/MediloomFileStorage.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error in deployment:", error);
    process.exit(1);
  });
