const express = require('express')
const { config } = require('./src/config');
const app = express()
const port = config.PORT
const cors = require('cors');
const { merkleTreeController } = require('./src/controllers/merkleTree');
const { txDataCreate } = require('./src/controllers/txDataCreate');

app.use(cors());
app.use(express.json())

app.get('/test', (res) => {
  res.send('Hello World!')
})

app.post(config.GET_MERKLE_ROOT, merkleTreeController)

app.post(config.FACTORY_DATA, txDataCreate)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})