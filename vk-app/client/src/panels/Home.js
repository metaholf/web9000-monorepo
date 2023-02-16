import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Panel, PanelHeader, Header, Button, Group, Cell, Div, Avatar, Input, View } from '@vkontakte/vkui';
import { FC_ADDRESS, IMPLEMENT_ADDRESS } from '../config';

function randomNumber(min, max) {
	return Math.random() * (max - min) + min;
}
const salt = randomNumber(1, 100000000000000)

// const tx = await contract.methods.deployArtWhaleERC721(IMPLEMENT_ADDRESS, name, symbol, salt).call()


const Home = ({ id, go, fetchedUser }) => {
	const [name, setName] = useState('')
	const [symbol, setSymbol] = useState('')

	const handleCreate = async () => {
		await window.ethereum.enable();

		const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
		const from = accounts[0];
		// const msg = `0x${Buffer.from('exampleMessage', 'utf8').toString('hex')}`;

		// const params = {
		// 	from: from,
		// 	to: FC_ADDRESS,
		// 	implementation: IMPLEMENT_ADDRESS,
		// 	name,
		// 	symbol,
		// 	salt,
		// 	value: '0'
		// }
		const response = await fetch('http://localhost:4000/factory-data', {
			method: 'POST',
			body: JSON.stringify(["0xd53C26eeFeBd6fd58fd19485F5093d906f1b1A89", name, symbol, salt.toFixed(0)]),
			referrerPolicy: 'no-referrer',
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Content-Type': 'application/json',
			}
		})
		const dataTx = await response.json()
		console.log(dataTx)

		const txParams = {
			from: from,
			to: FC_ADDRESS,
			value: '0',
			data: dataTx
		}

		const tx = await window.ethereum.request({
			method: 'eth_sendTransaction',
			params: [txParams],
		})

		console.log(tx)

		// console.log(tx)
		// if (sign)
		go('createMerkleTree')
		// return
	}
	return (
		<Panel id={id}>
			<PanelHeader>WEB9000</PanelHeader>
			{fetchedUser &&
				<Group header={<Header mode="secondary">Create nft collection</Header>}>
					<Cell
						before={fetchedUser.photo_200 ? <Avatar src={fetchedUser.photo_200} /> : null}
						description={fetchedUser.city && fetchedUser.city.title ? fetchedUser.city.title : ''}
					>
						{`${fetchedUser.first_name} ${fetchedUser.last_name}`}
					</Cell>
					<Div>
						<label>Enter token name</label>
						<Input placeholder='name' onChange={({ target: { value } }) => setName(value)} value={name} />
						<Input placeholder='symbol' onChange={({ target: { value } }) => setSymbol(value)} value={symbol} />
					</Div>
					<Div>
						<Button disabled={!name.length || !symbol.length} stretched size="l" mode="secondary" onClick={handleCreate}>
							Create
						</Button>
					</Div>
				</Group>}
		</Panel>
	)
};

Home.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	fetchedUser: PropTypes.shape({
		photo_200: PropTypes.string,
		first_name: PropTypes.string,
		last_name: PropTypes.string,
		city: PropTypes.shape({
			title: PropTypes.string,
		}),
	}),
};

export default Home;
