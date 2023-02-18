import { CardGrid, Div, Spacing, Spinner, Title } from "@vkontakte/vkui"
import { useEffect, useState } from "react"
import { CustomTooltip } from "../components/CustomTooltip"
import { configText } from "../config"
import { useAllCollectionList } from "../hooks/useCollectionList"
import { getContract } from "../utils/getContract"
import ERC721Bbi from '../config/abi/erc721.json'
import { ReleaseCard } from "../components/ReleaseCard"

export const ReleasesInWallet = () => {
  const { load, list } = useAllCollectionList()
  const [fetching, setFetching] = useState(load)
  const [myList, setMyList] = useState([])

  const getCollectionsCanGet = async () => {
    setFetching(true)
    let arr = []
    try {
      const [account] = await window.ethereum?.request({
        method: "eth_requestAccounts",
      });
      list.slice(list.length - 10, list.length).forEach(async (collection) => {
        const contract = getContract(collection['sc'], ERC721Bbi)
        const tx = await contract.getUserTokens(account)
        console.log(tx, 'tx')
        const res = tx.map(item => item?.toString())
        const data = res.filter(item => !!item)
        if (data?.length) {
          const nfts = Array.from(Array(data.length)).map(() => collection['sc'])
          arr.push(...nfts)
          setMyList([...arr])
        }

      })
      setFetching(false)
    } catch (err) {
      console.log('getCollectionsCanGet: ', err)
      setFetching(false)
    }
  }
  console.log(myList)
  useEffect(() => {
    if (list.length) {
      getCollectionsCanGet()
    }
  }, [list.length])
  if (fetching) return (
    <Div>
      <Spinner size="large" style={{ margin: '20px 0' }} />
    </Div>)

  return (
    <Div>
      <Title style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <p style={{ flex: 'none' }}>
          Releases in my wallet
        </p>
        <CustomTooltip text={configText.collectorReleasesInWallet} />
      </Title>
      <Spacing size={40} />
      <CardGrid>
        {myList.length ? [...myList].map((item, i) =>
          <ReleaseCard item={item} key={i} link={`https://goerli.etherscan.io/address/${item}`} />
        ) : <Div>You don't have hft in your wallet yet.</Div>}
      </CardGrid>
    </Div>
  )
}