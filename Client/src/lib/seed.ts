import { generateMnemonic } from "bip39";
import { db } from "./db";
import { addEthAcc} from "./ethers";
import { addSolAcc } from "./solana";
import { decryption, encryption } from "./encryption";
import bcrypt from "bcryptjs"

export async function encryptSeed(password: string, username: string) {
    const mnemonic = generateMnemonic()
    const encoder = new TextEncoder()
    const seed = encoder.encode(mnemonic)
    const value = await encryption(password, seed);
    const hashPassword = await bcrypt.hash(password,10);
    (db).add('seed', {
        username,
        hashPassword,
        encrypted: value.encrypted,
        salt: value.salt,
        iv: value.iv
    })
    return mnemonic;
}

export async function decryptSeed(password: string, username: string) {
    const value = await db.get('seed', username)
    const decoder = new TextDecoder()
    const compare = await bcrypt.compare(password,value.hashPassword)
    if(compare===false){
        return null;
    }
    const res = await decryption(password, value)
    return decoder.decode(res)
}


export async function addAcc(password: string, username: string, num: string) {
    const mnemonic = await decryptSeed(password, username)
    if(mnemonic===null) return
    const { solPublicKey, solSecretKey } = await addSolAcc(mnemonic, num)
    const { ethPublicKey, ethSecretKey } = await addEthAcc(mnemonic, num)
    const resSol = await encryption(password, solSecretKey)
    const resEth = await encryption(password, ethSecretKey)
    const key = {
                    accountId : num,
                    sol: {
                        solPublicKey,
                        encryptSolKey: resSol.encrypted,
                        salt: resSol.salt,
                        iv: resSol.iv
                    },
                    eth: {
                        ethPublicKey,
                        encryptEthKey: resEth.encrypted,
                        salt: resEth.salt,
                        iv: resEth.iv
                    }
                };
    db.add('accounts',key)
    return key
}