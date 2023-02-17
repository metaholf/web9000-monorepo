import { useEffect, useState } from "react"

export const getCollectionTokens =  (sc) => {

      const [list, setList] = useState([])
      const [load, setLoad] = useState(false)

      const getList = async () => {
        setLoad(true)
        let response = await fetch('http://localhost:4000/getCollectionTokens', {
            method: 'POST',
            body: JSON.stringify({ collection: sc }),
            referrerPolicy: 'no-referrer',
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            }
          });
    
          const resp  = (await response.json()).result || {};
    
          let res = [];
          Object.keys(resp).forEach(key => {
            res.push(resp[key]);
          });

          setList(res)
          setLoad(false)
      }

    useEffect(() => {
        if (!list.length)
        getList()
    }, [list])

      return { load, list }
  }

  export const getUserTokens =  (user) => {

    const [list, setList] = useState([])
    const [load, setLoad] = useState(false)

    const getList = async () => {
      setLoad(true)
      let response = await fetch('http://localhost:4000/merkle-tree-proofs', {
          method: 'POST',
          body: JSON.stringify({ address: user }),
          referrerPolicy: 'no-referrer',
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          }
        });
  
        const resp  = (await response.json()).result || {};
  
        let res = [];
        Object.keys(resp).forEach(key => {
          res.push(resp[key]);
        });

        setList(res)
        setLoad(false)
    }

  useEffect(() => {
      if (!list.length)
      getList()
  }, [list])

    return { load, list }
}