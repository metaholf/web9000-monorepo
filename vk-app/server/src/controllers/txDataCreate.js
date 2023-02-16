const { ethers } = require('ethers')

const FC_ABI = [{"inputs":[{"internalType":"address","name":"trustedForwarder_","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"components":[{"internalType":"address","name":"sc","type":"address"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"}],"indexed":false,"internalType":"struct Web9000Factory.Collection","name":"collection","type":"tuple"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"DeployERC721","type":"event"},{"inputs":[{"internalType":"address","name":"implementation_","type":"address"},{"internalType":"string","name":"name_","type":"string"},{"internalType":"string","name":"symbol_","type":"string"},{"internalType":"uint256","name":"salt_","type":"uint256"}],"name":"deployERC721","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getAllCollections","outputs":[{"components":[{"internalType":"address","name":"sc","type":"address"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"}],"internalType":"struct Web9000Factory.Collection[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"target","type":"address"}],"name":"getAllCollectionsByOwner","outputs":[{"components":[{"internalType":"address","name":"sc","type":"address"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"}],"internalType":"struct Web9000Factory.Collection[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"forwarder","type":"address"}],"name":"isTrustedForwarder","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"trustedForwarder","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]

const txDataCreate = async (req, res) => {
  if (req.body) {
    console.log(req.body)
    const provider = new ethers.JsonRpcProvider('https://eth-goerli.g.alchemy.com/v2/0HXwg7aousuhqGHZcAs7YY5LVW-BLi4F')
    contract = new ethers.Contract('0x784384762f0E70EEE87289d4208B26b9b356cE22', FC_ABI, provider)
    const data = contract.interface.encodeFunctionData('deployERC721', [...req.body])
    res.send(JSON.stringify(data))

  } else
    res.send('invalid data')
}

exports.txDataCreate = txDataCreate