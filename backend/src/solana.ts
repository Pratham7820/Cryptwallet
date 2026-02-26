import { Keypair } from "@solana/web3.js"
import { derivePath } from "ed25519-hd-key"
import nacl from "tweetnacl"

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