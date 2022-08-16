import styles from "../styles/Home.module.css"

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
    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h1 className={styles.title}>NFT Marketplace</h1>
            </main>
        </div>
    )
}
