const { ethers } = require('ethers')
const { config } = require('../config');

const RELAYER_ABI = [
  {
    "inputs": [],
    "name": "diff",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "gas",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "nonce",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "data",
            "type": "bytes"
          }
        ],
        "internalType": "struct MinimalForwarder.ForwardRequest",
        "name": "req",
        "type": "tuple"
      },
      {
        "internalType": "bytes",
        "name": "signature",
        "type": "bytes"
      }
    ],
    "name": "execute",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      },
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      }
    ],
    "name": "getNonce",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "gas",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "nonce",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "data",
            "type": "bytes"
          }
        ],
        "internalType": "struct MinimalForwarder.ForwardRequest",
        "name": "req",
        "type": "tuple"
      },
      {
        "internalType": "bytes",
        "name": "signature",
        "type": "bytes"
      }
    ],
    "name": "verify",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// const { NonceManager } = require("@ethersproject/experimental");

let nonceMemory = -1;

const relayerController = async (req, res) => {
  if (req.body) {

    const txData = req.body;

    const targetFrom = txData.from;
    const targetTo = txData.to;
    const targetValue = txData.value;
    const targetGas = txData.gas;
    const targetNonce = txData.nonce;
    const targetData = txData.data;
    const signature = txData.signature;
    const txMsg = {
      from: targetFrom,
      to: targetTo,
      value: targetValue,
      gas: targetGas,
      nonce: targetNonce,
      data: targetData,
    }

    const provider = new ethers.JsonRpcProvider('https://eth-goerli.g.alchemy.com/v2/7aOrFcBLYIJaijRSF1KbG6JQF3mXEyIs')//'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161')
    const signer = new ethers.Wallet(config.RELAYER_PRIVATE_KEY, provider);
    const FACTORY_ABI = [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "trustedForwarder_",
            "type": "address"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "components": [
              {
                "internalType": "address",
                "name": "sc",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "owner",
                "type": "address"
              },
              {
                "internalType": "string",
                "name": "name",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "symbol",
                "type": "string"
              }
            ],
            "indexed": false,
            "internalType": "struct Web9000Factory.Collection",
            "name": "collection",
            "type": "tuple"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "name": "DeployERC721",
        "type": "event"
      },
      {
        "inputs": [
          {
            "components": [
              {
                "internalType": "address",
                "name": "target",
                "type": "address"
              },
              {
                "internalType": "bytes",
                "name": "callData",
                "type": "bytes"
              }
            ],
            "internalType": "struct Web9000Factory.Call[]",
            "name": "calls",
            "type": "tuple[]"
          }
        ],
        "name": "aggregateCall",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "blockNumber",
            "type": "uint256"
          },
          {
            "internalType": "bytes[]",
            "name": "returnData",
            "type": "bytes[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "implementation_",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "name_",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "symbol_",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "salt_",
            "type": "uint256"
          }
        ],
        "name": "deployERC721",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getAllCollections",
        "outputs": [
          {
            "components": [
              {
                "internalType": "address",
                "name": "sc",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "owner",
                "type": "address"
              },
              {
                "internalType": "string",
                "name": "name",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "symbol",
                "type": "string"
              }
            ],
            "internalType": "struct Web9000Factory.Collection[]",
            "name": "",
            "type": "tuple[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "target",
            "type": "address"
          }
        ],
        "name": "getAllCollectionsByOwner",
        "outputs": [
          {
            "components": [
              {
                "internalType": "address",
                "name": "sc",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "owner",
                "type": "address"
              },
              {
                "internalType": "string",
                "name": "name",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "symbol",
                "type": "string"
              }
            ],
            "internalType": "struct Web9000Factory.Collection[]",
            "name": "",
            "type": "tuple[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "forwarder",
            "type": "address"
          }
        ],
        "name": "isTrustedForwarder",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "trustedForwarder",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ]

    let contract = new ethers.Contract(config.TRUSTED_FORWARDER_ADDRESS, RELAYER_ABI, signer)


    // try {
    //   await contract.execute(txMsg, signature);
    // } catch (error) {
    //   res.send(JSON.stringify({result: "exception"}))
    // }

    // if (nonceMemory === -1) {
    //   nonceMemory = await provider.getTransactionCount(signer.address, "pending")
    // } else {
    //   nonceMemory++
    // }

    
    
    // console.log(await nonceManager.getAddress())/
    // console.log(nonceManager.incrementTransactionCount())
    // console.log(await nonceManager.getTransactionCount("pending"))
    // console.log(Object.getOwnPropertyNames(nonceManager.__proto__));
    // const gasPrice = (await provider.getFeeData()).gasPrice
    // const resultGasPrice = +gasPrice.toString() * 2;
    // console.log();
    // console.log(+gasPrice.toString() * 2, gasPrice)
    // send relay tx
    // const nonce = await nonceManager.getTransactionCount("pending");
    const nonce = await provider.getTransactionCount(signer.address, "pending")
    let tx = await contract.execute(txMsg, signature, {nonce: nonce});
    
    // console.log(gasPrice)
    // console.log(resultGasPrice)
    console.log(nonce)
    console.log(tx)
    // let tx;
    // try {
    //   // tx = await contract.deployERC721("0x4cea311a911edfec6d83567507a4acf663557c06", "A", "A", Math.floor(Math.random() * 100000000000), {nonce: nonceMemory});
    //   tx =  await contract.execute(txMsg, signature, {nonce: nonceMemory});
    // } catch(error) {
    //   console.log(error);
    //   try {
    //     nonceMemory = await provider.getTransactionCount(signer.address, "pending");
    //     tx =  await contract.execute(txMsg, signature, {nonce: nonceMemory});
    //   } catch(error) {
    //     console.log(error);
    //     res.send(JSON.stringify({result: "not ok"}))
    //   }
    // }

  
    
    
    
    
    res.send(JSON.stringify({result: "ok", txhash: tx.hash}))
    
    // console.log("213132")
  } else
    res.send('invalid data')
}


module.exports = {relayerController}