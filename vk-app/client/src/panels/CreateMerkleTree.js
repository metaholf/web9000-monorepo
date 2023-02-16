import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Panel, PanelHeader, Header, Button, Group, Cell, Div, Avatar, Input, View, Title } from '@vkontakte/vkui';

const CreateMerkleTree = ({ id, go }) => {
  const [nodes, setNodes] = useState([{ to_address: '' }])

  const handleAdd = () => {
    setNodes([...nodes, { to_address: '' }])
  }

  const handleChange = (value, name, i) => {
    const newArr = [...nodes]
    newArr[i][name] = value
    setNodes(newArr)
  }

  const isDisabled = nodes.find(el => !el.to_address)

  const handleCreate = async () => {
    fetch('http://localhost:4000/merkle-tree', {
      method: 'POST',
      body: JSON.stringify(nodes),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
      .then(json => console.log(json))

    return
  }
  return (
    <Panel id={id}>
      <PanelHeader>WEB9000</PanelHeader>

      <Group header={<Header mode="secondary">Create merkle tree</Header>}>
        <Div>
          <label>Add values</label>
        </Div>
        {nodes.map((item, i) =>
          <Div key={i}>
            <Title>{i}</Title>
            {/* <Input onChange={({ target: { value, name } }) => handleChange(value, name, i)} placeholder='metadata' name='metadata' value={item.metadata} /> */}
            <Input onChange={({ target: { value, name } }) => handleChange(value, name, i)} placeholder='to_address' name='to_address' value={item.to_address} />
          </Div>
        )}
        <Div>
          <Button stretched size="l" mode="secondary" onClick={handleAdd}>
            Add node
          </Button>
        </Div>
        <Div>
          <Button disabled={isDisabled} stretched size="l" mode="secondary" onClick={handleCreate}>
            Create merkle tree
          </Button>
        </Div>
      </Group>
    </Panel>
  )
};


export default CreateMerkleTree;
