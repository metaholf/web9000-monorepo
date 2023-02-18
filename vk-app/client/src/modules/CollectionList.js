import { Icon20AddCircle } from "@vkontakte/icons"
import { CardGrid, Div, Spinner, Card, Button, Title, Spacing, SplitLayout } from "@vkontakte/vkui"
import { useState } from "react"
import { Modal } from "../components/Modal"
import { useCollectionList } from "../hooks/useCollectionList"
import { shortAddress } from "../utils/shortAddress"
import { CreateCollection } from "./CreateCollection"

const buttonGridStyle = { width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '20px' }

export const CollectionList = ({ selectCollection, goToCreateCollection }) => {
  const { list, load, refetch } = useCollectionList()
  const [popout, setPopout] = useState(null);
  const onClose = () => setPopout(null)

  const onCreateCollection = () => setPopout(
    <Modal onClose={onClose} title='Создать новую коллекцию' >
      <CreateCollection onFinish={() => {
        onClose()
        refetch()
      }} />
    </Modal >);

  const onCreateRelease = () => setPopout(
    <Modal onClose={onClose} title='Создать новую коллекцию' >
      <CreateCollection onFinish={() => {
        onClose()
        refetch()
      }} />
    </Modal >);

  if (load) return (
    <Div>
      <Spinner size="large" style={{ margin: '20px 0' }} />
    </Div>)

  return (
    <SplitLayout popout={popout}>
      <Div>
        <Title style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Choose a collection for release
          <Button size='m' onClick={onCreateCollection} before={<Icon20AddCircle />}> Add collection
          </Button>
        </Title>
        <Spacing size={40} />
        <CardGrid>
          {list.length ? [...list].reverse().map((item) =>
            <Card key={item['sc']}>
              <Button style={buttonGridStyle} onClick={() => selectCollection(item['sc'])}>
                <p>Название: {item['name']}</p>
                <p>Тикер: {item['symbol']}</p>
                <span>Адрес: {shortAddress(item['sc'])}</span>
              </Button>
            </Card>) : null}
        </CardGrid>
        {!list.length && <>
          <Div style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <Div>List is empty... Create a collection</Div>
            <Spacing size={20} />
            <Button onClick={goToCreateCollection}>Create</Button>
          </Div>
        </>}
      </Div>
    </SplitLayout>
  )
}