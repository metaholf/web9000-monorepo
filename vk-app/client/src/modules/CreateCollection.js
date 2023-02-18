import { Button, Div, Input, Spacing, Title } from "@vkontakte/vkui"
import { useState } from "react"
import { CustomTooltip } from "../components/CustomTooltip"
import { configText } from "../config"
import { getFactoryContract } from "../utils/getContract"
import { randomNumber } from "../utils/randomNumber"

export const CreateCollection = ({ goToRelease }) => {
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
        goToRelease()
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
      <Title style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <p style={{ flex: 'none' }}>
          Create a collection
        </p>
        <CustomTooltip text={configText.creatorCollection} />
      </Title>
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
    </Div>
  )
}