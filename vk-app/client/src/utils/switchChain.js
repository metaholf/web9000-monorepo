import { DEFAULT_CHAIN_ID } from "../config";

export const checkChain = async () => {
  if (window.ethereum) {
    const currentChainId = await window.ethereum.request({
      method: "eth_chainId",
    });
    return currentChainId;
  }
};

export const switchChain = async () => {
  const chainId = await checkChain()
  if (chainId !== DEFAULT_CHAIN_ID) {
    return await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: DEFAULT_CHAIN_ID }],
    })
  }
}