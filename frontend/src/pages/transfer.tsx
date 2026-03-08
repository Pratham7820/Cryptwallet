import { useState } from "react"
import { sendSol } from "../lib/solana"
import { PublicKey } from "@solana/web3.js"
import { sendEth } from "../lib/ethers"
import { decryption } from "../lib/encryption"
import type { Account } from "./dashboard"

export default function Transfer({account,password}:{account:Account,password:string}){
    const [token,setToken] = useState("sol")
    const [address,setAddress] = useState("")
    const [amount,setAmount] = useState("")
    async function handleTransfer(){
        if(token=='sol'){
            const key = {
                encrypted : account.sol.encryptSolKey, 
                salt : account.sol.salt,
                iv : account.sol.iv
            }
            const secretKey = await decryption(password,key)
            const receipent = new PublicKey(address)
            const solSender = {
                publicKey : new PublicKey(account.sol.solPublicKey),
                secretKey : new Uint8Array(Buffer.from(secretKey))
            }
            const receipt = await sendSol(solSender,receipent,Number(amount))
            console.log(receipt)
        }
        else{
            const key = {
                encrypted : account.eth.encryptEthKey, 
                salt : account.eth.salt,
                iv : account.eth.iv
            }
            const secretKey = await decryption(password,key)
            const ethSender = {
                publicKey : account.eth.ethPublicKey,
                secretKey : secretKey
            }
            const receipt = await sendEth(ethSender,address,Number(amount))
            console.log(receipt)
        }
    }
    return(
        <div>
            <select onChange={(e)=>setToken(e.target.value)}>
                <option value="sol">Solana</option>
                <option value="eth">Ethereum</option>
            </select>
            <input type="text" placeholder="address" onChange={(e)=>setAddress(e.target.value)}/>
            <input type="number" placeholder="amount" onChange={(e)=>setAmount(e.target.value)}/>
            <button onClick={handleTransfer}>send</button>
        </div>
    )
}