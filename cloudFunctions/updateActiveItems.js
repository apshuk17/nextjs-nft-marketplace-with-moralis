// Create a new table called "ActiveItem"
// Add items when they are listed on the marketplace
// Remove items when they are bought or cancelled

Moralis.Cloud.afterSave("ItemListed", async (request) => {
    // Every event gets triggered twice, once on unconfirmed, again on confirmed
    const confirmed = request.object.get("confirmed")
    const logger = Moralis.Cloud.getLogger()
    logger.info("Looking for confirmed Tx")
    if (confirmed) {
        logger.info("Found Item!")

        // Grab the "ActiveItem" table. Create the table if it does not exist
        const ActiveItem = Moralis.Object.extend("ActiveItem")

        // Check if item is already listed in the ActiveItem table,
        // If yes, first delete it and then add again with the updated price in the ActiveItem table.
        const query = new Moralis.Query(ActiveItem)
        query.equalTo("marketplaceAddress", request.object.get("address"))
        query.equalTo("nftAddress", request.object.get("nftaddress"))
        query.equalTo("tokenId", request.object.get("tokenId"))
        query.equalTo("seller", request.object.get("seller"))

        const itemAlreadyListed = await query.first()

        if (itemAlreadyListed) {
            logger.info(
                `Deleting already listed item from ActiveItem table with tokenId ${request.object.get(
                    "tokenId"
                )}`
            )

            await itemAlreadyListed.destroy()

            logger.info(
                `Deleted already listed item from ActiveItem table with tokenId ${request.object.get(
                    "tokenId"
                )}`
            )
        }

        // If not listed, add the item in ActiveItem table
        const activeItem = new ActiveItem()
        activeItem.set("marketplaceAddress", request.object.get("address"))
        activeItem.set("nftAddress", request.object.get("nftaddress"))
        activeItem.set("price", request.object.get("price"))
        activeItem.set("tokenId", request.object.get("tokenId"))
        activeItem.set("seller", request.object.get("seller"))

        logger.info(
            `Adding Address: ${request.object.get("address")} TokenId: ${request.object.get(
                "tokenId"
            )} at address ${request.object.get("address")} since it has been already listed`
        )
        logger.info("Saving...")
        await activeItem.save()
    }
})

Moralis.Cloud.afterSave("ItemCancelled", async (request) => {
    // Every event gets triggered twice, once on unconfirmed, again on confirmed
    const confirmed = request.object.get("confirmed")
    const logger = Moralis.Cloud.getLogger()
    logger.info(`Marketplace | Object: ${JSON.stringify(request.object)}`)
    if (confirmed) {
        // Grab the "ActiveItem" table
        const ActiveItem = Moralis.Object.extend("ActiveItem")

        // Query the Active Item table
        const query = new Moralis.Query(ActiveItem)
        query.equalTo("marketplaceAddress", request.object.get("address"))
        query.equalTo("nftAddress", request.object.get("nftAddress"))
        query.equalTo("tokenId", request.object.get("tokenId"))

        logger.info(`Marketplace | Query: ${query}`)

        const cancelledItem = await query.first()

        logger.info(`Marketplace | CancelledItem: ${cancelledItem}`)

        /** In all the 3 tables ItemListed, ItemBought and ItemCancelled
         * address field -- Contract address of the Marketplace Contract
         */
        if (cancelledItem) {
            logger.info(
                `Deleting item with tokenId ${request.object.get(
                    "tokenId"
                )} at address ${request.object.get("address")} since it was cancelled`
            )

            // Delete the item from "ActiveItem" table
            await cancelledItem.destroy()
        } else {
            logger.info(
                `No item was found with tokenId ${request.object.get(
                    "tokenId"
                )} at address ${request.object.get("address")}`
            )
        }
    }
})

Moralis.Cloud.afterSave("ItemBought", async (request) => {
    // Every event gets triggered twice, once on unconfirmed, again on confirmed
    const confirmed = request.object.get("confirmed")
    const logger = Moralis.Cloud.getLogger()
    logger.info(`Marketplace | Object: ${JSON.stringify(request.object)}`)

    if (confirmed) {
        const ActiveItem = Moralis.Object.extend("ActiveItem")

        // Query the Active Item table
        const query = new Moralis.Query(ActiveItem)
        query.equalTo("marketplaceAddress", request.object.get("address"))
        query.equalTo("nftAddress", request.object.get("nftAddress"))
        query.equalTo("tokenId", request.object.get("tokenId"))

        logger.info(`Marketplace | Query: ${query}`)

        const boughtItem = await query.first()

        if (boughtItem) {
            logger.info(
                `Deleting item with tokenId ${request.object.get(
                    "tokenId"
                )} at address ${request.object.get("address")} since it was sold`
            )

            // Delete the item from "ActiveItem" table
            await boughtItem.destroy()
        } else {
            logger.info(
                `No item was found with tokenId ${request.object.get(
                    "tokenId"
                )} at address ${request.object.get("address")}`
            )
        }
    }
})
