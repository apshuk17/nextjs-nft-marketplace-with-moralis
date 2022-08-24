import { ethers } from "ethers"
import React, { createContext } from "react"
import { useMoralis } from "react-moralis"
import useUserNativeBalance from "../hooks/useUserNativeBalance"

export const MarketPlaceContext = createContext()

const MarketplaceProvider = ({ children }) => {
    const { authenticate, isAuthenticated, logout, user, isWeb3Enabled, account } = useMoralis()

    // Authenticated User's native balance
    const nativeBalance = useUserNativeBalance({
        address: user?.get("ethAddress"),
    })

    const getProviderData = () => {
        return {
            isAuthenticated,
            authenticate,
            logout,
            user,
            nativeBalance,
            isWeb3Enabled,
            account,
        }
    }

    return (
        <MarketPlaceContext.Provider value={getProviderData()}>
            {children}
        </MarketPlaceContext.Provider>
    )
}

export default MarketplaceProvider
