import { Button, Card, Div, Spacing } from "@vkontakte/vkui"
import { getIdentIcon } from "../utils/fetPicelImg"
import { shortAddress } from "../utils/shortAddress"

export const ReleaseCard = ({ onClick, item, load, link, tokenId, collection, buttonText, ...rest }) => {
  return (
    <Card Card {...rest} >
      <Div style={{ textAlign: 'center', padding: '20px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {getIdentIcon(`${item['leafId']}${item['releaseId']}${item['root']}${tokenId}`, 100)}
        <Div>
          <Spacing size={10} />
          {collection && `collection: ${shortAddress(collection)}`}
          {item['leadId'] && `leafId: ${item['leafId']}`}
          <Spacing size={5} />
          {item['releaseId'] && `releaseId: ${item['releaseId']}`}
        </Div>
        {tokenId && `tokenId: ${tokenId}`}
        <Spacing size={10} />
        <Div>
          {link && <a href={link} target='_blank'><Button>
            Посмотреть на EtherScan
          </Button></a>}
          {onClick && link && <Spacing size={20} />}
          {onClick && <Button disabled={load} loading={load} stretched onClick={() => onClick(item)}>
            {buttonText}
          </Button>}
        </Div>
      </Div>
    </Card >
  )
}