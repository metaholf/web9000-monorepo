import { useState } from "react"
import { CardGrid, Button, Div, Card, Spacing, Title } from "@vkontakte/vkui"
import { getCollectionTokens } from "../hooks/collectionTokens"
import { getIdentIcon } from "../utils/fetPicelImg"

const buttonGridStyle = { width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '20px' }

export const CollectionItem = ({ sc, name, symbol, owner, onBack }) => {
  console.log(sc, name, symbol, owner)

  const { list, load } = getCollectionTokens(sc)
  console.log(list)

  return (
    <Div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Title>{name} ({symbol})</Title>
        
        <p>owner: {owner}</p>
        <Button onClick={onBack}>Back</Button>
      </div>
      <Spacing size={40} />
      <CardGrid>
        {list.length ? list.map((item) =>
          <Card>
            <Button style={buttonGridStyle} >
              <p>leafId: {item['leafId']}</p>
              <p>releaseId: {item['releaseId']}</p>
            </Button>
          </Card>) : null}
        </CardGrid>

      <Spacing size={40} />
    </Div>
  )
}