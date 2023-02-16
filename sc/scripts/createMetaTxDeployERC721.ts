import { ethers } from "hardhat";

async function main() {

  const signers = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  const targetRelayer = "0xf081791aA828f0f6470f9168610A7F2e80911476";
  const targetContract = "0x784384762f0E70EEE87289d4208B26b9b356cE22";
  const targetValue = "0";
  const targetGas = "1000000";
  const targetNonce = (await (await ethers.getContractFactory("Web9000Relayer")).attach(targetRelayer).getNonce(signers[0].address)).toString();
  const salt = (ethers.BigNumber.from(ethers.utils.randomBytes(32))).toString();
  const targetData = (await ethers.getContractFactory("Web9000Factory")).interface.encodeFunctionData("deployERC721", ["0xd53C26eeFeBd6fd58fd19485F5093d906f1b1A89", "TOKENC", "TOKENC", salt])

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
