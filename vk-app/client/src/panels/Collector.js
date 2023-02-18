import React, { useState } from 'react';

import { CustomSelect, CustomSelectOption, Div, FormItem, Group, SegmentedControl, Select, Spacing, SplitLayout, Tabs, TabsItem } from '@vkontakte/vkui';
import { AllCollection } from '../modules/AllCollection';
import { OwnReleases } from '../modules/OwnReleases';
import { CollectionItem } from '../modules/CollectionItem';
import { Icon20PictureOutline } from '@vkontakte/icons';
import { Icon20GiftOutline } from '@vkontakte/icons';
import { Icon20WalletOutline } from '@vkontakte/icons';
import { tabItemStyle } from '../config/styles';
import { ReleasesInWallet } from '../modules/ReleasesInWallet';
import { Modal } from '../components/Modal';

const options = [
  { label: 'All collections', value: 'all' },
  { label: 'Available for me', value: 'own' },
  { label: 'In my wallet', value: 'wallet' }
]

const Collector = () => {
  const [selectType, setSelectType] = useState('all')
  const [page, setPage] = useState('collections-list')
  const [selectedCollection, setSelectedCollection] = useState({})
  const [popout, setPopout] = useState(null);
  const onClose = () => setPopout(null)

  const selectCollection = (collection) => setPopout(
    <Modal onClose={onClose} title='Add new collection' >
      <CollectionItem onBack={onClose} {...collection} />
    </Modal >);

  return (
    <SplitLayout style={{ display: 'block' }} popout={popout}>
      <Div>
        <Div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <FormItem >
            <Div>
              На этой странице можно посмотреть все коллекции и релизы платформы. Выбери между всеит коллекциями, релизами доступными для минта тебе и теми к, которые уже у тебя на кошельке
            </Div>
            <Spacing size={20} />
            <SegmentedControl
              size="m"
              name="report-type"
              value={selectType}
              onChange={(value) => setSelectType(value)}
              options={options}
            />
            {/* <CustomSelect
              value={selectType}
              placeholder="Не задан"
              options={options}
              onChange={(e) => setSelectType(e.target.value)}
              renderOption={({ option, ...restProps }) => (
                <CustomSelectOption {...restProps} />
              )}
            /> */}
          </FormItem>
          <p>

          </p>
        </Div>
        <Spacing size={25} />
        {selectType === 'all' && <AllCollection selectCollection={selectCollection} />}
        {selectType === 'own' && <OwnReleases />}
        {selectType === 'wallet' && <ReleasesInWallet />}
      </Div>
    </SplitLayout>
  )
};

export default Collector;
