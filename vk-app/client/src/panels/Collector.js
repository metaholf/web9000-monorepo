import React, { useState } from 'react';

import { Group, Spacing, Tabs, TabsItem } from '@vkontakte/vkui';
import { AllCollection } from '../modules/AllCollection';
import { OwnReleases } from '../modules/OwnReleases';
import { CollectionItem } from '../modules/CollectionItem';

const Collector = () => {
  const [tab, setTab] = useState('all')
  const [page, setPage] = useState('collections-list')
  const [selectedCollection, setSelectedCollection] = useState({})

  const selectCollection = (collection) => {
    setSelectedCollection(collection)
    setPage('collection-item')
  }

  console.log(selectedCollection)

  return (
    <>
      {page === 'collections-list' && <>
        <Tabs style={{ borderRadius: '6px' }}>
          <TabsItem
            selected={tab === 'all'}
            onClick={() => setTab('all')}
            id="tab-list"
            aria-controls="tab-content-all"
          >
            All collections
          </TabsItem>
          <TabsItem
            selected={tab === 'own'}
            onClick={() => setTab('own')}
            id="tab-own"
            aria-controls="tab-content-own"
          >
            Own Releases
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
      </>}
      {page === 'collection-item' && <CollectionItem onBack={() => setPage('collections-list')} {...selectedCollection} />}
    </>
  )
};

export default Collector;
