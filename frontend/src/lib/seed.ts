import { generateMnemonic } from "bip39";
import { db } from "./db";
import { addEthAcc, getEthBalance } from "./ethers";
import { addSolAcc, getSolBalance } from "./solana";
import { decryption, encryption } from "./encryption";

export async function encryptSeed(password: string, username: string) {
    const mnemonic = generateMnemonic()
    const value = await encryption(password, mnemonic);
    (db).add('seed', {
        username,
        encrypted: value.encrypted,
        salt: value.salt,
        iv: value.iv
    })
    return mnemonic;
}

export async function decryptSeed(password: string, username: string) {
    const value = await db.get('seed', username)
    const res = await decryption(password, value)
    return res
}


export async function addAcc(password: string, username: string, num: string) {
    const mnemonic = await decryptSeed(password, username)
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