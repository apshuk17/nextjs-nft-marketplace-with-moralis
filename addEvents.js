const Moralis = require("moralis/node")
require("dotenv").config()

const contractAddresses = require("./constants/networkMapping.json")

const chainId = process.env.CHAINID.toString().trim()
const moralisChainId = chainId === "31337" ? "1337" : chainId


const contractAddress = contractAddresses[chainId]["NftMarketplace"][0]

/* Moralis init code */
const serverUrl = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL
const appId = process.env.NEXT_PUBLIC_MORALIS_APP_ID
const masterKey = process.env.MORALIS_MASTER_KEY


const main = async () => {
    await Moralis.start({ serverUrl, appId, masterKey })
    console.log(`Working with contract address ${contractAddress}`)

    const itemListedOptions = {
        // Moralis understands a local chainId 1337 only
        chainId: moralisChainId,
        address: contractAddress,
        sync_historical: true,
        topic: "ItemListed(address,address,uint256,uin256)",
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "seller",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "nftaddress",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "price",
                    type: "uint256",
                },
            ],
            name: "ItemListed",
            type: "event",
        },
        tableName: "ItemListed",
    }

    const itemBoughtOptions = {
        chainId: moralisChainId,
        address: contractAddress,
        sync_historical: true,
        topic: "ItemBought(address,address,uint256,uin256)",
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "buyer",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "nftAddress",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "price",
                    type: "uint256",
                },
            ],
            name: "ItemBought",
            type: "event",
        },
        tableName: "ItemBought",
    }

    const itemCancelledOptions = {
        chainId: moralisChainId,
        address: contractAddress,
        sync_historical: true,
        topic: "ItemBought(address,address,uint256)",
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "canceller",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "nftAddress",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
            ],
            name: "ItemCancelled",
            type: "event",
        },
        tableName: "ItemCancelled",
    }

    const listedResponse = await Moralis.Cloud.run("watchContractEvent", itemListedOptions, { useMasterKey: true });
    const boughtResponse = await Moralis.Cloud.run("watchContractEvent", itemBoughtOptions, { useMasterKey: true });
    const cancelledResponse = await Moralis.Cloud.run("watchContractEvent", itemCancelledOptions, { useMasterKey: true });

    if (listedResponse.success) {
        console.log("Success! Database updated with listing events")
    } else {
        console.log("Something went wrong with listing...", listedResponse)
    }

    if (boughtResponse.success) {
        console.log("Success! Database updated with buying events")
    } else {
        console.log("Something went wrong with buying...")
    }

    if (cancelledResponse.success) {
        console.log("Success! Database updated with cancel events")
    } else {
        console.log("Something went wrong with cancel...")
    }
}

;(async () => {
    try {
        await main()
        process.exit(0)
    } catch (err) {
        console.log("##Error", err)
        process.exit(1)
    }
})()
