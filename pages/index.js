import { useMoralisQuery } from "react-moralis"
import NftBox from "../components/NftBox"
import useMarketPlace from "../hooks/useMarketPlace"

// How do we show the recently listed NFT's

// We will index the events off-chain and then read from our database
// Setup a server to listen for those events to be fired, and add them to a database to query.

// Woah, isn't that centralized?

// The Graph does this in a decentralized way.
// Moralis does this in a centralized way and comes with a ton of other features

// All our logic is still 100% onChain.
// Speed and development time.
// It's really hard to start a prod project 100% decentarlized
//

export default function Home() {
    const { data: listedNfts, isFetching: fetchingListedNfts } = useMoralisQuery(
        // Table Name,
        // A query function
        "ActiveItem",
        (query) => query.limit(10).descending("tokenId")
    )

    const { isWeb3Enabled } = useMarketPlace()

    return (
        <div className="container mx-auto py-4">
            <h1 className="text-3xl my-6 font-bold">Recently Listed</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-1">
                {isWeb3Enabled ? (
                    fetchingListedNfts ? (
                        <div>Loading...</div>
                    ) : (
                        listedNfts.map((nft) => {
                            const { marketplaceAddress, nftAddress, price, seller, tokenId } =
                                nft?.attributes

                            return (
                                <div key={tokenId}>
                                    <NftBox
                                        marketplaceAddress={marketplaceAddress}
                                        nftAddress={nftAddress}
                                        price={price}
                                        seller={seller}
                                        tokenId={tokenId}
                                    />
                                </div>
                            )
                        })
                    )
                ) : (
                    <div>Web3 is currently not enabled</div>
                )}
            </div>
        </div>
    )
}
