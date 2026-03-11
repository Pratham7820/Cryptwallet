import { useEffect, useState } from "react"
import { getSolBalance } from "../lib/solana";
import { getEthBalance } from "../lib/ethers";

export function Card({publicKey,token}:{publicKey:string,token:string}){
    const [balance,setBalance] = useState<number>()
    useEffect(()=>{
        if(!publicKey) return
        async function fetchBalance(){
            let res;
            if(token=='Solana'){
                res = await getSolBalance(publicKey)
            }
            else {
                res = await getEthBalance(publicKey)
            }
            setBalance(res)
        }
        fetchBalance()
    },[publicKey,token])

    return (
        <div className="border rounded-lg border-black p-2 space-y-3 max-h-130 max-w-125">
            <h2>Token : {token}</h2>
            <div>
                PublicKey : {publicKey}
            </div>
            <div>
                Balance : {balance}
            </div>
        </div>
    )
}