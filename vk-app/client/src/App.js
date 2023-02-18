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
	Panel,
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css'; ``
import { Icon20BrushOutline, Icon20CubeBoxOutline } from '@vkontakte/icons';

import { Creator } from './panels/Creator';
import Collector from './panels/Collector';
import { DEFAULT_CHAIN_ID } from './config';
import { tabItemStyle } from './config/styles';

const App = () => {
	const [scheme, setScheme] = useState('bright_light')
	const [selected, setSelected] = useState('collector');
	const [wrongNetwork, setWrongNetwork] = useState(false)

	useEffect(() => {
		bridge.subscribe(({ detail: { type, data } }) => {
			if (type === 'VKWebAppUpdateConfig') {
				setScheme(data.scheme)
			}
		});
	}, []);

	useEffect(() => {
		if (window?.ethereum) {
			window?.ethereum?.on("chainChanged", async function (chainId) {
				if (chainId === DEFAULT_CHAIN_ID) {
					setWrongNetwork(false)
				} else {
					setWrongNetwork(true)
				}
			})

			window?.ethereum?.on("accountsChanged", function (accounts) {
				console.log(accounts, "accountsChanged");
			});
		}
	}, [window?.ethereum])


	return (
		<ConfigProvider scheme={scheme}>
			<AdaptivityProvider>
				<AppRoot>
					<PanelHeader>
						WEB9000 NFT master
					</PanelHeader>
					<Panel>
						<FormStatus header="*Приложение работает только на тестовой сети Goerli" mode={wrongNetwork ? "error" : ''} >
							{wrongNetwork && 'Пожалуйста, смените сеть, чтобы приложение работало корректно'}
						</FormStatus>
						<Spacing size={20} />
						<Group>
							<Tabs >
								<TabsItem
									after={<Icon20CubeBoxOutline />}
									style={tabItemStyle}
									selected={selected === 'collector'}
									onClick={() => setSelected('collector')}
									id="tab-collector"
									aria-controls="tab-content-collector"
								>
									Обзор NFT
								</TabsItem>
								<TabsItem
									style={tabItemStyle}
									after={<Icon20BrushOutline />}
									selected={selected === 'creator'}
									onClick={() => setSelected('creator')}
									id="tab-creator"
									aria-controls="tab-content-creator"
								>
									Создать NFT
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
					</Panel>
				</AppRoot>
			</AdaptivityProvider>
		</ConfigProvider >
	);
}

export default App;
