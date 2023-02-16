const PORT = 4000

const routes = {
  TEST: '/test',
  GET_MERKLE_ROOT: '/merkle-tree',
  FACTORY_DATA: '/factory-data'
}

const config = {
  ...routes,
  PORT
}
exports.config = config