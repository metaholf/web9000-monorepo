import { Button, Div, Input, Spacing, Title } from "@vkontakte/vkui"
import { useState } from "react"
import { getContract } from "../utils/getContract"
import ERC721Abi from '../config/abi/erc721.json'

export const CreateRelease = ({ onBack, selectedCollection }) => {
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
  console.log(nodes)
  const handleCreate = async () => {
    try {
      setLoad(true)
      const erc721Contract = getContract(selectedCollection, ERC721Abi)
      const releaseId = await erc721Contract.totalReleases()
      const lowerCaseNodes = nodes.map(item=>item.toLowerCase())
      let response = await fetch(`${process.env.REACT_APP_API_URL}/merkle-tree`, {
        method: 'POST',
        body: JSON.stringify({ nodes:lowerCaseNodes, releaseId: releaseId.toString(), collection: selectedCollection.toLowerCase() }),
        referrerPolicy: 'no-referrer',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        }
      });

      const { root } = await response.json() || {};

      const tx = await erc721Contract.createRelease(root)
      console.log(tx)
      onBack()
      setLoad(false)
    } catch (err) {
      console.log('Create release:', err)
      setLoad(false)
    }
  }

  const isValid = nodes.filter(el => el.length > 0)

  return (
    <Div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Title>Create Release</Title>
        <Button onClick={onBack}>Back</Button>
      </div>
      <Spacing size={40} />
      <Div>
        <label>Add values</label>
      </Div>
      {nodes.map((item, i) =>
        <Div key={i}>
          <label>{i + 1}</label>
          <Spacing size={10} />
          <Input onChange={({ target: { value } }) => handleChange(value, i)} placeholder='to_address' name='to_address' value={item} />
        </Div>
      )}
      <Spacing size={20} />
      <Div>
        <Button stretched size="l" mode="secondary" onClick={handleAdd}>
          Add node
        </Button>
      </Div>
      <Spacing size={30} />
      <Div>
        <Button disabled={isValid.length < nodes.length || load} loading={load} stretched size="l" mode="secondary" onClick={handleCreate}>
          Create Release
        </Button>
      </Div>
    </Div>
  )
}