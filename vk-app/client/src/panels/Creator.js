import React, { useState } from 'react';
import { Group, Spacing, Tabs, TabsItem } from '@vkontakte/vkui';
import { CreateCollection } from '../modules/CreateCollection';
import { CollectionList } from '../modules/CollectionList';
import { CreateRelease } from '../modules/CreateRelease';
import { Icon20ListAddOutline } from '@vkontakte/icons';
import { Icon24Settings } from '@vkontakte/icons'; 
import { tabItemStyle } from '../config/styles';

const Creator = () => {
	const [tab, setTab] = useState('list');
	const [page, setPage] = useState('collections')
	const [selectedCollection, setSelectedCollection] = useState('')

	const selectCollection = (address) => {
		setSelectedCollection(address)
		setPage('release')
	}
	const onBack = () => {
		setSelectedCollection('')
		setPage('collections')
	}

	return (<>
		{page === 'collections' && <>
			<Tabs style={{ borderRadius: '6px' }}>
				<TabsItem
					after={<Icon20ListAddOutline />}
					style={tabItemStyle}
					selected={tab === 'list'}
					onClick={() => setTab('list')}
					id="tab-list"
					aria-controls="tab-content-list"
				>
					Collection List
				</TabsItem>
				<TabsItem
					after={<Icon24Settings />}
					style={tabItemStyle}
					selected={tab === 'create'}
					onClick={() => setTab('create')}
					id="tab-create"
					aria-controls="tab-content-create"
				>
					Create Collection
				</TabsItem>
			</Tabs>
			<Spacing size={25} />
			{tab === 'list'
				&& <Group id="tab-content-list" aria-labelledby="tab-list" role="tabpanel">
					<CollectionList goToCreateCollection={() => setTab('create')} selectCollection={selectCollection} />
				</Group>}
			{tab === 'create'
				&& <Group id="tab-content-create" aria-labelledby="tab-create" role="tabpanel">
					<CreateCollection goToRelease={() => setTab('list')} />
				</Group>}
		</>}
		{page === 'release' && <CreateRelease onBack={onBack} selectedCollection={selectedCollection} />}
	</>
	)
};

export default Creator;
