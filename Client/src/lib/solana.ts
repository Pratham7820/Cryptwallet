import { mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key"
import nacl from "tweetnacl"
import { Keypair } from "@solana/web3.js";
import { Connection, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";

const connection = new Connection(import.meta.env.VITE_SOLRPC_URL)

export async function addSolAcc(mnemonic: string, num: string) {
    const path = `m/44'/501'/${num}'/0'`
    const seed = mnemonicToSeedSync(mnemonic)
    const deriveSeed = derivePath(path, seed.toString('hex')).key
    const secret = nacl.sign.keyPair.fromSeed(deriveSeed).secretKey;
    const solPublicKey = Keypair.fromSecretKey(secret).publicKey.toBase58()
    const solSecretKey = Keypair.fromSecretKey(secret).secretKey as Uint8Array<ArrayBuffer>
    return {
        solPublicKey,
        solSecretKey
    }
}

export async function getSolBalance(address: string) {
    const balance = await connection.getBalance(new PublicKey(address))
    return balance
}

export async function sendSol(sender: Keypair, address: PublicKey, amount: number) {
    const balance = await connection.getBalance(sender.publicKey)
    if (balance < amount) {
        return { msg: "insufficient balance" };
    }
    const tx = SystemProgram.transfer({
        fromPubkey: sender.publicKey,
        toPubkey: address,
        lamports: amount * LAMPORTS_PER_SOL
    })
    const transaction = new Transaction().add(tx)
    const signature = await sendAndConfirmTransaction(connection, transaction, [sender])
    return { msg: "transactioin successfull", signature }
}

