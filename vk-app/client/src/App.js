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
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import HomeCreator from './panels/HomeCreator';
import HomeCollector from './panels/HomeCollector';
import CreateMerkleTree from './panels/CreateMerkleTree';
import { UserBlock } from './components/UserBlock';

const App = () => {
	const [scheme, setScheme] = useState('bright_light')
	const [fetchedUser, setUser] = useState(null);
	const [selected, setSelected] = useState('creator');

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


	return (
		<ConfigProvider scheme={scheme}>
			<AdaptivityProvider>
				<AppRoot>
					<PanelHeader>WEB9000</PanelHeader>
					{fetchedUser && <UserBlock data={fetchedUser} />}
					<Tabs style={{ borderRadius: '6px', background: '#fff' }}>
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
					<Spacing size={10} />
					{selected === 'creator'
						&& <Group id="tab-content-creator" aria-labelledby="tab-creator" role="tabpanel">
							<HomeCreator />
						</Group>}
					{selected === 'collector'
						&& <Group id="tab-content-collector" aria-labelledby="tab-collector" role="tabpanel">
							<HomeCollector />
						</Group>}
				</AppRoot>
			</AdaptivityProvider>
		</ConfigProvider>
	);
}

export default App;
