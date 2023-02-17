import { Button, Div, Spacing, Title } from "@vkontakte/vkui"

export const OwnReleases = () => {
  const handleClick = async () => {
    console.log('click')
  }
  return (
    <Div>
      <Title>OwnReleases</Title>
      <Spacing size={40} />
      <Button onClick={handleClick}>Mint</Button>
    </Div>
  )
}