const PORT = 4000
const IP = '127.0.0.1'
const DB = "./mydb"
const TRUSTED_FORWARDER_ADDRESS = "0xf081791aA828f0f6470f9168610A7F2e80911476";
const RELAYER_PRIVATE_KEY = "0xd5805de8475ea3f68384f7c81ac35d412f1cf988f4760b1528beec1c4417e313";  // bad practice, i know =)

const routes = {
  TEST: '/test',
  GET_MERKLE_ROOT: '/merkle-tree',
  GET_MERKLE_PROOFS: '/merkle-tree-proofs',
  FACTORY_DATA: '/factory-data',
  RELAYER: '/sendWithRelayer',
  COLLECTION_TOKENS: '/getCollectionTokens',
}

const config = {
  ...routes,
  PORT,
  IP,
  DB,
  TRUSTED_FORWARDER_ADDRESS,
  RELAYER_PRIVATE_KEY
}
exports.config = config