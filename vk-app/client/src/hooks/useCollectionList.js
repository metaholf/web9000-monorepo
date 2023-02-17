import { useEffect, useState } from "react"
import { getFactoryContract } from "../utils/getContract"

export const useCollectionList = () => {
  const [list, setList] = useState([])
  const [load, setLoad] = useState(false)

  const getList = async () => {
    try {
      const [account] = await window.ethereum?.request({
        method: "eth_requestAccounts",
      });
      setLoad(true)
      const factoryContract = getFactoryContract()
      const res = await factoryContract.getAllCollectionsByOwner(account)
      setList(res)
      setLoad(false)
    } catch (err) {
      console.log('Get all collections by owner:', err)
      setLoad(false)
    }
  }

  useEffect(() => {
    if (!list.length)
      getList()
  }, [list])

  return { load, list }
}

export const useAllCollectionList = () => {
  const [list, setList] = useState([])
  const [load, setLoad] = useState(false)

  const getList = async () => {
    try {
      setLoad(true)
      const factoryContract = getFactoryContract()
      const res = await factoryContract.getAllCollections()
      setList(res)
      setLoad(false)
    } catch (err) {
      console.log('Get all collections:', err)
      setLoad(false)
    }
  }

  useEffect(() => {
    if (!list.length)
      getList()
  }, [list])

  return { load, list }
}