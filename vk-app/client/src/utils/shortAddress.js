export const shortAddress = (address) =>
  address ? `${address?.slice(0, 5)}...${address?.substr(-2)}` : ''