import express from "express"
import crypto from "crypto-js"
import { generateMnemonic, mnemonicToSeedSync } from "bip39"
import { generateSolWallet } from "./solana"
import { generateEthWallet } from "./ethers"
import cors from "cors"
const app = express()

app.use(express.json())
app.use(cors())

app.post("/generate",(req,res)=>{
    const { password } = req.body
    const mnemonic = generateMnemonic()
    const encrypt = crypto.AES.encrypt(mnemonic,password).toString();
    const seed = mnemonicToSeedSync(mnemonic)
    const sol = generateSolWallet(seed,1)
    const eth = generateEthWallet(seed,1)
    return res.json({
        mnemonic,
        encrypt,
        sol,
        eth
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


app.listen(8080)