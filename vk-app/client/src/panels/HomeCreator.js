import React, { useState } from 'react';
import { Button, Div, Input, Spacing, Title } from '@vkontakte/vkui';
import { FC_ADDRESS, IMPLEMENT_ADDRESS } from '../config';
import FC_ABI from '../config/abi/fcAbi.json'
import { getContract } from '../utils/getContract';
import { switchChain } from '../utils/switchChain';

function randomNumber(min, max) {
	return Math.random() * (max - min) + min;
}

const HomeCreator = () => {
	const [input, setInput] = useState({ name: '', symbol: '' })
	const [loading, setLoading] = useState(false)

	const handleInput = ({ target: { value, name } }) => {
		setInput({ ...input, [name]: value })
	}

	const handleCreate = async () => {
		try {
			setLoading(true)
			await switchChain()
			
			const { name, symbol } = input
			const contractFactory = getContract(FC_ADDRESS, FC_ABI)
			const salt = randomNumber(1, 100000000000000)
			console.log(contractFactory)
			const tx = await contractFactory.deployERC721(IMPLEMENT_ADDRESS, name, symbol, salt.toFixed(0))
			console.log(tx)
			setLoading(false)
		} catch (err) {
			console.log('Create collection:', err)
			setLoading(false)
		}
	}

	return (
		<Div>
			<Title>Create a collection</Title>
			<Spacing size={40} />
			<label>Enter name of collection</label>
			<Spacing size={8} />
			<Input placeholder='name' name='name' value={input.name} onChange={handleInput} />
			<Spacing size={20} />
			<label>Put symbol of collection</label>
			<Spacing size={8} />
			<Input placeholder='symbol' name='symbol' value={input.symbol} onChange={handleInput} />
			<Spacing size={40} />
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
};

export default HomeCreator;
