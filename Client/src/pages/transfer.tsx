import { useState } from "react"
import { sendSol } from "../lib/solana"
import { Keypair, PublicKey } from "@solana/web3.js"
import { sendEth } from "../lib/ethers"
import { decryption } from "../lib/encryption"
import type { Account } from "./dashboard"

export default function Transfer({ account, password }: { account: Account, password: string }) {
    const [token, setToken] = useState("sol")
    const [address, setAddress] = useState("")
    const [amount, setAmount] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleTransfer() {
        if (!address || !amount) return alert("Fill all fields")

        try {
            setLoading(true)
            if (token === 'sol') {
                const key = {
                    encrypted: account.sol.encryptSolKey,
                    salt: account.sol.salt,
                    iv: account.sol.iv
                }
                const secretKey = await decryption(password, key)
                console.log(secretKey)
                const value = new Uint8Array(Buffer.from(secretKey))
                console.log(value)
                const decoded = Uint8Array.from(
                    Buffer.from(secretKey)
                )
                console.log(decoded)
                const receipent = new PublicKey(address)
                const solSender = Keypair.fromSecretKey(decoded)
                const receipt = await sendSol(solSender, receipent, Number(amount))
                console.log(receipt)
            }
            else {
                const key = {
                    encrypted: account.eth.encryptEthKey,
                    salt: account.eth.salt,
                    iv: account.eth.iv
                }
                const value = await decryption(password, key)
                const secretKey = "0x" + [...value].map(b => b.toString(16).padStart(2, "0")).join("")
                const ethSender = {
                    publicKey: account.eth.ethPublicKey,
                    secretKey: secretKey
                }
                const receipt = await sendEth(ethSender, address, Number(amount))
                console.log(receipt)
            }
        } catch (e) {
            console.error(e)
            alert("Transaction failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-2xl p-6 space-y-6">

            <div className="space-y-1">
                <h2 className="text-xl font-semibold">Transfer</h2>
                <p className="text-sm text-gray-500">Send crypto securely</p>
            </div>

            <div className="space-y-2">
                <label className="text-sm text-gray-600">Select Network</label>
                <select
                    onChange={(e) => setToken(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                >
                    <option value="sol">Solana</option>
                    <option value="eth">Ethereum</option>
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-sm text-gray-600">Recipient Address</label>
                <input
                    type="text"
                    placeholder="Enter wallet address"
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm text-gray-600">Amount</label>
                <input
                    type="number"
                    placeholder="0.00"
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                />
            </div>

            <button
                onClick={handleTransfer}
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-lg text-sm font-medium hover:bg-gray-900 transition disabled:opacity-50"
            >
                {loading ? "Sending..." : "Send"}
            </button>

        </div>
    )
}