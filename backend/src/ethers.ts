import { HDNodeWallet , ethers} from "ethers";

const provider = new ethers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/bLXw8Sm4-5GIu6BSNVKM0")

export function generateEthWallet(seed: Buffer<ArrayBufferLike>, num: number){
    const wallet = HDNodeWallet.fromSeed(seed)
    const value = wallet.derivePath(`m/44'/60'/0'/0/${num}`)
    const secretKey = value.privateKey
    const publicKey = value.publicKey
    return {
        secretKey,publicKey
    }
}

export async function getEthBalance(pubKey:string){
    const balance = await provider.getBalance(pubKey)
    const balanceEth = ethers.formatEther(balance); 
    return balanceEth
}