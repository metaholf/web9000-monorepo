import { ethers } from 'ethers'
import { getRelayerContract, getAccount } from "../utils/getContract"
import { checkChain } from "../utils/switchChain"

export const prepareRelayerData = async (targetAddressArg, targetDataArg) => {
    const relayerContract = getRelayerContract();

    const targetFrom = await getAccount();
    const targetRelayer = relayerContract.address;
    const targetContract = targetAddressArg;
    const targetValue = "0";
    const targetGas = "1000000";
    const targetNonce = (await relayerContract.getNonce(targetFrom)).toString();
    const targetData = targetDataArg;

  
    const EIP712Domain = {
      name: "MinimalForwarder",
      chainId: await checkChain(),
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
      from: targetFrom,
      to: targetContract,
      value: targetValue,
      gas: targetGas,
      nonce: targetNonce,
      data: targetData,
    }

    const signature = await relayerContract.signer._signTypedData(EIP712Domain, ForwardRequest, value);

    let result = {
        from: targetFrom,
        to: targetContract,
        value: targetValue,
        gas: targetGas,
        nonce: targetNonce,
        data: targetData,
        signature: signature
    }

    return result

}

export const sendTxToRelayer = async (relayerData) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/sendWithRelayer`, {
        method: 'POST',
        body: JSON.stringify(relayerData),
        referrerPolicy: 'no-referrer',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        }
      });

      const txHash  = (await response.json()).txhash

      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const tx = await provider.getTransaction(txHash);
      console.log(tx);


    return tx;
}

// {"from": "0x53d1B9Ca6b8e78c44e8f87b87F04eE9069D3c7E6",
//  "to": "0x784384762f0E70EEE87289d4208B26b9b356cE22",
//   "value": "0",
//   "gas": "1000000",
//   "nonce": "7",
//   "data": "0x7f63ab71000000000000000000000000d53c26eefebd6fd58fd19485f5093d906f1b1a89000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c0e8739e8a948535b3fffcdbedfa222bda059be15c0968fb8c82219a0d789c977e0000000000000000000000000000000000000000000000000000000000000006544f4b454e4300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006544f4b454e430000000000000000000000000000000000000000000000000000",
//  "signature": "0x72fa818abcdd8fa4e8356fefa7ae47c39c7745bcc9132c42e69d00e0fa4535e05a72eaf655338eb6211472decaed44e0103c2f5dd36bdd34426c6596ab67c2691b"
// }
