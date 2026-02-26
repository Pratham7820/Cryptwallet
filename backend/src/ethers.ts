import { HDNodeWallet } from "ethers";

export function generateEthWallet(seed: Buffer<ArrayBufferLike>, num: number){
    const wallet = HDNodeWallet.fromSeed(seed)
    const value = wallet.derivePath(`m/44'/60'/0'/0/${num}`)
    const secretKey = value.privateKey
    const publicKey = value.publicKey
    return {
        secretKey,publicKey
    }
}