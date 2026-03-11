import type { Account } from "./dashboard"
import { useEffect, useState } from "react"
import { db } from "../lib/db"
import { useNavigate } from "react-router-dom"
import { addAcc } from "../lib/seed"
import { Card } from "../components/Card"

export default function Home({ username, password,handleAccount }: { username: string, password: string,handleAccount:(account : Account | null)=>void}) {
    const [accounts, setAccounts] = useState<Account[]>([])
    const [account, setAccount] = useState<Account | null>()
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
        setAccounts(prev => [
            ...prev,
            res
        ])
        setAccount(res)
    }
    return (
        <div className="space-y-3">
            <header className="flex gap-2 mt-2 text-center mb-6">
                {accounts.map((account) => (
                    <button onClick={() => setAccount(account)} className="px-4 py-2 border rounded-lg border-black" key={account.accountId}>
                        Account {account.accountId}
                    </button>
                ))}
                <button className="border rounded-full pb-1 px-3 font-bold text-2xl" onClick={addAccount}>
                    +
                </button>
            </header>
            <section className="flex gap-5">
                {account && (
                    <>
                        <Card publicKey={account.sol.solPublicKey} token="Solana" />
                        <Card publicKey={account.eth.ethPublicKey} token="Ethereum" />
                    </>
                )}
            </section>
        </div>
    )
}

