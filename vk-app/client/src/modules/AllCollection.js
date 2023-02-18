import { Button, Card, CardGrid, Div, Spinner } from "@vkontakte/vkui"
import { useAllCollectionList } from "../hooks/useCollectionList"
import { shortAddress } from "../utils/shortAddress"

const buttonGridStyle = { width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '20px' }

export const AllCollection = ({ selectCollection }) => {
  const { list, load } = useAllCollectionList()
  console.log(list)

  if (load) return (
    <Div>
      <Spinner size="large" style={{ margin: '20px 0' }} />
    </Div>)

  return (
    <Div style={{ widows: '100%' }}>
      <CardGrid>
        {list.length ? [...list].reverse().map((item) =>
          <Card key={item['sc']}>
            <Button style={buttonGridStyle} onClick={() => selectCollection({ sc: item['sc'], name: item['name'], symbol: item['symbol'], owner: item['owner'] })}>
              <p>Название: {item['name']}</p>
              <p>Тикер: {item['symbol']}</p>
              <span>Адрес: {shortAddress(item['sc'])}</span>
            </Button>
          </Card>) : null}
      </CardGrid>
      {!list.length && <>
        <Div style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <Div>Список коллекций пуст </Div>
        </Div>
      </>}
    </Div>
  )
}