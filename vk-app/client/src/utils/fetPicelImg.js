import Identicon from 'identicon.js'
import { randomNumber } from './randomNumber';


export const getIdentIcon = (hash, size = 200) => {
  const options = {
    foreground: [randomNumber(0, 255), randomNumber(0, 255), randomNumber(0, 255)],
    background: [randomNumber(0, 255), randomNumber(0, 255), randomNumber(0, 255)],
    margin: 0.1,
    size,
    format: 'png'
  };

  const data = new Identicon(hash, options).toString();

  return <img width={size} height={size} src={`data:image/png+xml;base64,${data}`} />
}



