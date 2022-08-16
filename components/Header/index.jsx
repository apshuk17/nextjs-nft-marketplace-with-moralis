import Link from "next/link"
import { ConnectButton } from "../index"
import useMarketPlace from "../../hooks/useMarketPlace"

const Header = ({ pathname }) => {
    const { user, nativeBalance } = useMarketPlace()
    console.log("##user Header", user?.get("ethAddress"))

    console.log("##nativeBalance", nativeBalance, typeof nativeBalance)

    return (
        <header>
            <nav className="pb-4 border-b-2">
                <div className="flex justify-between px-4 items-center">
                    <h1 className="py-4 font-bold text-3xl">
                        <Link href="/">
                            <a>NFT Marketplace</a>
                        </Link>
                    </h1>
                    <div>
                        <ConnectButton />
                    </div>
                </div>
                <div className="flex justify-between px-4 min-h-[3rem]">
                    <ul className="flex items-center">
                        <li
                            className={`mr-[1rem] list-none ${
                                pathname === "/" ? "font-bold text-blue-500" : ""
                            }`}
                        >
                            <Link href="/">
                                <a>Home</a>
                            </Link>
                        </li>
                        <li
                            className={`mr-4 list-none ${
                                pathname === "/upload" ? "font-bold text-blue-500" : ""
                            }`}
                        >
                            <Link href="/upload">
                                <a>File Upload</a>
                            </Link>
                        </li>
                        <li
                            className={`mr-[1rem] list-none ${
                                pathname === "/sell-nft" ? "font-bold text-blue-500" : ""
                            }`}
                        >
                            <Link href="/sell-nft">
                                <a>Sell Nft</a>
                            </Link>
                        </li>
                    </ul>
                    {user?.get("ethAddress") && (
                        <div className="flex flex-col items-end font-bold">
                            <p>{user?.get("ethAddress")}</p>
                            <p>{`${nativeBalance} ETH`}</p>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    )
}

export default Header
