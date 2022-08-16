import Head from "next/head"
import { useRouter } from "next/router"
import { MoralisProvider } from "react-moralis"
import { Header } from "../components"
import MarketplaceProvider from "../context/MarketplaceProvider"
import "../styles/globals.css"

const appId = process.env.NEXT_PUBLIC_MORALIS_APP_ID
const serverUrl = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL

function MyApp({ Component, pageProps }) {
    const { pathname } = useRouter()
    return (
        <div>
            <Head>
                <title>NFT Marketplace</title>
                <meta name="description" content="A minimalistic NFT Marketplace" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MoralisProvider appId={appId} serverUrl={serverUrl}>
                <MarketplaceProvider>
                    <Header pathname={pathname} />
                    <Component {...pageProps} />
                </MarketplaceProvider>
            </MoralisProvider>
        </div>
    )
}

export default MyApp
