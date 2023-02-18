import { Icon20QuestionOutline } from "@vkontakte/icons"
import { CardGrid, Div, Spinner, Card, Button, Title, Spacing, SplitLayout, ActionSheet, ActionSheetItem } from "@vkontakte/vkui"
import { CustomTooltip } from "../components/CustomTooltip"
import { configText } from "../config"
import { useCollectionList } from "../hooks/useCollectionList"
import { shortAddress } from "../utils/shortAddress"

const buttonGridStyle = { width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '20px' }

export const CollectionList = ({ selectCollection, goToCreateCollection }) => {
  const { list, load } = useCollectionList()


  if (load) return (
    <Div>
      <Spinner size="large" style={{ margin: '20px 0' }} />
    </Div>)

  return (

    <Div>
      <Title style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <p style={{ flex: 'none' }}>
          Choose a collection for release
        </p>
        <CustomTooltip text={configText.creatorCollectionList} />
      </Title>
      <Spacing size={40} />
      <CardGrid>
        {list.length ? [...list].reverse().map((item) =>
          <Card key={item['sc']}>
            <Button style={buttonGridStyle} onClick={() => selectCollection(item['sc'])}>
              <p>Name: {item['name']}</p>
              <p>Symbol: {item['symbol']}</p>
              <span>Address: {shortAddress(item['sc'])}</span>
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

  )
}