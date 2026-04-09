import type { Account } from "./dashboard"
import { useEffect, useState } from "react"
import { db } from "../lib/db"
import { useNavigate } from "react-router-dom"
import { addAcc } from "../lib/seed"
import { Card } from "../components/Card"

export default function Home({ username, password,handleAccount }: { username: string, password: string,handleAccount:(account : Account | null)=>void}) {
    const [accounts, setAccounts] = useState<Account[]>([])
    const [account, setAccount] = useState<Account | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        async function getAccounts() {

            if (!username || !password) {
                navigate('/')
                return
            }
            const value = await db.getAll('accounts')
            if (value.length === 0) {
                const res = await addAcc(password, username, '0')
                if(res===undefined) return
                setAccounts([res])
                setAccount(res)
            }
            else {
                setAccounts(value)
                setAccount(value[0])
            }
        }
        getAccounts()
    }, [])

    useEffect(()=>{
        if(account===undefined) return
        handleAccount(account)
    },[account])

    async function addAccount() {
        const index = accounts.length
        const res = await addAcc(password, username, index.toString())
        if(res===undefined) return
        setAccounts(prev => [...prev, res])
        setAccount(res)
    }

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold text-black">Accounts</h2>
                    <p className="text-sm text-gray-500">Manage your wallets</p>
                </div>

                <button 
                    onClick={addAccount}
                    className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-900 transition"
                >
                    + Add Account
                </button>
            </div>

            {/* Account Tabs */}
            <div className="flex gap-2 flex-wrap">
                {accounts.map((acc) => (
                    <button 
                        key={acc.accountId}
                        onClick={() => setAccount(acc)} 
                        className={`px-4 py-2 rounded-lg text-sm border transition
                            ${account?.accountId === acc.accountId 
                                ? "bg-black text-white border-black" 
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}`}
                    >
                        Account {acc.accountId}
                    </button>
                ))}
            </div>

            {/* Wallet Cards */}
            {account ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card publicKey={account.sol.solPublicKey} token="Solana" />
                    <Card publicKey={account.eth.ethPublicKey} token="Ethereum" />
                </div>
            ) : (
                <div className="text-center text-sm text-gray-500 py-10">
                    No account selected
                </div>
            )}

        </div>
    )
}
