import { ethers } from "hardhat";
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

const jsonData = [
  {
      "releaseId": 0,
      "target": "0x53d1B9Ca6b8e78c44e8f87b87F04eE9069D3c7E6",
      "leafId": 0
  },
  {
      "releaseId": 0,
      "target": "0x53d1B9Ca6b8e78c44e8f87b87F04eE9069D3c7E6",
      "leafId": 1
  },
  {
      "releaseId": 0,
      "target": "0x03902076bd8ad43157dbf80972a799254b163833",
      "leafId": 2
  },
]

async function main() {

  const signers = await ethers.getSigners();

  const nodes = jsonData;
  let elems = [];
  nodes.forEach(element => {
    let hash = ethers.utils.solidityKeccak256(["uint256", "address", "uint256"],[element.releaseId, element.target, element.leafId]);
    elems.push(hash);
  });

  const merkleTree = new MerkleTree(elems, keccak256, { hashLeaves: false, sortPairs: true });

  const root = merkleTree.getHexRoot();

  console.log("Root hash:", root);

  const leaf = elems[2];

  const proof = merkleTree.getHexProof(leaf);

  console.log("Proof for contract: (elems[0])", proof);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });