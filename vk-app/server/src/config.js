const PORT = 4000
const IP = '127.0.0.1'
const DB = "./mydb"
const TRUSTED_FORWARDER_ADDRESS = "0x1a4B338d40577eCE9E3394DEF00596Bb116611Bc";
const RELAYER_PRIVATE_KEY = "0x3ae96d41979974e2c439b980cc47c93e9efa799e572cbca213fccdc81fa290bf";  // bad practice, i know =)

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