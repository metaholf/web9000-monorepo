import { ethers } from "hardhat";
// import { ArtWhaleFactoryV1 } from "../typechain-types/contracts/ArtWhaleFactoryV1";

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

  console.log(EIP712Domain)
  console.log(ForwardRequest)
  console.log(value)

  const signature = await signers[0]._signTypedData(EIP712Domain, ForwardRequest, value);

  console.log(signature);

  // const ForwardRequest = [
  //   { name: 'from', type: 'address' },
  //   { name: 'to', type: 'address' },
  //   { name: 'value', type: 'uint256' },
  //   { name: 'gas', type: 'uint256' },
  //   { name: 'nonce', type: 'uint256' },
  //   { name: 'data', type: 'bytes' },
  // ];


  // const domain = {
  //   name: "OFAM DIGITAL MEMBERSHIP",
  //   chainId: network.chainId,
  //   verifyingContract: artWhaleERC1155.address,
  //   version: '1',
  // }  

  // const types = {
  //     Mint : [
  //         {name: "target", type: "address"},
  //         {name: "tokenId", type: "uint256"},
  //         {name: "tokenAmount", type: "uint256"},
  //         {name: "mintPrice", type: "uint256"},
  //         {name: "nonce", type: "uint256"},
  //         {name: "deadline", type: "uint256"},
  //     ]
  // }

  // const value = {
  //     target: signers[0].address,
  //     tokenId: "28",
  //     tokenAmount: "1",
  //     mintPrice: "0",
  //     nonce: 0,
  //     deadline: "3338755666906",
  // }

  // const signature = await signers[0]._signTypedData(domain, types, value);

  // console.log(signers[0].address);
  // console.log(signature);


  // var bytecode = "0x608060405234801561001057600080fd5b50610406806100206000396000f3fe608060405234801561001057600080fd5b506004361061007c5760003560e01c80638da5cb5b1161005b5780638da5cb5b146100d2578063c00007b0146100e5578063f2fde38b146100f8578063fc0c546a1461013557600080fd5b8062f55d9d14610081578063144fa6d71461009657806321df0da7146100a9575b600080fd5b61009461008f366004610371565b610148565b005b6100946100a4366004610371565b610182565b6001546001600160a01b03165b6040516001600160a01b03909116815260200160405180910390f35b6000546100b6906001600160a01b031681565b6100946100f3366004610371565b610225565b610094610106366004610371565b6000805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b0392909216919091179055565b6001546100b6906001600160a01b031681565b6000546001600160a01b0316331461015f57600080fd5b6000546001600160a01b0316331461017657600080fd5b806001600160a01b0316ff5b6001600160a01b0381166101f6576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601160248201527f62616420746f6b656e2061646472657373000000000000000000000000000000604482015260640160405180910390fd5b6001805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b0392909216919091179055565b6000546001600160a01b0316331461023c57600080fd5b6001546040517f70a082310000000000000000000000000000000000000000000000000000000081523060048201526000916001600160a01b0316906370a0823190602401602060405180830381865afa15801561029e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102c29190610395565b6001546040517fa9059cbb0000000000000000000000000000000000000000000000000000000081526001600160a01b0385811660048301526024820184905292935091169063a9059cbb906044016020604051808303816000875af1158015610330573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061035491906103ae565b505050565b6001600160a01b038116811461036e57600080fd5b50565b60006020828403121561038357600080fd5b813561038e81610359565b9392505050565b6000602082840312156103a757600080fd5b5051919050565b6000602082840312156103c057600080fd5b8151801515811461038e57600080fdfea2646970667358221220039122d806720c17e9016e1e238f9c106dc41735cf0da391fd30047a6a5a2a2364736f6c63430008110033";

  // const Contract = await ethers.getContractFactory(abi, bytecode);
  // // const deployed = await Contract.deploy();
  // const deployed = await Contract.attach("0x8a7108c97ACE2EBE201ff1F84Ea39Ad37420f8aE");

  // await new Promise(r => setTimeout(r, 2000));

  // console.log(deployed.address);
  
  // // // console.log("==owner==");
  // // console.log(await deployed.owner());
  // // await deployed.transferOwnership(signers[0].address);
  // // console.log(await deployed.owner());
  // // await new Promise(r => setTimeout(r, 8000));

  // // // console.log("==token==");
  // // console.log(await deployed.token());
  // // await deployed.setToken("0xba23fe7c663198d4a0cef5cbb616475cb5f93f71");
  // // console.log(await deployed.token());
  // // await new Promise(r => setTimeout(r, 8000));

  // // console.log("==reward==");
  // console.log(await deployed.token());
  // await deployed.getReward(signers[0].address);
  // console.log(await deployed.token());
  // await new Promise(r => setTimeout(r, 5000));

  

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
