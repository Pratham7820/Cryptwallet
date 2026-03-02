import express from "express"
import crypto from "crypto-js"
import { generateMnemonic, mnemonicToSeedSync } from "bip39"
import { generateSolWallet, getSolBalance } from "./solana"
import { generateEthWallet, getEthBalance } from "./ethers"
import cors from "cors"
const app = express()

app.use(express.json())
app.use(cors())

app.post("/generate",(req,res)=>{
    const { username ,password } = req.body
    const mnemonic = generateMnemonic()
    const encrypt = crypto.AES.encrypt(mnemonic,password).toString();
    return res.json({
        mnemonic,
        encrypt
    })
})

app.post("/accounts",(req,res)=>{
    const { mnemonic , num } = req.body
    if(!mnemonic || !num){
        return res.json({
            message : "input field not valid"
        })
    }
    const seed = mnemonicToSeedSync(mnemonic)
    const sol = generateSolWallet(seed,num)
    const eth = generateEthWallet(seed,num)
    return res.json({
        sol,eth
    })
})

app.post("/balance",async (req,res)=>{
    const { sol , eth } = req.body
    if(!sol || !eth){
        return res.json("all field not provided")
    }
    const solBalance = JSON.stringify(await getSolBalance(sol))
    const ethBalance = await getEthBalance(eth)
    return res.json({
        solBalance,
        ethBalance
    })
})

app.listen(8080)