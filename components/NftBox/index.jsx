import Image from "next/image"
import { useState, useEffect } from "react"
import { useWeb3Contract } from "react-moralis"
import nftAbi from "../../constants/BasicNft.json"
import useMarketPlace from "../../hooks/useMarketPlace"
import { Card } from "web3uikit"
import { ethers } from "ethers"

const truncateStr = (fullStr, strLen) => {
    if (fullStr.length <= strLen) return fullStr

    const separator = "..."
    const seperatorLength = separator.length
    const charsToShow = strLen - seperatorLength
    const frontChars = Math.ceil(charsToShow / 2)
    const backChars = Math.floor(charsToShow / 2)
    return (
        fullStr.substring(0, frontChars) +
        separator +
        fullStr.substring(fullStr.length - backChars)
    )
}

const NftBox = ({ marketplaceAddress, nftAddress, price, seller, tokenId }) => {
    const [imageURI, setImageURI] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")

    const { isWeb3Enabled, account } = useMarketPlace()

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            tokenId,
        },
    })

    const isOwnedByUser = seller === account || seller === undefined
    const formattedSellerAddress = isOwnedByUser ? "you" : truncateStr(seller || '', 15)

    const updateUi = async () => {
        const tokenURI = await getTokenURI()
        // we are going to cheat a little here....
        // Since all browsers are not IPFS compatible so we'll use IPFS gateway
        if (tokenURI) {
            // IPFS Gateway: A server that return ipfs files from a "normal" URL
            const requestUrl = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            const tokenURIResponse = await (await fetch(requestUrl)).json()

            const imageURI = tokenURIResponse?.image
            const imageURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            setImageURI(imageURL)

            setTokenName(tokenURIResponse?.name)
            setTokenDescription(tokenURIResponse?.description)
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUi()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isWeb3Enabled])

    return (
        <div>
            <div className="w-[320px] h-[320px] md:w-[400px] md:h-[400px]">
                {imageURI ? (
                    <Card title={tokenName} description={tokenDescription}>
                        <div>#{tokenId}</div>
                        <div className="italic text-sm">Owned by: {formattedSellerAddress}</div>
                        <Image src={imageURI} alt={`nft-${tokenId}`} width={300} height={300} />
                        <div className="font-bold">
                            Price: {ethers.utils.formatEther(price)}
                            {` ETH`}
                        </div>
                    </Card>
                ) : (
                    <p>is Loading...</p>
                )}
            </div>
        </div>
    )
}

export default NftBox
