import { Button, Div, Spacing, Title } from "@vkontakte/vkui"

export const CollectionItem = ({ sc, name, symbol, owner, onBack }) => {
  console.log(sc, name, symbol, owner)

  return (
    <Div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Title>{name}</Title>
        <Button onClick={onBack}>Back</Button>
      </div>
      <Spacing size={40} />
    </Div>
  )
}