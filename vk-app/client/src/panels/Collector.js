import React, { useState } from 'react';

import { Group, Spacing, Tabs, TabsItem } from '@vkontakte/vkui';
import { AllCollection } from '../modules/AllCollection';
import { OwnReleases } from '../modules/OwnReleases';
import { CollectionItem } from '../modules/CollectionItem';
import { Icon20PictureOutline } from '@vkontakte/icons';
import { Icon20GiftOutline } from '@vkontakte/icons';
import { Icon20WalletOutline } from '@vkontakte/icons';
import { tabItemStyle } from '../config/styles';
import { ReleasesInWallet } from '../modules/ReleasesInWallet';

const Collector = () => {
  const [tab, setTab] = useState('all')
  const [page, setPage] = useState('collections-list')
  const [selectedCollection, setSelectedCollection] = useState({})

  const selectCollection = (collection) => {
    setSelectedCollection(collection)
    setPage('collection-item')
  }

  return (
    <>
      {page === 'collections-list' && <>
        <Tabs style={{ borderRadius: '6px' }}>
          <TabsItem
            style={tabItemStyle}
            after={<Icon20PictureOutline />}
            selected={tab === 'all'}
            onClick={() => setTab('all')}
            id="tab-list"
            aria-controls="tab-content-all"
          >
            All collections
          </TabsItem>
          <TabsItem
            style={tabItemStyle}
            after={<Icon20GiftOutline />}
            selected={tab === 'own'}
            onClick={() => setTab('own')}
            id="tab-own"
            aria-controls="tab-content-own"
          >
            Own Releases
          </TabsItem>
          <TabsItem
            style={tabItemStyle}
            after={<Icon20WalletOutline />}
            selected={tab === 'wallet'}
            onClick={() => setTab('wallet')}
            id="tab-wallet"
            aria-controls="tab-content-wallet"
          >
            In my wallet
          </TabsItem>
        </Tabs>
        <Spacing size={25} />
        {tab === 'all'
          && <Group id="tab-content-all" aria-labelledby="tab-all" role="tabpanel">
            <AllCollection selectCollection={selectCollection} />
          </Group>}
        {tab === 'own'
          && <Group id="tab-content-own" aria-labelledby="tab-own" role="tabpanel">
            <OwnReleases />
          </Group>}
        {tab === 'wallet'
          && <Group id="tab-content-wallet" aria-labelledby="tab-wallet" role="tabpanel">
            <ReleasesInWallet />
          </Group>}
      </>}
      {page === 'collection-item' && <CollectionItem onBack={() => setPage('collections-list')} {...selectedCollection} />}
    </>
  )
};

export default Collector;
