import { ethers } from 'ethers'
import FC_ABI from '../config/abi/fcAbi.json'
import RELAYER_ABI from '../config/abi/relayerABI.json'

export const getContract = (address, abi) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  let signer = provider.getSigner();

  return new ethers.Contract(address, abi, signer);
}

export const getAccount = async () => {
  const [account] = await window.ethereum?.request({
    method: "eth_requestAccounts",
  });
  return account;
}

export const getFactoryContract = () => getContract(process.env.REACT_APP_FC_ADDRESS, FC_ABI)

export const getRelayerContract = () => getContract(process.env.REACT_APP_RELAYER_ADDRESS, RELAYER_ABI)
