import { ethers } from "ethers";
import contractData from "../blockchain/deployments/MediloomFileStorage.json";

const PRIVATE_KEY = "0x8be89c15ee6ce407137104b624440d4f1dea5e276539aab098c8aa013bfbc5e0"; // 🔐 From Ganache
const GANACHE_RPC = "http://127.0.0.1:7545"; // Ganache default

export async function connectContract() {
  try {
    const provider = new ethers.JsonRpcProvider(GANACHE_RPC);
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);

    const contract = new ethers.Contract(
      contractData.address,
      contractData.abi,
      signer
    );
    console.log("🔗 Using contract address:", contractData.address);

    console.log("✅ Connected to contract with direct signer");
    return contract;
  } catch (error) {
    console.error("❌ Contract connection failed:", error);
    return null;
  }
}
