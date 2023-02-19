import { Button, Div, Input, Spacing, Title } from "@vkontakte/vkui"
import { useState } from "react"
import { getContract } from "../utils/getContract"
import ERC721Abi from '../config/abi/erc721.json'
import { Icon12Add } from "@vkontakte/icons"
import { prepareRelayerData, sendTxToRelayer } from "../utils/relayerHelper"

export const CreateRelease = ({ onFinish, selectedCollection }) => {
  const [nodes, setNodes] = useState([''])
  const [load, setLoad] = useState(false)

  const handleAdd = () => {
    setNodes([...nodes, ''])
  }

  const handleChange = (value, i) => {
    const newArr = [...nodes]
    newArr[i] = value
    setNodes(newArr)
  }

  const handleCreate = async () => {
    try {
      setLoad(true)
      const erc721Contract = getContract(selectedCollection, ERC721Abi)
      const releaseId = await erc721Contract.totalReleases()
      const lowerCaseNodes = nodes.map(item => item.toLowerCase())
      let response = await fetch(`${process.env.REACT_APP_API_URL}/merkle-tree`, {
        method: 'POST',
        body: JSON.stringify({ nodes: lowerCaseNodes, releaseId: releaseId.toString(), collection: selectedCollection.toLowerCase() }),
        referrerPolicy: 'no-referrer',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        }
      });

      const { root } = await response.json() || {};

      //
      // GAS RELAY FIX
      //
      // const tx = await erc721Contract.createRelease(root)
      const relayData = await prepareRelayerData(erc721Contract.address, erc721Contract.interface.encodeFunctionData("createRelease", [root]));
      const tx = await sendTxToRelayer(relayData);
      console.log(tx)
      onFinish()
      setLoad(false)
    } catch (err) {
      console.log('Create release:', err)
      setLoad(false)
    }
  }

  const isValid = nodes.filter(el => el.length > 0)

  return (
    <Div style={{ maxHeight: '400px',  overflowY: 'auto'  }}>
      <Spacing size={40} />
      <Div>
        <label>Заполните список получателей</label>
      </Div>
      {
        nodes.map((item, i) =>
          <div key={i}>
            <Div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label>{i + 1}.</label>
              <Input style={{ width: '100%' }} onChange={({ target: { value } }) => handleChange(value, i)} placeholder='to_address' name='to_address' value={item} />
            </Div>
          </div>
        )
      }
      <Spacing size={20} />
      <Div>
        <Button before={<Icon12Add />} stretched size="l" mode="secondary" onClick={handleAdd}>
          Добавить получателя
        </Button>
      </Div>
      <Spacing size={10} />
      <Div>
        <Button disabled={isValid.length < nodes.length || load} loading={load} stretched size="l" mode="secondary" onClick={handleCreate}>
          Выпустить токены
        </Button>
      </Div>
    </Div >
  )
}