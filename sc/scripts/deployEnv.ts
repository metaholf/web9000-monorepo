import { ethers } from "hardhat";
import { tryVerify } from "../helpers/tryVerify";

async function main() {

  const Web9000Relayer = await ethers.getContractFactory("Web9000Relayer");
  const relayer = await Web9000Relayer.deploy();
  console.log("Web9000Relayer deployed: ", relayer.address);

  if (ethers.provider.network.chainId != 31337) { await new Promise(r => setTimeout(r, 20000)); await tryVerify(relayer.address); }

  const Web9000Factory = await ethers.getContractFactory("Web9000Factory");
  const factory = await Web9000Factory.deploy(relayer.address);
  console.log("Web9000Factory deployed: ", factory.address);
  if (ethers.provider.network.chainId != 31337) { await new Promise(r => setTimeout(r, 20000)); await tryVerify(factory.address, [relayer.address]); }

  const Web9000ERC721 = await ethers.getContractFactory("Web9000ERC721");
  const impl = await Web9000ERC721.deploy();
  console.log("erc721 implementation deployed: ", impl.address);
  if (ethers.provider.network.chainId != 31337) { await new Promise(r => setTimeout(r, 20000)); await tryVerify(impl.address); }


  console.log("=====");
  console.log("Web9000Relayer deployed: ", relayer.address);
  console.log("Web9000Factory deployed: ", factory.address);
  console.log("erc721 implementation deployed: ", impl.address);
  console.log("ALL OK");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
