const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256')
const web3 = require('web3');


const merkleTreeController = async (req, res) => {
  if (req.body) {
    console.log(req.body)
    const nodes = req.body
    let elems = [];
    nodes.forEach((element, i) => {
      let hash = web3.utils.soliditySha3(element.to_address, i);
      elems.push(hash);
    });

    const merkleTree = new MerkleTree(elems, keccak256, { hashLeaves: false, sortPairs: true });

    const root = merkleTree.getHexRoot();

    console.log("Root hash:", root);

    const leaf = elems[0];

    const proof = merkleTree.getHexProof(leaf);

    console.log("Proof for contract: (elems[0])", proof);
    // console.log(nodes)
    // let elems = [];
    // nodes.forEach((element, i) => {
    //   let hash = web3.utils.soliditySha3(
    //     element.metadata,
    //     element.to_address,
    //     i);
    //   elems.push(hash);
    // });
    // console.log(elems)
    // const merkleTree = new MerkleTree(elems, keccak256, { hashLeaves: false, sortPairs: true });
    // console.log(merkleTree)
    // const root = merkleTree.getHexRoot();
    res.send(JSON.stringify(proof))

  } else
    res.send('invalid data')
}

exports.merkleTreeController = merkleTreeController