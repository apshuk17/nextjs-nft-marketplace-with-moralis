import { useEffect, useCallback, useState } from "react";
import { useMoralisWeb3Api } from "react-moralis";
import { ethers } from "ethers";

const useUserNativeBalance = ({ address }) => {
  const Web3Api = useMoralisWeb3Api();

  const [addressBalance, setAddressBalance] = useState("0");

  useEffect(() => {
    (async () => {
      if (address) {
        const nativeBalance = await fetchNativeBalance(address);
        setAddressBalance(ethers.utils.formatUnits(nativeBalance?.balance, "18"));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const fetchNativeBalance = useCallback(
    async (address) => {
      // get Polygon Mumbai native balance for a given address
      const options = {
        chain: "rinkeby",
        address,
      };
      return await Web3Api.account.getNativeBalance(options);
    },
    [Web3Api.account]
  );

  return addressBalance;
};

export default useUserNativeBalance;
