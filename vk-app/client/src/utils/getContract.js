import { ethers } from 'ethers'

export const getContract = (address, abi) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  let signer = provider.getSigner();

  return new ethers.Contract(address, abi, signer);
}