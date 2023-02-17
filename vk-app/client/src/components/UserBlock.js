import { Avatar, Cell, Group, Header } from "@vkontakte/vkui"

export const UserBlock = ({ data }) => {
  return (
    <Group header={<Header mode="secondary">Create nft collection</Header>}>
      <Cell
        before={data.photo_200 ? <Avatar src={data.photo_200} /> : null}
        description={data.city && data.city.title ? data.city.title : ''}
      >
        {`${data.first_name} ${data.last_name}`}
      </Cell>
    </Group>
  )
}