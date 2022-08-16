import { useContext } from 'react'
import { MarketPlaceContext } from "../context/MarketplaceProvider";


const useMarketPlace = () => {
  return useContext(MarketPlaceContext);
}

export default useMarketPlace