const express = require('express');
const { config } = require('./src/config');
const app = express();
const port = config.PORT;
const cors = require('cors');
const rateLimit = require('express-rate-limit')
const { merkleTreeController, getProofsController } = require('./src/controllers/merkleTree');
const { txDataCreate } = require('./src/controllers/txDataCreate');
const { relayerController } = require('./src/controllers/relayer');

const apiLimiter = rateLimit({
	windowMs: 5000, // 15 minutes
	max: 1, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
})

app.use(cors());
app.use(express.json())

app.get('/test', (req, res) => {
  res.send('Hello World!')
})

app.post(config.GET_MERKLE_ROOT, merkleTreeController)

app.post(config.GET_MERKLE_PROOFS, getProofsController)

app.post(config.FACTORY_DATA, txDataCreate)

app.post(config.RELAYER, apiLimiter, relayerController)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})