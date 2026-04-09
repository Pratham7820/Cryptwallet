import { useEffect, useState } from "react"
import Home from "./home"
import { useLocation, useNavigate } from "react-router-dom"
import Transfer from "./transfer"
import { Swap } from "./swap"

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
    const [selectedAccount,setSelectedAccount] = useState<Account | null>(null)
    const location = useLocation()
    const username = location.state?.username
    const password = location.state?.password
    const navigate = useNavigate()

    useEffect(()=>{
        if(!username || !password){
            navigate("/")
        }
    },[])

    const getAccount = (account:Account | null) => {
        setSelectedAccount(account)
    }

    const menu = ["Home","Transfer","Swap","History"]

    return (
        <div className="h-screen flex bg-gray-50">

            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between">
                <div>
                    <h1 className="text-2xl font-bold p-6 text-black">Wallet</h1>

                    <div className="space-y-2 px-3">
                        {menu.map((item,index)=> (
                            <div
                                key={index}
                                onClick={()=>setState(index)}
                                className={`cursor-pointer px-4 py-3 rounded-lg transition-all duration-200 text-sm
                                    ${state===index 
                                        ? "bg-black text-white" 
                                        : "hover:bg-gray-100 text-gray-700"}`}
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 text-sm text-gray-500 border-t">
                    Logged in as <span className="font-semibold text-black">{username}</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-y-auto">
                <div className="bg-white rounded-2xl border border-gray-200 p-6 h-full">

                    {state===0 && 
                        <Home username={username} password={password} handleAccount={getAccount} />
                    }

                    {state===1 && selectedAccount && 
                        <Transfer account = {selectedAccount} password={password}/>
                    }

                    {state===2 && selectedAccount && 
                        <Swap sender = {selectedAccount} password={password} />
                    }

                    {state===3 && (
                        <div className="text-gray-500 text-center mt-20 text-sm">
                            Transaction History Coming Soon...
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}