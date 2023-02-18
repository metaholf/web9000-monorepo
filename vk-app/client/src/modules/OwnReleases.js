import { Button, Card, CardGrid, Div, Spacing, Spinner, Title } from "@vkontakte/vkui"
import { useEffect, useState } from "react"
import { useAllCollectionList } from "../hooks/useCollectionList"
import { getContract } from "../utils/getContract"
import ERC721Abi from '../config/abi/erc721.json'

export const OwnReleases = () => {
  const { list, load } = useAllCollectionList()
  const [fetching, setFetching] = useState(load)
  const [myList, setMyList] = useState([])

  const getCollectionsCanGet = async () => {
    setFetching(true)
    try {
      const [account] = await window.ethereum?.request({
        method: "eth_requestAccounts",
      });
      // list.slice(list.length - 5, list.length).forEach(async (collection) => {
      // console.log(collection['sc'], "collection['sc']")
      const response = await fetch(`${process.env.REACT_APP_API_URL}/merkle-tree-proofs`, {
        method: 'POST',
        body: JSON.stringify({ address: account.toLowerCase() }),
        referrerPolicy: 'no-referrer',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        }
      });
      const data = (await response.json()).result || {};
      console.log(data)
      setMyList(Object.values(data))


      setFetching(false)
    } catch (err) {
      console.log('getCollectionsCanGet: ', err)
      setFetching(false)
    }
  }

  const handleMint = async ({ releaseId, leafId, proof, collection }) => {
    try {
      const contractCollection = getContract(collection, ERC721Abi)
      const tx = await contractCollection.mint(releaseId, leafId, proof)
      console.log(tx)
    } catch (err) {
      console.log('handleMint: ', err)
    }
  }

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
      <Title>OwnReleases</Title>
      <Spacing size={40} />
      <Spacing size={40} />
      <CardGrid>
        {myList.length ? myList.map((item, i) =>
          <Card key={i}>
            <p>leafId: {item['leafId']}</p>
            <p>releaseId: {item['releaseId']}</p>
            <Button onClick={() => handleMint(item)}>
              Mint
            </Button>
          </Card>) : null}
      </CardGrid>
    </Div>
  )
}