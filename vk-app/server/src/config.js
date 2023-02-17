const PORT = 4000
const DB = "./mydb"

const routes = {
  TEST: '/test',
  GET_MERKLE_ROOT: '/merkle-tree',
  GET_MERKLE_PROOFS: '/merkle-tree-proofs',
  FACTORY_DATA: '/factory-data'
}

const config = {
  ...routes,
  PORT,
  DB
}
exports.config = config