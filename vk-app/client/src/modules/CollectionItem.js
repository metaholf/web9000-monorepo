import { CardGrid, Button, Div, Card, Spacing, Title, Spinner } from "@vkontakte/vkui"
import { getCollectionTokens } from "../hooks/collectionTokens"
import { ReleaseCard } from "../components/ReleaseCard"

export const CollectionItem = ({ sc, name, symbol, owner, onBack }) => {
  const { list, load } = getCollectionTokens(sc)

  if (load) return (
    <Div>
      <Spinner size="large" style={{ margin: '20px 0' }} />
    </Div>
  )

  return (
    <Div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Title>{name} ({symbol})</Title>

        <p>owner: {owner}</p>
        <Button onClick={onBack}>Back</Button>
      </div>
      <Spacing size={40} />
      <CardGrid>
        {list.length ? list.map((item, i) =>
          <ReleaseCard item={item} key={i} />) : <Div>Has not released yet</Div>}
      </CardGrid>

      <Spacing size={40} />
    </Div>
  )
}