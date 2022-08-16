import React from "react"
import useMarketPlace from "../../hooks/useMarketPlace"

const ConnectButton = () => {
    const { isAuthenticated, authenticate, logout } = useMarketPlace()

    const login = async () => {
        try {
            if (!isAuthenticated) {
                const user = await authenticate({
                    signingMessage: "Log in using Moralis",
                })
                // const user = await response();
                // console.log('##user Authenticate', user);
            }
        } catch (err) {
            console.error("##error", error)
        }
    }

    const logOut = async () => {
        await logout()
        console.log("logged out")
    }

    return (
        <button
            className="rounded bg-blue-500 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 font-bold"
            onClick={!isAuthenticated ? login : logOut}
        >
            {!isAuthenticated ? "Metamask Login" : "Logout"}
        </button>
    )
}

export default ConnectButton
