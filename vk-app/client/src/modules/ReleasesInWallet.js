import { CardGrid, Div, Spinner, SplitLayout } from "@vkontakte/vkui"
import { useEffect, useState } from "react"
import { useAllCollectionList } from "../hooks/useCollectionList"
import { getContract } from "../utils/getContract"
import ERC721Bbi from '../config/abi/erc721.json'
import { ReleaseCard } from "../components/ReleaseCard"
import { ethers } from "ethers"
import { Modal } from "../components/Modal"
import { QRCode } from 'react-qr-svg';

export const ReleasesInWallet = () => {
  const { load, list } = useAllCollectionList()
  const [fetching, setFetching] = useState(load)
  const [myList, setMyList] = useState([])
  const [popout, setPopout] = useState(null);
  const onClose = () => setPopout(null)

  const onCreateCollection = (data) => {
    console.log(data)
    setPopout(
      <Modal minWidth='300px' onClose={onClose} title='QR code' >
        <QRCode
          level="Q"
          style={{ width: 300 }}
          value={JSON.stringify(data)}
        />
      </Modal >);
  }


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
          const nfts = Array.from(Array(data.length)).map((element, index) => { return { collection: collection['sc'], tokenId: data[index] } })
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

  const messageToSign = async () => {
    try {
      if (!window.ethereum)
        setError("Please connect your wallet before signing a message!");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const timestamp = new Date().getTime()
      const blockNumber = await provider.getBlockNumber()
      const address = await signer.getAddress();
      const block = await provider.getBlock(blockNumber) //hashBlock
      const message = JSON.stringify({
        t: ethers.utils.hexlify(timestamp),
        a: address.toLocaleLowerCase(),
        bn: ethers.utils.hexlify(blockNumber),
        bh: block.hash
      })
      const signatureHash = await signer.signMessage(message);
      onCreateCollection({
        t: ethers.utils.hexlify(timestamp),
        s: signatureHash,
        a: address.toLocaleLowerCase(),
        bn: ethers.utils.hexlify(blockNumber),
        bh: block.hash
      })
      console.log({
        timestamp,
        signatureHash,
        address,
        block
      })
      return {
        timestamp,
        signatureHash,
        address,
        block
      };
    } catch (err) {
      console.log(err.message);
    }
  };

  if (fetching) return (
    <Div>
      <Spinner size="large" style={{ margin: '20px 0' }} />
    </Div>)

  return (
    <SplitLayout style={{ display: 'block' }} popout={popout}>
      <Div style={{ widows: '100%' }}>
        <CardGrid>
          {myList.length ? [...myList].map((item, i) =>
            <ReleaseCard item={item.tokenId} key={i} tokenId={item.tokenId} onClick={messageToSign} buttonText='Показать QR' collection={item.collection} link={`https://goerli.etherscan.io/nft/${item.collection}/${item.tokenId}`} />
          ) : <Div>У вас пока еще нет NFT на кошельке.</Div>}
        </CardGrid>
      </Div>
    </SplitLayout>
  )
}