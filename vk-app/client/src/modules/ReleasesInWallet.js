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
        // console.log(tx.length, 'tx')
        const res = tx.map(item => item?.toString())
        const data = res.filter(item => !!item)
        // console.log(data);
        if (data?.length) {
          const nfts = Array.from(Array(data.length)).map((element, index) => { return{collection: collection['sc'], tokenId: data[index]}})
          arr.push(...nfts)
          console.log(arr);
          setMyList([...arr])
        }

      })
      setFetching(false)
    } catch (err) {
      console.log('getCollectionsCanGet: ', err)
      setFetching(false)
    }
  }
  // console.log(myList)
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
          <ReleaseCard item={item.tokenId} key={i} tokenId={item.tokenId} collection={item.collection} link={`https://goerli.etherscan.io/nft/${item.collection}/${item.tokenId}`} />
        ) : <Div>У вас пока еще нет NFT на кошельке.</Div>}
      </CardGrid>
    </Div>
  )
}