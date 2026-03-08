import { mnemonicToSeedSync } from "bip39";
import { ethers, formatEther, HDNodeWallet } from "ethers";
import { Wallet } from "ethers";

const provider = new ethers.JsonRpcProvider(import.meta.env.VITE_ETHRPC_URL)

export async function addEthAcc(mnemonic:string,num:string){
    const seed = mnemonicToSeedSync(mnemonic)
    const wallet = HDNodeWallet.fromSeed(seed)
    const value = wallet.derivePath(`m/44'/60'/0'/0/${num}`)
    const ethSecretKey = value.privateKey
    const ethPublicKey = value.address
    return {
        ethPublicKey,
        ethSecretKey
    }
}

interface ethSender{
    publicKey : string,
    secretKey : string
}

export async function getEthBalance(address:string){
    const balance = formatEther(await provider.getBalance(address))
    console.log(balance)
    return Number(balance)
}

export async function sendEth(sender:ethSender,address:string,amount:number){
    const balance = await provider.getBalance(sender.publicKey)
    if(balance < amount){
        return {msg : "insufficient balance"}
    }
    const wallet = new Wallet(sender.secretKey,provider)
    const tx = await wallet.sendTransaction({
        to: address,
        value: amount
    })
    return {
        msg : 'transaction successfull',
        tx
    }
}