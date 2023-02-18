import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import {
	TabsItem,
	Tabs,
	AdaptivityProvider,
	AppRoot,
	ConfigProvider,
	Group,
	PanelHeader,
	Spacing,
	FormStatus,
	Button,
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import { checkChain, switchChain } from "./utils/switchChain"

import Creator from './panels/Creator';
import Collector from './panels/Collector';
import { UserBlock } from './components/UserBlock';
import { DEFAULT_CHAIN_ID } from './config';

const App = () => {
	const [scheme, setScheme] = useState('bright_light')
	const [fetchedUser, setUser] = useState(null);
	const [selected, setSelected] = useState('creator');
	const [wrongNetwork, setWrongNetwork] = useState(false)

	useEffect(() => {
		bridge.subscribe(({ detail: { type, data } }) => {
			if (type === 'VKWebAppUpdateConfig') {
				setScheme(data.scheme)
			}
		});

		async function fetchData() {
			const user = await bridge.send('VKWebAppGetUserInfo');
			setUser(user);
		}
		fetchData();
	}, []);

	const getChain = async () => {
		const chainId = await checkChain()
		if (chainId !== DEFAULT_CHAIN_ID) {
			setWrongNetwork(true)
		}
	}


	useEffect(() => {
		if (window?.ethereum) {
			getChain()
			window?.ethereum?.on("chainChanged", async function (chainId) {
				if (chainId === DEFAULT_CHAIN_ID) {
					setWrongNetwork(false)
				} else {
					setWrongNetwork(true)
				}
			})
		}
	}, [window?.ethereum])


	return (
		<ConfigProvider scheme={scheme}>
			<AdaptivityProvider>
				<AppRoot>
					<PanelHeader>
						WEB9000
					</PanelHeader>
					<FormStatus header="*The application is only available on the Goreli TestNet network" mode={wrongNetwork ? "error" : ''} >
						{wrongNetwork && 'Please change network  in your wallet to use the app correctly'}
					</FormStatus>
					<Spacing size={20} />
					{fetchedUser && <UserBlock data={fetchedUser} />}
					<Group>
						<Tabs >
							<TabsItem
								selected={selected === 'creator'}
								onClick={() => setSelected('creator')}
								id="tab-creator"
								aria-controls="tab-content-creator"
							>
								Creator
							</TabsItem>
							<TabsItem
								selected={selected === 'collector'}
								onClick={() => setSelected('collector')}
								id="tab-collector"
								aria-controls="tab-content-collector"
							>
								Collector
							</TabsItem>
						</Tabs>
						<Spacing size={30} />
						{selected === 'creator'
							&& <Group id="tab-content-creator" aria-labelledby="tab-creator" role="tabpanel">
								<Creator />
							</Group>}
						{selected === 'collector'
							&& <Group id="tab-content-collector" aria-labelledby="tab-collector" role="tabpanel">
								<Collector />
							</Group>}
					</Group>
				</AppRoot>
			</AdaptivityProvider>
		</ConfigProvider >
	);
}

export default App;
