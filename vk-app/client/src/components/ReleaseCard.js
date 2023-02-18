import { Button, Card, Div, Spacing } from "@vkontakte/vkui"
import { getIdentIcon } from "../utils/fetPicelImg"

export const ReleaseCard = ({ onClick, item, load, link, ...rest }) => {
  return (
    <Card Card {...rest} >
      <Div style={{ textAlign: 'center', padding: '20px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {getIdentIcon(`${item['leafId']}${item['releaseId']}${item['root']}`, 100)}
        <Div>
          {item['leadId'] && `leafId: ${item['leafId']}`}
          <Spacing size={10} />
          {item['releaseId'] && `releaseId: ${item['releaseId']}`}
        </Div>
        {link && <a href={link} target='_blank'><Button>
          View on EtherScan
        </Button></a>}
        {onClick && <Button disabled={load} loading={load} stretched onClick={() => onClick(item)}>
          Mint
        </Button>}
      </Div>
    </Card >
  )
}