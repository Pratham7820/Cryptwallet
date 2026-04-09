import { useEffect, useState } from "react";
import type { Account } from "./dashboard";
import { decryption } from "../lib/encryption";
import axios from "axios";
import { Keypair, VersionedTransaction } from "@solana/web3.js";

interface solToken {
  id: string;
  symbol?: string;
  decimals: number;
}

interface OrderResponse {
  inputMint: string;
  outputMint: string;
  inAmount: string; // Input amount in native units
  outAmount: string; // Expected output in native units
  otherAmountThreshold: string; // Minimum output after slippage
  swapMode: string; // "ExactIn"
  slippageBps: number; // Set automatically by RTSE
  routePlan: RoutePlan[];
  router: "iris" | "jupiterz" | "dflow" | "okx";
  transaction: string | null; // Base64 unsigned tx (null if no taker)
  requestId: string; // Pass to /execute
  gasless: boolean;
  feeBps: number; // Total fee in bps
  feeMint: string; // Token mint fees are collected in
  inUsdValue: number;
  outUsdValue: number;
  priceImpact: number;
  signatureFeeLamports: number;
  prioritizationFeeLamports: number;
  rentFeeLamports: number;
  totalTime: number;
  quoteId?: string;
  maker?: string;
  expireAt?: string;
  errorCode?: number;
  errorMessage?: string;
}

interface RoutePlan {
  swapInfo: {
    ammKey: string;
    label: string;
    inputMint: string;
    outputMint: string;
    inAmount: string;
    outAmount: string;
  };
  percent: number;
  bps: number;
}

export function Swap({
  sender,
  password,
}: {
  sender: Account;
  password: string;
}) {
  const [allTokens, setAllTokens] = useState<solToken[]>([]);
  const [inputToken, setInputToken] = useState<solToken>();
  const [outputToken, setOutputToken] = useState<solToken>();
  const [inAmount, setInAmount] = useState("");
  const [outAmount, setOutAmount] = useState("");
  const [order, setOrder] = useState<OrderResponse>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function getTokens() {
      const response = await axios.get(
        `${import.meta.env.VITE_JUP_URL}/tokens/v2/tag`,
        {
          params: {
            query: "verified",
          },
          headers: {
            "x-api-key": `${import.meta.env.VITE_JUP_API}`,
          },
        },
      );
      const tokenArr = response.data.splice(0, 11);
      setAllTokens(tokenArr);
      setInputToken(tokenArr[0]);
      setOutputToken(tokenArr[1]);
    }
    getTokens();
  }, []);

  async function handleChange(amount: string | null) {
    if (!amount || !inputToken || !outputToken) return;
    setInAmount(amount);
    const res = await axios.get(
      `${import.meta.env.VITE_JUP_URL}/ultra/v1/order`,
      {
        params: {
          inputMint: inputToken.id,
          outputMint: outputToken.id,
          amount: Number(amount) * Math.pow(10, inputToken.decimals),
          taker: sender.sol.solPublicKey,
        },
        headers: {
          "x-api-key": `${import.meta.env.VITE_JUP_API}`,
        },
      },
    );
    setOrder(res.data);
    const value =
      Number(res.data.outAmount) / Math.pow(10, outputToken.decimals);
    setOutAmount(value.toString());
  }

  async function handleSwap() {
    if (!inputToken || !inAmount) return;
    try {
      setLoading(true);
      console.log(order);
      const data = {
        encrypted: sender.sol.encryptSolKey,
        salt: sender.sol.salt,
        iv: sender.sol.iv,
      };
      const secretKey = new Uint8Array(await decryption(password, data));
      const wallet = Keypair.fromSecretKey(secretKey);
      if (!order?.transaction) {
        throw new Error(order?.errorMessage || "No transaction returned");
      }
      const transaction = VersionedTransaction.deserialize(
        Buffer.from(order.transaction, "base64"),
      );
      transaction.sign([wallet]);
      const signedTransaction = Buffer.from(transaction.serialize()).toString(
        "base64",
      );

      const executeResponse = await axios.post(
        `${import.meta.env.VITE_JUP_URL}/ultra/v1/execute`,
        {
          signedTransaction,
          requestId: order.requestId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": `${import.meta.env.VITE_JUP_API}`,
          },
        },
      );
      if (executeResponse.data.status === "Success") {
        console.log(
          `Done: https://solscan.io/tx/${executeResponse.data.signature}`,
        );
        console.log(
          `In: ${executeResponse.data.inputAmountResult} | Out: ${executeResponse.data.outputAmountResult}`,
        );
      } else {
        console.error(
          `Failed (${executeResponse.data.code}): ${executeResponse.data.error}`,
        );
      }
    } catch (e) {
      console.log(e);
      alert("error while swapping");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Swap</h2>
        <p className="text-sm text-gray-500">Swap tokens onchain</p>
      </div>
      <div className=" flex justify-between items-center bg-white border border-gray-200 rounded-2xl p-6">
        <div>
          <p className="text-sm text-gray-500 pl-2">Sell:</p>
          <select
            onChange={(e) => {
              setInputToken(JSON.parse(e.target.value));
              handleChange(inAmount);
            }}
            className="border bg-gray-300 rounded-full px-3 py-1 text-center"
          >
            {allTokens.map((token, index) => (
              <option
                key={index}
                value={JSON.stringify({
                  id: token.id,
                  decimals: token.decimals,
                })}
              >
                {token.symbol}
              </option>
            ))}
          </select>
        </div>
        <input
          onChange={(e) => handleChange(e.target.value)}
          type="text"
          placeholder="0.00"
          className="outline-none text-right text-2xl"
        />
      </div>
      <div className=" flex justify-between items-center bg-white border border-gray-200 rounded-2xl p-6">
        <div>
          <p className="text-sm text-gray-500 pl-2">Buy:</p>
          <select
            onChange={(e) => {
              setOutputToken(JSON.parse(e.target.value));
            }}
            className="border bg-gray-300 rounded-full px-3 py-1 text-center"
          >
            {allTokens.map((token, index) => (
              <option
                key={index}
                value={JSON.stringify({
                  id: token.id,
                  decimals: token.decimals,
                })}
              >
                {token.symbol}
              </option>
            ))}
          </select>
        </div>
        <input
          value={outAmount}
          type="text"
          placeholder="0.00"
          className="outline-none text-right text-2xl"
          readOnly
        />
      </div>
      <button
        onClick={handleSwap}
        disabled={loading}
        className="w-full bg-black text-white py-3 rounded-lg text-sm font-medium hover:bg-gray-900 transition disabled:opacity-50"
      >
        {loading ? "Swaping..." : "Swap"}
      </button>
    </div>
  );
}
