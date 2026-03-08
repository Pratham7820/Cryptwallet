import { useState } from "react"
import Home from "./home"
import { useLocation } from "react-router-dom"
import Transfer from "./transfer"

export interface Account{
    accountId : string,
    sol: {
        solPublicKey: string,
        encryptSolKey: ArrayBuffer,
        salt: Uint8Array<ArrayBuffer>,
        iv: Uint8Array<ArrayBuffer>
    },
    eth: {
        ethPublicKey: string,
        encryptEthKey: ArrayBuffer,
        salt: Uint8Array<ArrayBuffer>,
        iv: Uint8Array<ArrayBuffer>
    }
}

export default function Dashboard() {
    const [state,setState] = useState(0)
    const [selectedAccount,setSelectedAccount] = useState<Account | null>()
    const location = useLocation()
    const username = location.state.username
    const password = location.state.password

    const getAccount = (account:Account | null) => {
        console.log(account)
        setSelectedAccount(account)
    }

    return (
        <div className="grid grid-cols-5 h-screen">
            <div className="rounded-lg bg-gray-200 space-y-10 text-xl font-semibold pt-20">
                <h2 onClick={()=>setState(0)} className="hover:bg-blue-300 mx-2 p-3 rounded-lg ">Home</h2>
                <h2 onClick={()=>setState(1)} className="hover:bg-blue-300 mx-2 p-3 rounded-lg ">Transfer</h2>
                <h2 onClick={()=>setState(2)} className="hover:bg-blue-300 mx-2 p-3 rounded-lg ">Swap</h2>
                <h2 onClick={()=>setState(3)} className="hover:bg-blue-300 mx-2 p-3 rounded-lg ">History</h2>
            </div>
            <div className="grid col-span-4 pl-3">
                {state===0 && 
                    <Home username={username} password={password} handleAccount={getAccount} />
                }
                {state===1 && selectedAccount && 
                    <Transfer account = {selectedAccount} password={password}/>
                }
            </div>
        </div>
    )
}