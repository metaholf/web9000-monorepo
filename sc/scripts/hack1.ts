import { ethers } from "hardhat";
// import { ArtWhaleFactoryV1 } from "../typechain-types/contracts/ArtWhaleFactoryV1";

async function main() {

  const signers = await ethers.getSigners();

  // console.log(ethers.BigNumber.from("0x601d6d581d384247d50dfab91fb71f23d7f496f66b7fc690289d6a6537cc321d"))
  console.log(signers)
  const signature = await signers[0].signMessage(ethers.BigNumber.from("0xfba79a3d9635133ad5ad59694fbb28443249088da00c2c6ed0e58d7a578ed258"))
  // const signature = await signers[0].signMessage("0xb88702dd17e6964e1ebd4f77ecb633f4c388b327afb991efb1ef208159e91fe1")
  console.log(signature);
  console.log(signers[0].address);

  // ethers.Wallet.
// 0xaedfd90fa2f6139b72901923e6bca2a611f5fc482250859a51e48bf1f12ee0dd60cf7a62b1a73fdb8acbe87133ea323cfa1d99fc6f4074659b9f4cf1cc9c86d91c
  // 0x1ecc23578b9f695dfba59dab038a8d12de216d83bd2c23ea27ee0257ee36e94d623f6c003268dd23a09f215d3089187a1d466bfab9bdba90d8a57a02d91abe8e1c
  // 0xa8367fd49f854770b1ef32ee3955f1e34d41e266cccbad1e4d41b3d4219d6ff327c31381018f5fddd630e5aa65037b6931c23a0893a7012cf0939df8031115031c
  // 0xf7aa26f2f63c0da32eda21f97ec9c2bc8981509878c0d62ea70f28ea9cd994b04002f16f1f7c9979ec54e2b7f819d3b81d03f4277db4b76fe3e3ebf4221dfddd1b

  // 0x1ecc23578b9f695dfba59dab038a8d12de216d83bd2c23ea27ee0257ee36e94d
  // 0x623f6c003268dd23a09f215d3089187a1d466bfab9bdba90d8a57a02d91abe8e
  // 0x1c
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });



  // import { ethers } from 'hardhat'
  // import { Bank2__factory, BankAttack__factory } from '../typechain'
  // import { ETH_RPC } from '../secrets.config'
  // import { BNToNumstr } from '../gotbit-tools/hardhat/extensions/bignumber'
  
  // import * as dotenv from 'dotenv'
  // dotenv.config()
  
  // const bankInstanceAddr = "0x866d0461173957Aeb968BF431eaa6A3c9157BE92"
  // const attackAddr = "0x85656ddf9a78d5492e707446C7F1ED07F4bF9c81"
  
  // const providerETH = new ethers.providers.JsonRpcProvider(ETH_RPC)
  
  // async function hack() {
  //   const signer = new ethers.Wallet("1e0d463e0755a9d55c9956d26f991f067bebb7aa92c11c784bb9c3ccb1ad91bc", providerETH);
  //   const attackSigner = BankAttack__factory.connect(attackAddr, signer)
  //   console.log(BNToNumstr(await providerETH.getBalance(bankInstanceAddr), 18, 4));
  //   await (await attackSigner.hack1({value: ethers.utils.parseEther("0.005")})).wait()
  //   console.log(BNToNumstr(await providerETH.getBalance(bankInstanceAddr), 18, 4));
  //   await (await attackSigner.hack2({value: ethers.utils.parseEther("0.005")})).wait()
  //   console.log(BNToNumstr(await providerETH.getBalance(bankInstanceAddr), 18, 4));
  //   const bankSigner = Bank2__factory.connect(bankInstanceAddr, signer)
  //   console.log(await bankSigner.completed());
  //   await (await bankSigner.setCompleted(true)).wait()
  //   console.log(await bankSigner.completed());
  // }
  
  // hack()
  //   .then(() => process.exit(0))
  //   .catch((error) => {
  //     console.error(error)
  //     process.exit(1)
  //   })