import { CardGrid, Div, Spinner} from "@vkontakte/vkui"
import { useEffect, useState } from "react"
import { useAllCollectionList } from "../hooks/useCollectionList"
import { getContract } from "../utils/getContract"
import ERC721Abi from '../config/abi/erc721.json'
import { ReleaseCard } from "../components/ReleaseCard"
import { prepareRelayerData, sendTxToRelayer } from "../utils/relayerHelper"

export const OwnReleases = () => {
  const { list, load } = useAllCollectionList()
  const [fetching, setFetching] = useState(load)
  const [myList, setMyList] = useState([])
  const [fetchingMint, setFetchingMint] = useState(false)

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

      const arr = Object.values(data)
      const nonClaimed = []
      arr.forEach(async (item) => {
        try {
          const contractCollection = getContract(item['collection'], ERC721Abi)
          const res = await contractCollection.claimed(item['releaseId'], item['leafId'])
          if (!res)
            nonClaimed.push(item)

        }
        catch (err) {
          console.log('claimedBatch: ', err)
        }
        setMyList([...nonClaimed])
      })


      setFetching(false)
    } catch (err) {
      console.log('getCollectionsCanGet: ', err)
      setFetching(false)
    }
  }

  const handleMint = async ({ releaseId, leafId, proof, collection }) => {
    try {
      setFetchingMint(true)
      const contractCollection = getContract(collection, ERC721Abi)

      //
      // GAS RELAY FIX
      //
      const relayData = await prepareRelayerData(contractCollection.address, contractCollection.interface.encodeFunctionData("mint", [releaseId, leafId, proof]));
      const tx = await sendTxToRelayer(relayData);
      // const tx = await contractCollection.mint(releaseId, leafId, proof)

      tx.wait().then((res) => {
        console.log(res);
        getCollectionsCanGet()
        setFetchingMint(false);
        return;
      }).catch((err) => {
        console.log(err);
        setFetchingMint(false);
        return;
      });
    } catch (err) {
      setFetchingMint(false)
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
    <Div style={{ widows: '100%' }}>
      <CardGrid>
        {myList.length ? [...myList].map((item, i) =>
          <ReleaseCard load={fetchingMint} item={item} collection={item['collection']} onClick={handleMint} key={i} />
        ) : <Div>Список доступных токенов пуст</Div>}
      </CardGrid>
    </Div>
  )
}