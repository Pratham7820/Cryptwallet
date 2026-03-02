import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import { derivePath } from "ed25519-hd-key"
import nacl from "tweetnacl"

const connection = new Connection("https://solana-mainnet.g.alchemy.com/v2/bLXw8Sm4-5GIu6BSNVKM0")

export function generateSolWallet(seed: Buffer<ArrayBufferLike>, num: number) {
    const path = `m/44'/501'/${num}'/0'`; // Derivation path for Solana
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const publicKey = Keypair.fromSecretKey(secret).publicKey.toBase58()
    const secretKey = Keypair.fromSecretKey(secret).secretKey.toBase64()
    return {
        publicKey, secretKey
    }
}

export async function getSolBalance(pubKey: string) {
    try {
        const publicKey = new PublicKey(pubKey)
        const getbalance = await connection.getBalance(publicKey)
        const balance = getbalance/LAMPORTS_PER_SOL
        console.log(balance)
        return balance;
    }
    catch(e){
        console.log('error is here',e)
    }
}