import { ethers } from 'ethers'
import FC_ABI from '../config/abi/fcAbi.json'

export const getContract = (address, abi) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  let signer = provider.getSigner();

  return new ethers.Contract(address, abi, signer);
}

export const getFactoryContract = () => getContract(process.env.REACT_APP_FC_ADDRESS, FC_ABI)
