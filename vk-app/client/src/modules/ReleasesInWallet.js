import { CardGrid, Div, Spinner } from "@vkontakte/vkui"
import { useEffect, useState } from "react"
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
    <Div style={{ widows: '100%' }}>
      <CardGrid>
        {myList.length ? [...myList].map((item, i) =>
          <ReleaseCard item={item} key={i} link={`https://goerli.etherscan.io/address/${item}`} />
        ) : <Div>You don't have hft in your wallet yet.</Div>}
      </CardGrid>
    </Div>
  )
}