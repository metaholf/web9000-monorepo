import { Button, Div, Input, Spacing } from "@vkontakte/vkui"
import { useState } from "react"
import { getFactoryContract } from "../utils/getContract"
import { randomNumber } from "../utils/randomNumber"
import { ethers } from 'ethers'
import { prepareRelayerData, sendTxToRelayer } from "../utils/relayerHelper"

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
      const salt = (ethers.BigNumber.from(ethers.utils.randomBytes(32))).toString();
      //
      // GAS RELAY FIX
      //
      const relayData = await prepareRelayerData(contractFactory.address, contractFactory.interface.encodeFunctionData("deployERC721", [process.env.REACT_APP_IMPLEMENT_ADDRESS, name, symbol, salt]));
      const tx = await sendTxToRelayer(relayData);
      // const tx = await contractFactory.deployERC721(process.env.REACT_APP_IMPLEMENT_ADDRESS, name, symbol, salt.toFixed(0))
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

      <h4> Заполните поля и подтвердите создание коллекции </h4>
      <p>
        В появившей коллекции вы сможете выпускать NFT токены <br />
      </p>
      <Spacing size={40} />
      <label>Введите полное название коллекции</label>
      <Spacing size={8} />
      <Input placeholder='name' name='name' value={input.name} onChange={handleInput} />
      <Spacing size={20} />
      <label>Введите биржевой тикер коллекции</label>
      <Spacing size={8} />
      <Input placeholder='symbol' name='symbol' value={input.symbol} onChange={handleInput} />
      <Spacing size={40} />
      {loading && <Div>Ожидание транзакции...</Div>}
      <Button
        loading={loading}
        disabled={!input.name.length || !input.symbol.length || loading}
        stretched size="l"
        mode="secondary"
        onClick={handleCreate}
      >
        Создать коллекцию
      </Button>
    </Div >
  )
}