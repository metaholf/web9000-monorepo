import { ethers } from "hardhat";

async function main() {

  const signers = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  const targetRelayer = "0xf081791aA828f0f6470f9168610A7F2e80911476";
  const targetContract = "0x1079899b43c6ca901996e4f6c3bd03724b2ec08d";
  const targetValue = "0";
  const targetGas = "1000000";
  const targetNonce = (await (await ethers.getContractFactory("Web9000Relayer")).attach(targetRelayer).getNonce(signers[0].address)).toString();
  const targetData = (await ethers.getContractFactory("Web9000ERC721")).interface.encodeFunctionData("mint", ["0", "0", ["0xe261769c8b53fe0ca612579e5c47a4cfb43aeb610fada0e1cd9b3d4ed1fa9b1b", "0x56fa3d3015b252b76a15c6dfa5ece8bc23ab7a34bd830a98f53826fcc32acea4"]]);

  const EIP712Domain = {
    name: "MinimalForwarder",
    chainId: network.chainId,
    verifyingContract: targetRelayer,
    version: '0.0.1',
  }  

  const ForwardRequest = {
    ForwardRequest : [
    { name: 'from', type: 'address' },
    { name: 'to', type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'gas', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
    { name: 'data', type: 'bytes' },
    ]
  }

  const value = {
    from: signers[0].address,
    to: targetContract,
    value: targetValue,
    gas: targetGas,
    nonce: targetNonce,
    data: targetData,
  }

  console.log(value)

  const signature = await signers[0]._signTypedData(EIP712Domain, ForwardRequest, value);

  console.log(signature);  

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
