import { Button, Div, Input, Spacing } from "@vkontakte/vkui"
import { useState } from "react"
import { getFactoryContract } from "../utils/getContract"
import { randomNumber } from "../utils/randomNumber"

export const CreateCollection = ({ onFinish }) => {
  const [input, setInput] = useState({ name: '', symbol: '' })
  const [loading, setLoading] = useState(false)

  const handleInput = ({ target: { value, name } }) => {
    setInput({ ...input, [name]: value })
  }

  const handleCreate = async () => {
    try {
      setLoading(true)

      const { name, symbol } = input
      const contractFactory = getFactoryContract()
      const salt = randomNumber(1, 100000000000000)
      const tx = await contractFactory.deployERC721(process.env.REACT_APP_IMPLEMENT_ADDRESS, name, symbol, salt.toFixed(0))
      console.log(tx)
      tx.wait().then((res) => {
        console.log(res);
        setLoading(false);
        onFinish()
        return;
      }).catch((err) => {
        console.log(err);
        setLoading(false);
        return;
      });
    } catch (err) {
      console.log('Create collection:', err)
      setLoading(false)
    }
  }
  return (
    <Div>

      <h4> Fill in the fields and press Create button. </h4>
      <p>
        Then sign the transaction via your crypto wallet and <br />
        you will see new collection in list your own collections
      </p>
      <Spacing size={40} />
      <label>Enter name of collection</label>
      <Spacing size={8} />
      <Input placeholder='name' name='name' value={input.name} onChange={handleInput} />
      <Spacing size={20} />
      <label>Put symbol of collection</label>
      <Spacing size={8} />
      <Input placeholder='symbol' name='symbol' value={input.symbol} onChange={handleInput} />
      <Spacing size={40} />
      {loading && <Div>It may take a few time...</Div>}
      <Button
        loading={loading}
        disabled={!input.name.length || !input.symbol.length || loading}
        stretched size="l"
        mode="secondary"
        onClick={handleCreate}
      >
        Create collection
      </Button>
    </Div >
  )
}