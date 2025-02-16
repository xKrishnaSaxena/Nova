import { ethers } from "ethers";
import { abi } from "./abi";
import { tokenABI } from "./abiv2";
declare global {
  interface Window {
    ethereum?: any;
  }
}

const factoryAddress: string = "FACTORY_TOKEN_ADDRESS";

export async function createERC20Token(
  name: string,
  symbol: string
): Promise<string> {
  if (!window.ethereum) {
    throw new Error("MetaMask is required!");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  console.log(provider);
  const signer = await provider.getSigner();
  console.log(signer);
  const contract = new ethers.Contract(factoryAddress, abi, signer);
  console.log(contract);

  try {
    const tx = await contract.createToken(name, symbol);
    console.log(tx);
    const receipt = await tx.wait();
    console.log(receipt);
    const event = receipt.logs.find((log: any) =>
      log.topics.includes(
        ethers.id("TokenCreated(address,address,string,string)")
      )
    );

    if (!event) {
      throw new Error("Token creation event not found.");
    }

    const tokenAddress = ethers.getAddress(event.topics[2]);
    console.log(`Token created at: ${tokenAddress}`);
    return tokenAddress;
  } catch (error) {
    console.error("Error creating token:", error);
    throw error;
  }
}

export async function mintTokens(
  tokenAddress: string,
  recipient: string,
  amount: number
): Promise<void> {
  if (!window.ethereum) {
    throw new Error("MetaMask is required!");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(tokenAddress, abi, signer);

  try {
    const tx = await contract.mint(recipient, ethers.toBigInt(amount));
    await tx.wait();
    console.log("Tokens minted successfully!");
  } catch (error) {
    console.error("Error minting tokens:", error);
    throw error;
  }
}

export async function burnTokens(
  tokenAddress: string,
  amount: number
): Promise<void> {
  if (!window.ethereum) {
    throw new Error("MetaMask is required!");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(tokenAddress, abi, signer);

  try {
    const tx = await contract.burn(ethers.toBigInt(amount));
    await tx.wait();
    console.log("Tokens burned successfully!");
  } catch (error) {
    console.error("Error burning tokens:", error);
    throw error;
  }
}

export async function transferTokens(
  tokenAddress: string,
  recipient: string,
  amount: number
): Promise<void> {
  if (!window.ethereum) {
    throw new Error("MetaMask is required!");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(tokenAddress, abi, signer);

  try {
    const tx = await contract.transfer(recipient, ethers.toBigInt(amount));
    await tx.wait();
    console.log(`Successfully transferred ${amount} tokens to ${recipient}`);
  } catch (error) {
    console.error("Error transferring tokens:", error);
    throw error;
  }
}
export async function setMintAuthority(
  tokenAddress: string,
  newAuthority: string
): Promise<void> {
  if (!window.ethereum) throw new Error("MetaMask required!");

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);

  try {
    const tx = await tokenContract.setMintAuthority(newAuthority);
    await tx.wait();
    console.log("Mint authority updated");
  } catch (error) {
    console.error("Error updating mint authority:", error);
    throw error;
  }
}

export async function setFreezeAuthority(
  tokenAddress: string,
  newAuthority: string
): Promise<void> {
  if (!window.ethereum) throw new Error("MetaMask required!");

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);

  try {
    const tx = await tokenContract.setFreezeAuthority(newAuthority);
    await tx.wait();
    console.log("Freeze authority updated");
  } catch (error) {
    console.error("Error updating freeze authority:", error);
    throw error;
  }
}

export async function freezeAccount(
  tokenAddress: string,
  account: string
): Promise<void> {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);

  try {
    const tx = await tokenContract.freeze(account);
    await tx.wait();
    console.log("Account frozen");
  } catch (error) {
    console.error("Freeze error:", error);
    throw error;
  }
}

export async function unfreezeAccount(
  tokenAddress: string,
  account: string
): Promise<void> {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);

  try {
    const tx = await tokenContract.unfreeze(account);
    await tx.wait();
    console.log("Account unfrozen");
  } catch (error) {
    console.error("UnFreeze error:", error);
    throw error;
  }
}
